/**
 * Hook for managing schedule invites
 * Handles sending, receiving, and responding to invites
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReceivedInvites,
  getSentInvites,
  sendScheduleInvite,
  acceptScheduleInvite,
  declineScheduleInvite,
  withdrawScheduleInvite,
} from "../api/scheduling";
import { ScheduledSession } from "../types";

export interface UseScheduleInvitesReturn {
  // Received invites (pending response from current user)
  receivedInvites: ScheduledSession[];
  isReceivedLoading: boolean;
  receivedError: string | null;
  receivedCount: number;

  // Sent invites (pending partner response)
  sentInvites: ScheduledSession[];
  isSentLoading: boolean;
  sentError: string | null;
  sentCount: number;

  // Actions
  acceptInvite: (inviteId: string) => Promise<void>;
  declineInvite: (inviteId: string) => Promise<void>;
  withdrawInvite: (inviteId: string) => Promise<void>;
  sendInvite: (scheduledSessionId: string, partnerId: string) => Promise<void>;

  // Loading states
  isAccepting: boolean;
  isDeclining: boolean;
  isWithdrawing: boolean;
  isSending: boolean;

  // Refetch
  refetch: () => Promise<void>;
}

export function useScheduleInvites(): UseScheduleInvitesReturn {
  const queryClient = useQueryClient();

  // Fetch received invites
  const receivedQuery = useQuery({
    queryKey: ["scheduleInvites", "received"],
    queryFn: async () => {
      const result = await getReceivedInvites();
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
  });

  // Fetch sent invites
  const sentQuery = useQuery({
    queryKey: ["scheduleInvites", "sent"],
    queryFn: async () => {
      const result = await getSentInvites();
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
  });

  // Accept invite mutation
  const acceptMutation = useMutation({
    mutationFn: acceptScheduleInvite,
    onSuccess: () => {
      console.log("✅ Invite accepted");
      queryClient.invalidateQueries({ queryKey: ["scheduleInvites"] });
      queryClient.invalidateQueries({ queryKey: ["scheduledSessions"] });
    },
    onError: (error: any) => {
      console.error("❌ Error accepting invite:", error);
    },
  });

  // Decline invite mutation
  const declineMutation = useMutation({
    mutationFn: declineScheduleInvite,
    onSuccess: () => {
      console.log("❌ Invite declined");
      queryClient.invalidateQueries({ queryKey: ["scheduleInvites"] });
      queryClient.invalidateQueries({ queryKey: ["scheduledSessions"] });
    },
    onError: (error: any) => {
      console.error("❌ Error declining invite:", error);
    },
  });

  // Withdraw invite mutation
  const withdrawMutation = useMutation({
    mutationFn: withdrawScheduleInvite,
    onSuccess: () => {
      console.log("🔄 Invite withdrawn");
      queryClient.invalidateQueries({ queryKey: ["scheduleInvites"] });
      queryClient.invalidateQueries({ queryKey: ["scheduledSessions"] });
    },
    onError: (error: any) => {
      console.error("❌ Error withdrawing invite:", error);
    },
  });

  // Send invite mutation
  const sendMutation = useMutation({
    mutationFn: ({ sessionId, partnerId }: { sessionId: string; partnerId: string }) =>
      sendScheduleInvite(sessionId, partnerId),
    onSuccess: () => {
      console.log("📧 Invite sent");
      queryClient.invalidateQueries({ queryKey: ["scheduleInvites"] });
      queryClient.invalidateQueries({ queryKey: ["scheduledSessions"] });
    },
    onError: (error: any) => {
      console.error("❌ Error sending invite:", error);
    },
  });

  const handleAcceptInvite = async (inviteId: string) => {
    console.log("✅ Accepting invite:", inviteId);
    try {
      await acceptMutation.mutateAsync(inviteId);
    } catch (error: any) {
      console.error("Error accepting invite:", error);
      throw error;
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    console.log("❌ Declining invite:", inviteId);
    try {
      await declineMutation.mutateAsync(inviteId);
    } catch (error: any) {
      console.error("Error declining invite:", error);
      throw error;
    }
  };

  const handleWithdrawInvite = async (inviteId: string) => {
    console.log("🔄 Withdrawing invite:", inviteId);
    try {
      await withdrawMutation.mutateAsync(inviteId);
    } catch (error: any) {
      console.error("Error withdrawing invite:", error);
      throw error;
    }
  };

  const handleSendInvite = async (scheduledSessionId: string, partnerId: string) => {
    console.log("📧 Sending invite...", { scheduledSessionId, partnerId });
    try {
      await sendMutation.mutateAsync({ sessionId: scheduledSessionId, partnerId });
    } catch (error: any) {
      console.error("Error sending invite:", error);
      throw error;
    }
  };

  const refetch = async () => {
    console.log("🔄 Refetching all invites...");
    await Promise.all([receivedQuery.refetch(), sentQuery.refetch()]);
  };

  return {
    // Received
    receivedInvites: receivedQuery.data || [],
    isReceivedLoading: receivedQuery.isLoading,
    receivedError: receivedQuery.error ? (receivedQuery.error as Error).message : null,
    receivedCount: (receivedQuery.data || []).length,

    // Sent
    sentInvites: sentQuery.data || [],
    isSentLoading: sentQuery.isLoading,
    sentError: sentQuery.error ? (sentQuery.error as Error).message : null,
    sentCount: (sentQuery.data || []).length,

    // Actions
    acceptInvite: handleAcceptInvite,
    declineInvite: handleDeclineInvite,
    withdrawInvite: handleWithdrawInvite,
    sendInvite: handleSendInvite,

    // Loading states
    isAccepting: acceptMutation.isPending,
    isDeclining: declineMutation.isPending,
    isWithdrawing: withdrawMutation.isPending,
    isSending: sendMutation.isPending,

    // Refetch
    refetch,
  };
}
