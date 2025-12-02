/**
 * Hook for fetching and managing user's scheduled sessions
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getScheduledSessions,
  getUpcomingScheduledSessions,
  confirmScheduledSession,
  cancelScheduledSession,
} from "../api/scheduling";
import { ScheduledSession } from "../types";

export interface UseScheduledSessionsReturn {
  // Pending sessions (awaiting confirmation)
  pendingSessions: ScheduledSession[];
  isPendingLoading: boolean;
  pendingError: string | null;

  // Confirmed sessions
  confirmedSessions: ScheduledSession[];
  isConfirmedLoading: boolean;
  confirmedError: string | null;

  // Upcoming sessions (next 7 days)
  upcomingSessions: ScheduledSession[];
  isUpcomingLoading: boolean;
  upcomingError: string | null;

  // All sessions combined
  allSessions: ScheduledSession[];
  isAllLoading: boolean;

  // Actions
  confirmSession: (sessionId: string) => Promise<void>;
  cancelSession: (sessionId: string) => Promise<void>;
  isConfirming: boolean;
  isCancelling: boolean;

  // Refetch
  refetch: () => Promise<void>;
}

export function useScheduledSessions(): UseScheduledSessionsReturn {
  const queryClient = useQueryClient();

  // Fetch pending sessions
  const pendingQuery = useQuery({
    queryKey: ["scheduledSessions", "pending"],
    queryFn: async () => {
      const result = await getScheduledSessions("pending");
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
  });

  // Fetch confirmed sessions
  const confirmedQuery = useQuery({
    queryKey: ["scheduledSessions", "confirmed"],
    queryFn: async () => {
      const result = await getScheduledSessions("confirmed");
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
  });

  // Fetch upcoming sessions
  const upcomingQuery = useQuery({
    queryKey: ["scheduledSessions", "upcoming"],
    queryFn: async () => {
      const result = await getUpcomingScheduledSessions(7);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
  });

  // Confirm session mutation
  const confirmMutation = useMutation({
    mutationFn: confirmScheduledSession,
    onSuccess: () => {
      console.log("✅ Session confirmed");
      // Invalidate and refetch all related queries
      queryClient.invalidateQueries({ queryKey: ["scheduledSessions"] });
    },
    onError: (error: any) => {
      console.error("❌ Error confirming session:", error);
    },
  });

  // Cancel session mutation
  const cancelMutation = useMutation({
    mutationFn: (sessionId: string) => cancelScheduledSession(sessionId),
    onSuccess: () => {
      console.log("❌ Session cancelled");
      // Invalidate and refetch all related queries
      queryClient.invalidateQueries({ queryKey: ["scheduledSessions"] });
    },
    onError: (error: any) => {
      console.error("❌ Error cancelling session:", error);
    },
  });

  const handleConfirmSession = async (sessionId: string) => {
    console.log("✅ Confirming session:", sessionId);
    try {
      const result = await confirmSessionAsync(sessionId);
      if (result.error) {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error confirming session:", error);
      throw error;
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    console.log("❌ Cancelling session:", sessionId);
    try {
      const result = await cancelSessionAsync(sessionId);
      if (result.error) {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error cancelling session:", error);
      throw error;
    }
  };

  // Helper functions for mutations
  const confirmSessionAsync = (sessionId: string) =>
    confirmMutation.mutateAsync(sessionId);

  const cancelSessionAsync = (sessionId: string) =>
    cancelMutation.mutateAsync(sessionId);

  const refetch = async () => {
    console.log("🔄 Refetching all scheduled sessions...");
    await Promise.all([
      pendingQuery.refetch(),
      confirmedQuery.refetch(),
      upcomingQuery.refetch(),
    ]);
  };

  const allSessions = [
    ...(pendingQuery.data || []),
    ...(confirmedQuery.data || []),
  ];

  return {
    // Pending
    pendingSessions: pendingQuery.data || [],
    isPendingLoading: pendingQuery.isLoading,
    pendingError: pendingQuery.error ? (pendingQuery.error as Error).message : null,

    // Confirmed
    confirmedSessions: confirmedQuery.data || [],
    isConfirmedLoading: confirmedQuery.isLoading,
    confirmedError: confirmedQuery.error ? (confirmedQuery.error as Error).message : null,

    // Upcoming
    upcomingSessions: upcomingQuery.data || [],
    isUpcomingLoading: upcomingQuery.isLoading,
    upcomingError: upcomingQuery.error ? (upcomingQuery.error as Error).message : null,

    // All
    allSessions,
    isAllLoading: pendingQuery.isLoading || confirmedQuery.isLoading,

    // Actions
    confirmSession: handleConfirmSession,
    cancelSession: handleCancelSession,
    isConfirming: confirmMutation.isPending,
    isCancelling: cancelMutation.isPending,

    // Refetch
    refetch,
  };
}
