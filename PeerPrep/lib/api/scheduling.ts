/**
 * Supabase Scheduling API
 * Manage pre-scheduled sessions
 */

import { ApiResponse, ScheduledSession } from "../types";
import { supabase } from "../supabase";

/**
 * Create a new scheduled session
 */
export async function createScheduledSession(
  topicId: string,
  scheduledFor: string, // ISO timestamp
  partnerId?: string // Optional if scheduling solo
): Promise<ApiResponse<ScheduledSession>> {
  try {
    console.log("📅 Creating scheduled session...", {
      topicId,
      scheduledFor,
    });

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "User not authenticated" };
    }

    // Insert into scheduled_sessions
    const { data: scheduledSession, error } = await supabase
      .from("scheduled_sessions")
      .insert({
        creator_id: user.id,
        topic_id: topicId,
        scheduled_for: scheduledFor,
        partner_id: partnerId || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Error creating scheduled session:", error.message);
      return { error: error.message };
    }

    console.log("✅ Scheduled session created:", scheduledSession);
    return { data: scheduledSession };
  } catch (error: any) {
    console.error("❌ createScheduledSession error:", error);
    return { error: error.message || "Failed to create scheduled session" };
  }
}

/**
 * Get all scheduled sessions for current user (as creator or partner)
 */
export async function getScheduledSessions(
  status?: "pending" | "confirmed" | "cancelled"
): Promise<ApiResponse<ScheduledSession[]>> {
  try {
    console.log("📋 Fetching scheduled sessions...", { status });

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "User not authenticated" };
    }

    // Query scheduled sessions where user is creator or partner
    let query = supabase
      .from("scheduled_sessions")
      .select(
        `
        id,
        creator_id,
        topic_id,
        scheduled_for,
        partner_id,
        session_id,
        status,
        created_at,
        topics (
          name,
          icon
        ),
        profiles!creator_id (
          display_name,
          avatar_url
        )
      `
      )
      .or(`creator_id.eq.${user.id},partner_id.eq.${user.id}`);

    if (status) {
      query = query.eq("status", status);
    }

    const { data: sessions, error } = await query.order("scheduled_for", {
      ascending: true,
    });

    if (error) {
      console.error("❌ Error fetching scheduled sessions:", error.message);
      return { error: error.message };
    }

    console.log("✅ Retrieved scheduled sessions:", sessions?.length || 0);
    return { data: (sessions as ScheduledSession[]) || [] };
  } catch (error: any) {
    console.error("❌ getScheduledSessions error:", error);
    return { error: error.message || "Failed to fetch scheduled sessions" };
  }
}

/**
 * Get single scheduled session details
 */
export async function getScheduleDetails(
  scheduledSessionId: string
): Promise<ApiResponse<ScheduledSession>> {
  try {
    console.log("🔍 Fetching scheduled session details...", {
      scheduledSessionId,
    });

    const { data: session, error } = await supabase
      .from("scheduled_sessions")
      .select(
        `
        id,
        creator_id,
        topic_id,
        scheduled_for,
        partner_id,
        session_id,
        status,
        created_at,
        topics (
          name,
          icon
        ),
        profiles!creator_id (
          display_name,
          avatar_url
        )
      `
      )
      .eq("id", scheduledSessionId)
      .single();

    if (error) {
      console.error("❌ Error fetching schedule details:", error.message);
      return { error: error.message };
    }

    console.log("✅ Retrieved schedule details:", session?.id);
    return { data: session as ScheduledSession };
  } catch (error: any) {
    console.error("❌ getScheduleDetails error:", error);
    return { error: error.message || "Failed to fetch scheduled session" };
  }
}

/**
 * Confirm a scheduled session (partner accepts)
 */
