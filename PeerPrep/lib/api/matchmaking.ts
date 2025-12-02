/**
 * Supabase Matchmaking API
 * Real-time matchmaking using queue + Edge Function
 */

import { supabase } from "../supabase";
import { ApiResponse } from "../types";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface QueueStatus {
  isInQueue: boolean;
  position: number;
  estimatedWaitTime: number;
}

export interface MatchResult {
  sessionId: string;
  partnerId: string;
  partnerName: string;
  topicId: string;
  topicName: string;
}

let realtimeChannel: RealtimeChannel | null = null;

/**
 * Join matchmaking queue for a topic and difficulty level
 * Inserts user into queue, then calls Edge Function to attempt matching
 */
export async function joinQueue(
  topicId: string,
  difficulty: string
): Promise<ApiResponse<QueueStatus | MatchResult>> {
  try {
    console.log("🔷 joinQueue called:", { topicId, difficulty });

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("👤 User check:", { user: user?.id, error: userError });

    if (userError || !user) {
      console.log("❌ User not authenticated");
      return { error: "User not authenticated" };
    }

    // Note: No need to check for existing sessions here anymore
    // RLS policies now properly allow session updates, so endSession() works correctly
    console.log("📝 Checking/inserting into matchmaking_queue...");

    // Check if user is already in queue
    const { data: existingEntry } = await supabase
      .from("matchmaking_queue")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (existingEntry) {
      console.log("ℹ️ User already in queue, skipping insert");
    } else {
      // Insert into matchmaking_queue only if not already there
      const { error: queueError } = await supabase
        .from("matchmaking_queue")
        .insert({
          profile_id: user.id,
          topic_id: topicId,
          difficulty: difficulty, // Fixed: was difficulty_preference
          status: "waiting",
        });

      console.log("📊 Queue insert result:", { error: queueError });

      if (queueError) {
        console.log("❌ Queue error:", queueError.message);
        return { error: queueError.message };
      }
    }

    console.log("🚀 Calling Edge Function...");

    // Call Edge Function to attempt matching
    const { data: matchData, error: functionError } =
      await supabase.functions.invoke("matchmaking", {
        body: {
          topic_id: topicId,
          user_id: user.id,
        },
      });

    console.log("⚡ Edge Function result:", {
      data: matchData,
      error: functionError,
    });

    if (functionError) {
      console.log("❌ Function error:", functionError.message);
      return { error: functionError.message };
    }

    // If matched immediately, return match result
    if (matchData?.status === "matched") {
      console.log(
        "🔍 joinQueue: Edge Function matched, fetching partner profile:",
        {
          partnerId: matchData.session.partner_id,
        }
      );

      // Fetch partner's profile to get their name
      const { data: partnerProfile, error: profileError } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", matchData.session.partner_id)
        .single();

      console.log("👤 joinQueue: Partner profile result:", {
        displayName: partnerProfile?.display_name,
        error: profileError?.message,
      });

      const matchResult: MatchResult = {
        sessionId: matchData.session.id,
        partnerId: matchData.session.partner_id,
        partnerName: partnerProfile?.display_name || "Peer",
        topicId: matchData.session.topic_id,
        topicName: matchData.session.topic_name,
      };
      return { data: matchResult };
    }

    // Otherwise, return queue status
    const { count } = await supabase
      .from("matchmaking_queue")
      .select("*", { count: "exact", head: true })
      .eq("topic_id", topicId)
      .eq("status", "waiting");

    return {
      data: {
        isInQueue: true,
        position: count || 1,
        estimatedWaitTime: 60, // Fixed estimate for now
      },
    };
  } catch (error: any) {
    return { error: error.message || "Failed to join queue" };
  }
}

/**
 * Leave matchmaking queue
 * Removes user from queue and cleans up realtime subscription
 */
export async function leaveQueue(): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("matchmaking_queue")
        .delete()
        .eq("profile_id", user.id);
    }

    // Clean up realtime subscription
    if (realtimeChannel) {
      await supabase.removeChannel(realtimeChannel);
      realtimeChannel = null;
    }
  } catch (error) {
    console.error("Error leaving queue:", error);
  }
}

/**
 * Check queue status (for polling)
 * Calls Edge Function periodically to attempt matching
 */
export async function checkQueueStatus(): Promise<
  ApiResponse<MatchResult | QueueStatus>
> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "User not authenticated" };
    }

    // Check if user is still in queue
    const { data: queueEntry, error: queueError } = await supabase
      .from("matchmaking_queue")
      .select("topic_id")
      .eq("profile_id", user.id)
      .single();

    if (queueError || !queueEntry) {
      console.log("🔍 User not in queue, checking for existing session...");

      // User no longer in queue - check if session was created RECENTLY (within last 2 minutes)
      // Reduced from 5 to 2 minutes to be more strict
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();

      const { data: session, error: sessionError } = await supabase
        .from("sessions")
        .select(
          "id, topic_id, host_id, guest_id, topics(name), ended_at, status, created_at"
        )
        .or(`host_id.eq.${user.id},guest_id.eq.${user.id}`)
        .eq("status", "active") // Only look for active sessions
        .is("ended_at", null) // Session must not be ended
        .gte("created_at", twoMinutesAgo) // Only sessions created in last 2 minutes (more strict!)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(); // Use maybeSingle() instead of single() to avoid error

      console.log("📊 Session query result:", {
        found: !!session,
        error: sessionError?.message,
        sessionId: session?.id,
        status: session?.status,
        ended_at: session?.ended_at,
        created_at: session?.created_at,
        twoMinutesAgo,
      });

      if (!sessionError && session) {
        // Found session - matched!
        console.log("✅ Found active session, returning match result");
        const partnerId =
          session.host_id === user.id ? session.guest_id : session.host_id;

        console.log("🔍 Fetching partner profile:", {
          partnerId,
          currentUserId: user.id,
          sessionHostId: session.host_id,
          sessionGuestId: session.guest_id,
        });

        // Fetch partner's profile to get their name
        const { data: partnerProfile, error: profileError } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", partnerId)
          .single();

        console.log("👤 Partner profile result:", {
          displayName: partnerProfile?.display_name,
          error: profileError?.message,
        });

        return {
          data: {
            sessionId: session.id,
            partnerId: partnerId,
            partnerName: partnerProfile?.display_name || "Peer", // ✅ REAL NAME
            topicId: session.topic_id,
            topicName: (session.topics as any)?.name || "Unknown",
          } as MatchResult,
        };
      }

      console.log("❌ No active session found");
      return { error: "No longer in queue" };
    }

    // Still in queue - call Edge Function to attempt matching
    const { data: matchData } = await supabase.functions.invoke("matchmaking", {
      body: {
        topic_id: queueEntry.topic_id,
        user_id: user.id,
      },
    });

    if (matchData?.status === "matched") {
      console.log("🔍 Edge Function matched, fetching partner profile:", {
        partnerId: matchData.session.partner_id,
      });

      // Fetch partner's profile to get their name
      const { data: partnerProfile, error: profileError } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", matchData.session.partner_id)
        .single();

      console.log("👤 Partner profile result:", {
        displayName: partnerProfile?.display_name,
        error: profileError?.message,
      });

      return {
        data: {
          sessionId: matchData.session.id,
          partnerId: matchData.session.partner_id,
          partnerName: partnerProfile?.display_name || "Peer", // ✅ REAL NAME
          topicId: matchData.session.topic_id,
          topicName: matchData.session.topic_name,
        } as MatchResult,
      };
    }

    // Still waiting - return updated queue status
    const { count } = await supabase
      .from("matchmaking_queue")
      .select("*", { count: "exact", head: true })
      .eq("topic_id", queueEntry.topic_id)
      .eq("status", "waiting");

    return {
      data: {
        isInQueue: true,
        position: count || 1,
        estimatedWaitTime: 60,
      } as QueueStatus,
    };
  } catch (error: any) {
    return { error: error.message || "Failed to check queue status" };
  }
}

/**
 * Type guard to check if result is a match
 */
export function isMatchResult(
  result: MatchResult | QueueStatus
): result is MatchResult {
  return "sessionId" in result;
}

/**
 * Schedule a session
 */
export async function scheduleSession(
  topicId: string,
  scheduledFor: Date
): Promise<ApiResponse<{ success: boolean; sessionId: string }>> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "User not authenticated" };
    }

    // Insert into scheduled_sessions table
    const { data, error } = await supabase
      .from("scheduled_sessions")
      .insert({
        profile_id: user.id,
        topic_id: topicId,
        scheduled_for: scheduledFor.toISOString(),
        status: "scheduled",
      })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return {
      data: {
        success: true,
        sessionId: data.id,
      },
    };
  } catch (error: any) {
    return { error: error.message || "Failed to schedule session" };
  }
}
