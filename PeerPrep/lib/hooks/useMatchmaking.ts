import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import * as matchmakingApi from "../api/matchmaking";
import { useSessionStore } from "../../stores/sessionStore";

/**
 * Custom hook for managing matchmaking logic
 * Handles finding matches, error states, and navigation
 */
export const useMatchmaking = (topicId: string | string[] | undefined) => {
  const router = useRouter();
  const setCurrentSession = useSessionStore((state) => state.setCurrentSession);

  const [status, setStatus] = useState<"searching" | "found" | "error">(
    "searching"
  );
  const [error, setError] = useState("");
  
  // Use refs to avoid including router and setCurrentSession in dependencies
  const routerRef = useRef(router);
  const setCurrentSessionRef = useRef(setCurrentSession);
  
  // Keep refs updated
  useEffect(() => {
    routerRef.current = router;
    setCurrentSessionRef.current = setCurrentSession;
  });

  // Start matchmaking
  useEffect(() => {
    if (!topicId) {
      return;
    }

    let isCancelled = false;
    let timeoutId: NodeJS.Timeout;

    const findMatch = async () => {
      try {
        // Set a timeout for matchmaking (30 seconds)
        timeoutId = setTimeout(() => {
          if (!isCancelled) {
            setError("Matchmaking is taking longer than expected. Please try again.");
            setStatus("error");
          }
        }, 30000);

        const result = await matchmakingApi.findMatch(topicId as string);

        // Clear timeout if we get a result
        clearTimeout(timeoutId);

        if (isCancelled) {
          return;
        }

        if (result.error) {
          setError(result.error);
          setStatus("error");
          return;
        }

        if (result.data) {
          // Store session in global state
          setCurrentSessionRef.current(result.data);

          // Show success state
          setStatus("found");

          // Navigate to session room after delay
          setTimeout(() => {
            routerRef.current.replace("/(app)/session");
          }, 2000);
        } else {
          // Handle case where there's no error but also no data
          setError("No match found. Please try again.");
          setStatus("error");
        }
      } catch (err) {
        clearTimeout(timeoutId);
        if (!isCancelled) {
          setError("Failed to find a match. Please try again.");
          setStatus("error");
        }
      }
    };

    findMatch();

    return () => {
      isCancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [topicId]);

  const handleCancel = async () => {
    await matchmakingApi.cancelMatch();
    routerRef.current.back();
  };

  const handleRetry = (difficulty: string | string[] | undefined) => {
    setError("");
    setStatus("searching");
    routerRef.current.replace({
      pathname: "/(app)/queue",
      params: { topicId, difficulty },
    });
  };

  return {
    status,
    error,
    handleCancel,
    handleRetry,
  };
};
