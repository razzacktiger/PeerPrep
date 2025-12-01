import { useState } from "react";
import * as feedbackApi from "../api/feedback";

interface FeedbackFormData {
  clarity: number;
  correctness: number;
  confidence: number;
  comments?: string;
}

/**
 * Hook for managing feedback submission form state and API calls
 * Handles collecting ratings, tags, and comments, then submitting to backend
 */
export const useFeedbackSubmission = (
  sessionId: string,
  recipientId: string
) => {
  const [clarity, setClarity] = useState(0);
  const [correctness, setCorrectness] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [comments, setComments] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const submitFeedback = async () => {
    // Validation
    if (clarity === 0 || correctness === 0 || confidence === 0) {
      setError("Please provide ratings for clarity, correctness, and confidence");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare feedback data
      const feedbackData: FeedbackFormData = {
        clarity,
        correctness,
        confidence,
        comments: comments || selectedTags.join(", ") || undefined,
      };

      console.log("📤 Submitting feedback:", {
        sessionId,
        recipientId,
        feedbackData,
      });

      // Submit peer feedback
      const submitResult = await feedbackApi.submitPeerFeedback(
        sessionId,
        recipientId,
        feedbackData
      );

      if (submitResult.error) {
        setError(submitResult.error);
        setIsSubmitting(false);
        return;
      }

      console.log("✅ Feedback submitted successfully");

      // Update user's average score
      const updateResult = await feedbackApi.updateUserAverageScore();

      if (updateResult.error) {
        console.warn("⚠️ Warning: Failed to update average score:", updateResult.error);
        // Don't fail - submission already succeeded
      }

      setSuccess(true);
      setIsSubmitting(false);
    } catch (err: any) {
      console.error("❌ Error submitting feedback:", err);
      setError(err.message || "Failed to submit feedback");
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setClarity(0);
    setCorrectness(0);
    setConfidence(0);
    setComments("");
    setSelectedTags([]);
    setError(null);
    setSuccess(false);
  };

  return {
    // State
    clarity,
    correctness,
    confidence,
    comments,
    selectedTags,
    isSubmitting,
    error,
    success,
    // Setters
    setClarity,
    setCorrectness,
    setConfidence,
    setComments,
    toggleTag,
    // Actions
    submitFeedback,
    reset,
  };
};
