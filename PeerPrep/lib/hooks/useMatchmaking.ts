import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import * as matchmakingApi from "../api/matchmaking";
import { useSessionStore } from "../../stores/sessionStore";

/**
 * Custom hook for real-time matchmaking
 * Handles queue joining, polling for matches, and navigation
 */
export const useMatchmaking = (
  topicId: string | string[] | undefined,
  difficulty: string | string[] | undefined
) => {
  const router = useRouter();
  const setCurrentSession = useSessionStore((state) => state.setCurrentSession);

  const [status, setStatus] = useState<"searching" | "found" | "error">(
    "searching"
  );
  const [queuePosition, setQueuePosition] = useState<number>(1);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number>(60);
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
    console.log("🔵 useMatchmaking: Effect triggered", { topicId, difficulty });

    if (!topicId || !difficulty) {
      console.log("⚠️ useMatchmaking: Missing topicId or difficulty");
      return;
    }

    let isCancelled = false;
    let pollInterval: NodeJS.Timeout;

    const startMatchmaking = async () => {
      try {
        console.log("🟢 Starting matchmaking...", { topicId, difficulty });

        // Join the queue
        const joinResult = await matchmakingApi.joinQueue(
          topicId as string,
          difficulty as string
        );

        console.log("📥 Join queue result:", joinResult);

        if (isCancelled) return;

        if (joinResult.error) {
          setError(joinResult.error);
          setStatus("error");
          return;
        }

        // Check if we got an immediate match
        if (joinResult.data && matchmakingApi.isMatchResult(joinResult.data)) {
          // Matched immediately!
          setStatus("found");

          // Store session stub (will fetch full session in session screen)
          setCurrentSessionRef.current({
            id: joinResult.data.sessionId,
            topic_id: joinResult.data.topicId,
            topic_name: joinResult.data.topicName,
            partner_id: joinResult.data.partnerId,
            partner_name: joinResult.data.partnerName,
            partner_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              joinResult.data.partnerName
            )}`,
            status: "active",
            started_at: new Date().toISOString(),
            duration_minutes: 25,
            question: {
              id: "mock-1",
              title: "Two Sum",
              prompt:
                "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
              difficulty: "Easy",
              topic: joinResult.data.topicName,
              hints: [
                "Use a hash map to store values and their indices",
                "For each number, check if target - number exists in the map",
              ],
            },
          });

          // Navigate to session
          setTimeout(() => {
            routerRef.current.replace("/(app)/session");
          }, 2000);
          return;
        }

        // Still in queue - start polling
        if (joinResult.data && "isInQueue" in joinResult.data) {
          setQueuePosition(joinResult.data.position);
          setEstimatedWaitTime(joinResult.data.estimatedWaitTime);
        }

        // Poll every 3 seconds for matches
        pollInterval = setInterval(async () => {
          if (isCancelled) {
            clearInterval(pollInterval);
            return;
          }

          const statusResult = await matchmakingApi.checkQueueStatus();

          if (statusResult.error) {
            clearInterval(pollInterval);
            setError(statusResult.error);
            setStatus("error");
            return;
          }

          if (statusResult.data) {
            // Check if matched
            if (matchmakingApi.isMatchResult(statusResult.data)) {
              clearInterval(pollInterval);
              setStatus("found");

              // Store session stub
              setCurrentSessionRef.current({
                id: statusResult.data.sessionId,
                topic_id: statusResult.data.topicId,
                topic_name: statusResult.data.topicName,
                partner_id: statusResult.data.partnerId,
                partner_name: statusResult.data.partnerName,
                partner_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  statusResult.data.partnerName
                )}`,
                status: "active",
                started_at: new Date().toISOString(),
                duration_minutes: 25,
                question: {
                  id: "mock-1",
                  title: "Two Sum",
                  prompt:
                    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
                  difficulty: "Easy",
                  topic: statusResult.data.topicName,
                  hints: [
                    "Use a hash map to store values and their indices",
                    "For each number, check if target - number exists in the map",
                  ],
                },
              });

              // Navigate to session
              setTimeout(() => {
                routerRef.current.replace("/(app)/session");
              }, 2000);
            } else {
              // Still in queue - update position
              setQueuePosition(statusResult.data.position);
              setEstimatedWaitTime(statusResult.data.estimatedWaitTime);
            }
          }
        }, 3000);
      } catch (err: any) {
        if (!isCancelled) {
          setError(
            err.message || "Failed to start matchmaking. Please try again."
          );
          setStatus("error");
        }
      }
    };

    startMatchmaking();

    return () => {
      isCancelled = true;
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      // Clean up queue
      matchmakingApi.leaveQueue();
    };
  }, [topicId, difficulty]);

  const handleCancel = async () => {
    await matchmakingApi.leaveQueue();
    routerRef.current.back();
  };

  const handleRetry = (retryDifficulty: string | string[] | undefined) => {
    setError("");
    setStatus("searching");
    routerRef.current.replace({
      pathname: "/(app)/queue",
      params: { topicId, difficulty: retryDifficulty },
    });
  };

  return {
    status,
    queuePosition,
    estimatedWaitTime,
    error,
    handleCancel,
    handleRetry,
  };
};
