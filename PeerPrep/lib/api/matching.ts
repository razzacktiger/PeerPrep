/**
 * Matching Engine for Scheduled Sessions
 * Handles matching users with compatible session requirements
 */

import { supabase } from "../supabase";
import { ApiResponse, ScheduledSession } from "../types";

/**
 * Find potential matches for a pending session
 */
export async function findSessionMatches(
  sessionId: string
): Promise<ApiResponse<ScheduledSession[]>> {
  try {
    console.log("🔍 Finding matches for session:", sessionId);

    // Get the session details
    const { data: session, error: sessionError } = await supabase
      .from("scheduled_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      console.error("❌ Session not found:", sessionError?.message);
      return { error: "Session not found" };
    }

    console.log("📝 Session details:", {
      id: session.id,
      topic_id: session.topic_id,
      difficulty: session.difficulty || 'Medium',
      duration_minutes: session.duration_minutes || 60,
      scheduled_for: session.scheduled_for,
      status: session.status,
      creator_id: session.creator_id
    });

    // Find other pending sessions with matching requirements
    // Match criteria: same topic_id, similar time (within 1 hour), different creator
    const timeWindow = new Date(session.scheduled_for);
    const timeStart = new Date(timeWindow.getTime() - 60 * 60 * 1000); // 1 hour before
    const timeEnd = new Date(timeWindow.getTime() + 60 * 60 * 1000); // 1 hour after

    console.log("🕓 Time window for matching:", {
      sessionTime: session.scheduled_for,
      searchStart: timeStart.toISOString(),
      searchEnd: timeEnd.toISOString()
    });

    const { data: matches, error: matchError } = await supabase
      .from("scheduled_sessions")
      .select(`
        *,
        topics (name, icon),
        profiles!creator_id (display_name, avatar_url)
      `)
      .eq("topic_id", session.topic_id)
      .eq("difficulty", session.difficulty || 'Medium')
      .eq("duration_minutes", session.duration_minutes || 60)
      .eq("status", "pending")
      .neq("creator_id", session.creator_id) // Different user
      .gte("scheduled_for", timeStart.toISOString())
      .lte("scheduled_for", timeEnd.toISOString());

    console.log("🔍 Raw matching query results:", {
      matchesFound: matches?.length || 0,
      matches: matches?.map(m => ({
        id: m.id,
        topic_id: m.topic_id,
        scheduled_for: m.scheduled_for,
        status: m.status,
        creator_id: m.creator_id
      })) || [],
      error: matchError?.message
    });

    if (matchError) {
      console.error("❌ Error finding matches:", matchError.message);
      return { error: matchError.message };
    }

    console.log("✅ Found matches:", matches?.length || 0);
    return { data: (matches as ScheduledSession[]) || [] };
  } catch (error: any) {
    console.error("❌ findSessionMatches error:", error);
    return { error: error.message || "Failed to find matches" };
  }
}

/**
 * Match two sessions together
 */
export async function matchSessions(
  sessionId1: string,
  sessionId2: string
): Promise<ApiResponse<boolean>> {
  try {
    console.log("🤝 Matching sessions:", sessionId1, "with", sessionId2);

    // Update both sessions to 'matched' status and link them as partners
    const { data: session1, error: error1 } = await supabase
      .from("scheduled_sessions")
      .update({ status: "matched" })
      .eq("id", sessionId1)
      .select()
      .single();

    const { data: session2, error: error2 } = await supabase
      .from("scheduled_sessions")
      .update({ 
        status: "matched",
        partner_id: session1?.creator_id 
      })
      .eq("id", sessionId2)
      .select()
      .single();

    // Also update session1 with session2's creator as partner
    await supabase
      .from("scheduled_sessions")
      .update({ partner_id: session2?.creator_id })
      .eq("id", sessionId1);

    if (error1 || error2) {
      console.error("❌ Error matching sessions:", error1?.message || error2?.message);
      return { error: error1?.message || error2?.message };
    }

    console.log("✅ Sessions matched successfully");
    return { data: true };
  } catch (error: any) {
    console.error("❌ matchSessions error:", error);
    return { error: error.message || "Failed to match sessions" };
  }
}

