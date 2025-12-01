import { useState, useEffect } from "react";
import * as feedbackApi from "../api/feedback";
import { PeerFeedback, AIFeedback } from "../types";

/**
 * Hook for fetching feedback received for a specific session
 * Retrieves both peer feedback and AI feedback
 */
export const useSessionFeedback = (sessionId: string) => {
  const [peerFeedback, setPeerFeedback] = useState<PeerFeedback[]>([]);
  const [aiFeedback, setAIFeedback] = useState<AIFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔍 Fetching session feedback for:", sessionId);

      const result = await feedbackApi.getSessionFeedback(sessionId);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      if (result.data) {
        setPeerFeedback(result.data.peer || []);
        setAIFeedback(result.data.ai || null);
      }

      setIsLoading(false);
    } catch (err: any) {
      console.error("❌ Error fetching session feedback:", err);
      setError(err.message || "Failed to fetch feedback");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchFeedback();
    }
  }, [sessionId]);

  const refetch = async () => {
    await fetchFeedback();
  };

  return {
    peerFeedback,
    aiFeedback,
    isLoading,
    error,
    refetch,
  };
};