export async function confirmScheduledSession(
  scheduledSessionId: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    console.log("✅ Confirming scheduled session...", {
      scheduledSessionId,
    });

    const { data, error } = await supabase
      .from("scheduled_sessions")
      .update({
        status: "confirmed",
      })
      .eq("id", scheduledSessionId)
      .select()
      .single();

    if (error) {
      console.error("❌ Error confirming scheduled session:", error.message);
      return { error: error.message };
    }

    console.log("✅ Scheduled session confirmed:", data);
    return { data: { success: true } };
  } catch (error: any) {
    console.error("❌ confirmScheduledSession error:", error);
    return { error: error.message || "Failed to confirm scheduled session" };
  }
}

/**
 * Cancel a scheduled session
 */
export async function cancelScheduledSession(
  scheduledSessionId: string,
  reason?: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    console.log("❌ Cancelling scheduled session...", {
      scheduledSessionId,
      reason,
    });

    const { data, error } = await supabase
      .from("scheduled_sessions")
      .update({
        status: "cancelled",
      })
      .eq("id", scheduledSessionId)
      .select()
      .single();

    if (error) {
      console.error("❌ Error cancelling scheduled session:", error.message);
      return { error: error.message };
    }

    console.log("✅ Scheduled session cancelled:", data);
    return { data: { success: true } };
  } catch (error: any) {
    console.error("❌ cancelScheduledSession error:", error);
    return { error: error.message || "Failed to cancel scheduled session" };
  }
}

/**
 * Get upcoming scheduled sessions (next 7 days)
 */
export async function getUpcomingScheduledSessions(
  daysAhead: number = 7
): Promise<ApiResponse<ScheduledSession[]>> {
  try {
    console.log("📅 Fetching upcoming scheduled sessions...", { daysAhead });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "User not authenticated" };
    }

    const now = new Date();
    const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    const { data: sessions, error } = await supabase
      .from("scheduled_sessions")
      .select(
        `
        id,
        creator_id,
        topic_id,
        scheduled_for,
        partner_id,
        session_id,
        status,
        created_at,
        topics (
          name,
          icon
        ),
        profiles!creator_id (
          display_name,
          avatar_url
        )
      `
      )
      .or(`creator_id.eq.${user.id},partner_id.eq.${user.id}`)
      .eq("status", "confirmed")
      .gte("scheduled_for", now.toISOString())
      .lte("scheduled_for", future.toISOString())
      .order("scheduled_for", { ascending: true });

    if (error) {
      console.error("❌ Error fetching upcoming scheduled sessions:", error.message);
      return { error: error.message };
    }

    console.log("✅ Retrieved upcoming scheduled sessions:", sessions?.length || 0);
    return { data: (sessions as ScheduledSession[]) || [] };
  } catch (error: any) {
    console.error("❌ getUpcomingScheduledSessions error:", error);
    return { error: error.message || "Failed to fetch upcoming sessions" };
  }
}

/**
 * Send an invite to a specific partner
 */
export async function sendScheduleInvite(
  scheduledSessionId: string,
  partnerId: string
): Promise<ApiResponse<ScheduledSession>> {
  try {
    console.log("📧 Sending schedule invite...", {
      scheduledSessionId,
      partnerId,
    });

    // Update scheduled session with partner_id
    const { data: updatedSession, error } = await supabase
      .from("scheduled_sessions")
      .update({
        partner_id: partnerId,
        status: "pending",
      })
      .eq("id", scheduledSessionId)
      .select()
      .single();

    if (error) {
      console.error("❌ Error sending invite:", error.message);
      return { error: error.message };
    }

    console.log("✅ Invite sent:", updatedSession);
    return { data: updatedSession };
  } catch (error: any) {
    console.error("❌ sendScheduleInvite error:", error);
    return { error: error.message || "Failed to send invite" };
  }
}

/**
 * Get received invites (pending response from current user)
 */