/**
 * Find potential matches for a user (all pending sessions they could match with)
 */
export async function findPotentialMatches(): Promise<ApiResponse<ScheduledSession[]>> {
  try {
    console.log("🔍 Finding potential matches for user");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "User not authenticated" };
    }

    // Get user's pending sessions to find matches for
    const { data: userSessions, error: userError } = await supabase
      .from("scheduled_sessions")
      .select("*")
      .eq("creator_id", user.id)
      .eq("status", "pending");

    if (userError) {
      return { error: userError.message };
    }

    if (!userSessions?.length) {
      return { data: [] };
    }

    // For each user session, find potential matches
    const allMatches: ScheduledSession[] = [];
    
    for (const userSession of userSessions) {
      const matchesResult = await findSessionMatches(userSession.id);
      if (matchesResult.data) {
        allMatches.push(...matchesResult.data);
      }
    }

    console.log("✅ Found potential matches:", allMatches.length);
    return { data: allMatches };
  } catch (error: any) {
    console.error("❌ findPotentialMatches error:", error);
    return { error: error.message || "Failed to find potential matches" };
  }
}
/**
 * Request to match with a specific session
 */
export async function requestMatchWithSession(targetSessionId: string): Promise<ApiResponse<boolean>> {
  try {
    console.log("🤝 Requesting match with session:", targetSessionId);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "User not authenticated" };
    }

    // Get the target session
    const { data: targetSession, error: targetError } = await supabase
      .from("scheduled_sessions")
      .select("*")
      .eq("id", targetSessionId)
      .single();

    if (targetError) {
      return { error: targetError.message };
    }

    if (!targetSession) {
      return { error: "Target session not found" };
    }

    if (targetSession.creator_id === user.id) {
      return { error: "Cannot match with your own session" };
    }

    // Find a matching session from the current user
    const { data: userSessions, error: userError } = await supabase
      .from("scheduled_sessions")
      .select("*")
      .eq("creator_id", user.id)
      .eq("status", "pending")
      .eq("topic_id", targetSession.topic_id);

    if (userError) {
      return { error: userError.message };
    }

    const matchingUserSession = userSessions?.find(session => {
      const sessionTime = new Date(session.scheduled_for);
      const targetTime = new Date(targetSession.scheduled_for);
      const timeDiff = Math.abs(sessionTime.getTime() - targetTime.getTime());
      return timeDiff <= 60 * 60 * 1000; // Within 1 hour
    });

    if (!matchingUserSession) {
      return { error: "No matching session found in your schedule" };
    }

    // Perform the match
    const matchResult = await matchSessions(matchingUserSession.id, targetSession.id);
    return matchResult;

  } catch (error: any) {
    console.error("❌ requestMatchWithSession error:", error);
    return { error: error.message || "Failed to request match" };
  }
}

/**
 * Manually refresh and attempt to find matches for user's pending sessions
 */
export async function refreshAndFindMatches(): Promise<ApiResponse<{ matchedCount: number, matches: ScheduledSession[] }>> {
  try {
    console.log("🔄 Manually refreshing to find new matches");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "User not authenticated" };
    }

    // Get user's pending sessions
    const { data: pendingSessions, error: pendingError } = await supabase
      .from("scheduled_sessions")
      .select("*")
      .eq("creator_id", user.id)
      .eq("status", "pending");

    if (pendingError) {
      return { error: pendingError.message };
    }

    if (!pendingSessions?.length) {
      return { data: { matchedCount: 0, matches: [] } };
    }

    const matches: ScheduledSession[] = [];
    let matchedCount = 0;

    // Try to match each pending session
    for (const session of pendingSessions) {
      const matchResult = await autoMatchSession(session.id);
      if (matchResult.data) {
        matches.push(matchResult.data);
        matchedCount++;
      }
    }

    console.log(`✅ Manual refresh complete: ${matchedCount} new matches found`);
    return { data: { matchedCount, matches } };
  } catch (error: any) {
    console.error("❌ refreshAndFindMatches error:", error);
    return { error: error.message || "Failed to refresh and find matches" };
  }
}

