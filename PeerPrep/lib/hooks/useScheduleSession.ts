/**
 * Hook for managing scheduled session creation
 * Handles form state, validation, and submission
 */

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { createScheduledSession } from "../api/scheduling";

export interface ScheduleFormState {
  topicId: string;
  difficulty: string;
  date: string;
  time: string;
  duration: string;
}

interface UseScheduleSessionReturn {
  // Form state
  formState: ScheduleFormState;
  setFormState: (state: ScheduleFormState) => void;
  updateField: <K extends keyof ScheduleFormState>(
    key: K,
    value: ScheduleFormState[K]
  ) => void;
  resetForm: () => void;

  // Submission
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  scheduleSession: () => Promise<void>;

  // Validation
  getValidationError: () => string | null;
}

const initialState: ScheduleFormState = {
  topicId: "",
  difficulty: "",
  date: "",
  time: "",
  duration: "",
};

export function useScheduleSession(): UseScheduleSessionReturn {
  const [formState, setFormState] = useState<ScheduleFormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validation helper
  const isFormValid = useCallback(() => {
    return (
      formState.topicId &&
      formState.difficulty &&
      formState.date &&
      formState.time &&
      formState.duration
    );
  }, [formState]);

  const getValidationError = useCallback((): string | null => {
    if (!formState.topicId) return "Please select a topic";
    if (!formState.difficulty) return "Please select difficulty level";
    if (!formState.date) return "Please select a date";
    if (!formState.time) return "Please select a time";
    if (!formState.duration) return "Please select a duration";
    return null;
  }, [formState]);

  // Combine date and time into ISO timestamp
  const getScheduledForTimestamp = useCallback(() => {
    if (!formState.date || !formState.time) return "";

    try {
      // Parse date (format: YYYY-MM-DD)
      const [year, month, day] = formState.date.split("-").map(Number);

      // Parse time (format: HH:MM AM/PM)
      const timeRegex = /(\d{1,2}):(\d{2})\s(AM|PM)/i;
      const timeMatch = formState.time.match(timeRegex);
      
      if (!timeMatch) {
        console.error("Invalid time format:", formState.time);
        return "";
      }

      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const period = timeMatch[3].toUpperCase();

      // Convert 12-hour to 24-hour format
      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      // Create datetime and convert to ISO string
      const dateTime = new Date(year, month - 1, day, hours, minutes);
      return dateTime.toISOString();
    } catch (e) {
      console.error("Error parsing date/time:", e);
      return "";
    }
  }, [formState.date, formState.time]);

  // Get duration in minutes
  const getDurationMinutes = useCallback(() => {
    const durationMap: Record<string, number> = {
      "30 minutes": 30,
      "45 minutes": 45,
      "60 minutes": 60,
    };
    return durationMap[formState.duration] || 30;
  }, [formState.duration]);

  // Mutation for creating scheduled session
  const mutation = useMutation({
    mutationFn: async () => {
      const scheduledFor = getScheduledForTimestamp();
      if (!scheduledFor) {
        throw new Error("Invalid date or time");
      }

      const result = await createScheduledSession(
        formState.topicId,
        scheduledFor,
        formState.difficulty as "Easy" | "Medium" | "Hard",
        getDurationMinutes()
      );

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: () => {
      console.log("✅ Session scheduled successfully");
      setSuccess(true);
      setError(null);
      setFormState(initialState);
    },
    onError: (err: any) => {
      console.error("❌ Failed to schedule session:", err);
      setError(err.message || "Failed to schedule session");
      setSuccess(false);
    },
  });

  const scheduleSession = useCallback(async () => {
    console.log("📅 Attempting to schedule session...");

    // Validate form
    const validationError = getValidationError();
    if (validationError) {
      console.log("⚠️ Validation error:", validationError);
      setError(validationError);
      setSuccess(false);
      return;
    }

    // Submit
    await mutation.mutate();
  }, [mutation, getValidationError]);

  return {
    formState,
    setFormState,
    updateField: (key, value) => {
      setFormState((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    resetForm: () => setFormState(initialState),
    isSubmitting: mutation.isPending,
    error: error || (mutation.isError ? "Failed to schedule session" : null),
    success,
    scheduleSession,
    getValidationError,
  };
}
