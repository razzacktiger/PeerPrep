import { useState, useEffect } from "react";

/**
 * Custom hook for managing queue progress bar and countdown timer
 */
export const useQueueProgress = (
  status: "searching" | "found" | "error",
  initialTime: number = 30
) => {
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(initialTime);

  // Countdown timer
  useEffect(() => {
    if (status !== "searching") return;

    const interval = setInterval(() => {
      setEstimatedTime((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // Progress bar animation
  useEffect(() => {
    if (status !== "searching") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 0.6) return prev; // Stop at 60%
        return prev + 0.02;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [status]);

  // Set progress to 100% when found
  useEffect(() => {
    if (status === "found") {
      setProgress(1);
    }
  }, [status]);

  const resetProgress = () => {
    setProgress(0);
    setEstimatedTime(initialTime);
  };

  return {
    progress,
    estimatedTime,
    resetProgress,
  };
};
