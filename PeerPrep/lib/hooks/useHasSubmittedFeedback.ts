import { useState, useEffect } from "react";
import * as feedbackApi from "../api/feedback";

/**
 * Hook to check if current user has already submitted feedback for a session
 * Useful for determining whether to show feedback form or summary
 */
export const useHasSubmittedFeedback = (sessionId: string) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSubmission = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔎 Checking if feedback submitted for session:", sessionId);

      const result = await feedbackApi.hasUserSubmittedFeedback(sessionId);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setHasSubmitted(result.data || false);
      setIsLoading(false);
    } catch (err: any) {
      console.error("❌ Error checking feedback submission:", err);
      setError(err.message || "Failed to check submission status");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      checkSubmission();
    }
  }, [sessionId]);

  const refetch = async () => {
    await checkSubmission();
  };

  return {
    hasSubmitted,
    isLoading,
    error,
    refetch,
  };
};