export async function autoMatchSession(
  sessionId: string
): Promise<ApiResponse<ScheduledSession | null>> {
  try {
    console.log("⚡ Auto-matching session:", sessionId);

    const matchesResult = await findSessionMatches(sessionId);
    if (matchesResult.error || !matchesResult.data?.length) {
      console.log("⚡ No matches found for auto-matching:", matchesResult.error || "No compatible sessions");
      return { data: null };
    }

    console.log("🎯 Found potential matches:", matchesResult.data.length);
    
    // Take the first match (could implement more sophisticated matching later)
    const bestMatch = matchesResult.data[0];
    console.log("🤝 Attempting to match with:", {
      matchId: bestMatch.id,
      matchCreator: bestMatch.creator_id,
      matchTime: bestMatch.scheduled_for,
      matchTopic: bestMatch.topic_id
    });
    
    // Update both sessions to 'matched' status with partner info
    const { data: session1, error: error1 } = await supabase
      .from("scheduled_sessions")
      .update({ 
        status: "matched",
        partner_id: bestMatch.creator_id 
      })
      .eq("id", sessionId)
      .select(`
        *,
        topics (name, icon),
        creator_profile:profiles!creator_id (display_name, avatar_url),
        partner_profile:profiles!partner_id (display_name, avatar_url)
      `)
      .single();

    const { data: session2, error: error2 } = await supabase
      .from("scheduled_sessions")
      .update({ 
        status: "matched",
        partner_id: session1?.creator_id 
      })
      .eq("id", bestMatch.id)
      .select(`
        *,
        topics (name, icon),
        creator_profile:profiles!creator_id (display_name, avatar_url),
        partner_profile:profiles!partner_id (display_name, avatar_url)
      `)
      .single();

    if (error1 || error2) {
      console.error("❌ Error auto-matching sessions:", {
        session1Error: error1?.message,
        session2Error: error2?.message
      });
      return { error: error1?.message || error2?.message };
    }

    console.log("✅ Successfully auto-matched sessions:", {
      originalSession: session1?.id,
      matchedSession: session2?.id,
      bothPartnersSet: !!(session1?.partner_id && session2?.partner_id)
    });
    
    return { data: bestMatch };
  } catch (error: any) {
    console.error("❌ autoMatchSession error:", error);
    return { error: error.message || "Failed to auto-match session" };
  }
}

/**
 * Debug function to check what sessions exist and why they might not be matching
 */