export async function getReceivedInvites(): Promise<ApiResponse<ScheduledSession[]>> {
  try {
    console.log("📨 Fetching received invites...");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "User not authenticated" };
    }

    const { data: invites, error } = await supabase
      .from("scheduled_sessions")
      .select(
        `
        id,
        creator_id,
        topic_id,
        scheduled_for,
        partner_id,
        session_id,
        status,
        created_at,
        topics (
          name,
          icon
        ),
        profiles!creator_id (
          display_name,
          avatar_url
        )
      `
      )
      .eq("partner_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching received invites:", error.message);
      return { error: error.message };
    }

    console.log("✅ Retrieved received invites:", invites?.length || 0);
    return { data: (invites as ScheduledSession[]) || [] };
  } catch (error: any) {
    console.error("❌ getReceivedInvites error:", error);
    return { error: error.message || "Failed to fetch received invites" };
  }
}

/**
 * Get sent invites (pending partner response)
 */
export async function getSentInvites(): Promise<ApiResponse<ScheduledSession[]>> {
  try {
    console.log("📤 Fetching sent invites...");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "User not authenticated" };
    }

    const { data: invites, error } = await supabase
      .from("scheduled_sessions")
      .select(
        `
        id,
        creator_id,
        topic_id,
        scheduled_for,
        partner_id,
        session_id,
        status,
        created_at,
        topics (
          name,
          icon
        ),
        profiles!partner_id (
          display_name,
          avatar_url
        )
      `
      )
      .eq("creator_id", user.id)
      .eq("status", "pending")
      .not("partner_id", "is", null)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching sent invites:", error.message);
      return { error: error.message };
    }

    console.log("✅ Retrieved sent invites:", invites?.length || 0);
    return { data: (invites as ScheduledSession[]) || [] };
  } catch (error: any) {
    console.error("❌ getSentInvites error:", error);
    return { error: error.message || "Failed to fetch sent invites" };
  }
}

/**
 * Accept a scheduled session invite
 */
export async function acceptScheduleInvite(
  scheduledSessionId: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    console.log("✅ Accepting schedule invite...", {
      scheduledSessionId,
    });

    const { data, error } = await supabase
      .from("scheduled_sessions")
      .update({
        status: "confirmed",
      })
      .eq("id", scheduledSessionId)
      .select()
      .single();

    if (error) {
      console.error("❌ Error accepting invite:", error.message);
      return { error: error.message };
    }

    console.log("✅ Invite accepted:", data);
    return { data: { success: true } };
  } catch (error: any) {
    console.error("❌ acceptScheduleInvite error:", error);
    return { error: error.message || "Failed to accept invite" };
  }
}

/**
 * Decline a scheduled session invite
 */
export async function declineScheduleInvite(
  scheduledSessionId: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    console.log("❌ Declining schedule invite...", {
      scheduledSessionId,
    });

    const { data, error } = await supabase
      .from("scheduled_sessions")
      .update({
        status: "declined",
        partner_id: null,
      })
      .eq("id", scheduledSessionId)
      .select()
      .single();

    if (error) {
      console.error("❌ Error declining invite:", error.message);
      return { error: error.message };
    }

    console.log("✅ Invite declined:", data);
    return { data: { success: true } };
  } catch (error: any) {
    console.error("❌ declineScheduleInvite error:", error);
    return { error: error.message || "Failed to decline invite" };
  }
}

/**
 * Withdraw a sent invite (creator only)
 */
export async function withdrawScheduleInvite(
  scheduledSessionId: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    console.log("🔄 Withdrawing schedule invite...", {
      scheduledSessionId,
    });

    const { data, error } = await supabase
      .from("scheduled_sessions")
      .update({
        status: "withdrawn",
        partner_id: null,
      })
      .eq("id", scheduledSessionId)
      .select()
      .single();

    if (error) {
      console.error("❌ Error withdrawing invite:", error.message);
      return { error: error.message };
    }

    console.log("✅ Invite withdrawn:", data);
    return { data: { success: true } };
  } catch (error: any) {
    console.error("❌ withdrawScheduleInvite error:", error);
    return { error: error.message || "Failed to withdraw invite" };
  }
}