export async function debugSessionMatching(): Promise<ApiResponse<any>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "User not authenticated" };
    }

    console.log("🐛 DEBUG: Starting comprehensive session analysis...");

    // Get all pending sessions
    const { data: allPending, error } = await supabase
      .from("scheduled_sessions")
      .select(`
        *,
        topics (name, icon),
        creator_profile:profiles!creator_id (display_name, avatar_url)
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      return { error: error.message };
    }

    console.log(`🐛 DEBUG: Found ${allPending?.length || 0} pending sessions:`);
    allPending?.forEach((session, index) => {
      console.log(`  ${index + 1}. Session ${session.id.slice(0, 8)}...`, {
        topic_id: session.topic_id,
        topic_name: session.topics?.name,
        scheduled_for: session.scheduled_for,
        creator_id: session.creator_id.slice(0, 8) + '...',
        creator_name: session.creator_profile?.display_name,
        status: session.status,
        partner_id: session.partner_id,
        created_at: session.created_at
      });
    });

    // Analyze potential pairs for matching
    if (allPending && allPending.length > 1) {
      console.log("🔍 Analyzing potential matches...");
      
      for (let i = 0; i < allPending.length; i++) {
        for (let j = i + 1; j < allPending.length; j++) {
          const session1 = allPending[i];
          const session2 = allPending[j];
          
          const reasons = [];
          let canMatch = true;

          // Check topic match
          if (session1.topic_id !== session2.topic_id) {
            canMatch = false;
            reasons.push(`❌ Different topics: ${session1.topic_id} vs ${session2.topic_id}`);
          } else {
            reasons.push(`✅ Same topic: ${session1.topic_id} (${session1.topics?.name})`);
          }

          // Check difficulty match
          const diff1 = session1.difficulty || 'Medium';
          const diff2 = session2.difficulty || 'Medium';
          if (diff1 !== diff2) {
            canMatch = false;
            reasons.push(`❌ Different difficulty: ${diff1} vs ${diff2}`);
          } else {
            reasons.push(`✅ Same difficulty: ${diff1}`);
          }

          // Check duration match
          const dur1 = session1.duration_minutes || 60;
          const dur2 = session2.duration_minutes || 60;
          if (dur1 !== dur2) {
            canMatch = false;
            reasons.push(`❌ Different duration: ${dur1}min vs ${dur2}min`);
          } else {
            reasons.push(`✅ Same duration: ${dur1}min`);
          }

          // Check different creators
          if (session1.creator_id === session2.creator_id) {
            canMatch = false;
            reasons.push(`❌ Same creator: ${session1.creator_id}`);
          } else {
            reasons.push(`✅ Different creators: ${session1.creator_profile?.display_name} vs ${session2.creator_profile?.display_name}`);
          }

          // Check time window (within 1 hour)
          const time1 = new Date(session1.scheduled_for);
          const time2 = new Date(session2.scheduled_for);
          const timeDiff = Math.abs(time1.getTime() - time2.getTime());
          const hoursDiff = timeDiff / (1000 * 60 * 60);
          
          if (hoursDiff > 1) {
            canMatch = false;
            reasons.push(`❌ Time too far apart: ${hoursDiff.toFixed(2)} hours`);
          } else {
            reasons.push(`✅ Time compatible: ${hoursDiff.toFixed(2)} hours apart`);
          }

          // Check partner_id is null
          if (session1.partner_id || session2.partner_id) {
            canMatch = false;
            reasons.push(`❌ Has existing partner: ${session1.partner_id || session2.partner_id}`);
          } else {
            reasons.push(`✅ No existing partners`);
          }

          console.log(`🔍 Pair ${i + 1}-${j + 1} (${session1.id.slice(0, 8)} vs ${session2.id.slice(0, 8)}):`, {
            canMatch: canMatch ? "✅ CAN MATCH" : "❌ CANNOT MATCH",
            reasons
          });
        }
      }
    }

    // Group by topic_id to see potential matches
    const byTopic = allPending?.reduce((acc, session) => {
      if (!acc[session.topic_id]) acc[session.topic_id] = [];
      acc[session.topic_id].push(session);
      return acc;
    }, {} as Record<string, any[]>);

    console.log("🐛 DEBUG: Sessions grouped by topic:", byTopic);

    // Test the findSessionMatches function on the first session
    if (allPending && allPending.length > 0) {
      const testSession = allPending[0];
      console.log(`🧪 Testing findSessionMatches on session: ${testSession.id}`);
      const matchResult = await findSessionMatches(testSession.id);
      console.log(`🧪 Match result:`, {
        found: matchResult.data?.length || 0,
        matches: matchResult.data?.map(m => m.id.slice(0, 8) + '...') || [],
        error: matchResult.error
      });
    }

    return { data: { allPending, byTopic } };
  } catch (error: any) {
    console.error("❌ debugSessionMatching error:", error);
    return { error: error.message };
  }
}

/**
 * Check if current time is within session join window
 */
export function canJoinSession(scheduledFor: string): boolean {
  const sessionTime = new Date(scheduledFor);
  const now = new Date();
  const timeDiff = sessionTime.getTime() - now.getTime();
  
  // Can join 5 minutes before to 15 minutes after scheduled time
  const fiveMinutesBefore = -5 * 60 * 1000;
  const fifteenMinutesAfter = 15 * 60 * 1000;
  
  return timeDiff >= fiveMinutesBefore && timeDiff <= fifteenMinutesAfter;
}

/**
 * Check if session can be cancelled (more than 30 minutes before)
 */
export function canCancelSession(scheduledFor: string): boolean {
  const sessionTime = new Date(scheduledFor);
  const now = new Date();
  const timeDiff = sessionTime.getTime() - now.getTime();
  
  // Can cancel if more than 30 minutes before scheduled time
  const thirtyMinutes = 30 * 60 * 1000;
  return timeDiff > thirtyMinutes;
}