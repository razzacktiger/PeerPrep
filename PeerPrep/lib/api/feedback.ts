/**
 * Feedback API
 * Submit peer ratings, fetch feedback, track user stats
 */

import { supabase } from "../supabase";
import { ApiResponse, PeerFeedback, AIFeedback } from "../types";

/**
 * Submit peer feedback for a completed session
 * Both users must submit their own feedback for the other user
 */
export async function submitPeerFeedback(
  sessionId: string,
  recipientId: string,
  feedback: Omit<PeerFeedback, "session_id">
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "User not authenticated" };

    console.log("📝 Submitting peer feedback:", {
      sessionId,
      from: user.id,
      to: recipientId,
      feedback,
    });

    // Insert feedback into session_feedback table
    const { error } = await supabase
      .from("session_feedback")
      .insert({
        session_id: sessionId,
        from_id: user.id,
        to_id: recipientId,
        clarity: feedback.clarity,
        correctness: feedback.correctness,
        confidence: feedback.confidence,
        comments: feedback.comments || null,
      });

    if (error) {
      console.error("❌ Feedback submission error:", error.message);
      return { error: error.message };
    }

    console.log("✅ Feedback submitted successfully");
    return { data: { success: true } };
  } catch (error: any) {
    console.error("❌ Unexpected error submitting feedback:", error);
    return { error: error.message };
  }
}

/**
 * Get all feedback received by current user for a specific session
 */
export async function getSessionFeedback(
  sessionId: string
): Promise<ApiResponse<{ peer: PeerFeedback[]; ai: AIFeedback | null }>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "User not authenticated" };

    console.log("🔍 Fetching feedback for session:", sessionId);

    // Get peer feedback received by current user
    const { data: peerFeedbackData, error: peerError } = await supabase
      .from("session_feedback")
      .select("session_id, clarity, correctness, confidence, comments")
      .eq("session_id", sessionId)
      .eq("to_id", user.id);

    if (peerError) {
      console.error("❌ Error fetching peer feedback:", peerError.message);
      return { error: peerError.message };
    }

    // Get AI feedback for the session
    const { data: aiFeedbackData, error: aiError } = await supabase
      .from("ai_feedback")
      .select("session_id, fairness_score, summary, strengths, improvements")
      .eq("session_id", sessionId)
      .single();

    if (aiError && aiError.code !== "PGRST116") {
      // PGRST116 = no rows returned (which is expected if no AI feedback yet)
      console.error("❌ Error fetching AI feedback:", aiError.message);
      return { error: aiError.message };
    }

    console.log("✅ Feedback retrieved:", {
      peerCount: peerFeedbackData?.length || 0,
      hasAI: !!aiFeedbackData,
    });

    return {
      data: {
        peer: peerFeedbackData || [],
        ai: aiFeedbackData as AIFeedback | null,
      },
    };
  } catch (error: any) {
    console.error("❌ Unexpected error fetching feedback:", error);
    return { error: error.message };
  }
}

/**
 * Get all feedback received by current user (across all sessions)
 */
export async function getUserFeedback(): Promise<
  ApiResponse<{ feedback: any[]; avgScores: Record<string, number> }>
> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "User not authenticated" };

    console.log("📊 Fetching user's feedback history");

    // Get all feedback received by user
    const { data: allFeedback, error: feedbackError } = await supabase
      .from("session_feedback")
      .select("session_id, clarity, correctness, confidence, comments, created_at")
      .eq("to_id", user.id)
      .order("created_at", { ascending: false });

    if (feedbackError) {
      console.error("❌ Error fetching user feedback:", feedbackError.message);
      return { error: feedbackError.message };
    }

    // Calculate average scores
    const avgScores = {
      clarity: 0,
      correctness: 0,
      confidence: 0,
    };

    if (allFeedback && allFeedback.length > 0) {
      avgScores.clarity =
        allFeedback.reduce((sum, f) => sum + f.clarity, 0) / allFeedback.length;
      avgScores.correctness =
        allFeedback.reduce((sum, f) => sum + f.correctness, 0) /
        allFeedback.length;
      avgScores.confidence =
        allFeedback.reduce((sum, f) => sum + f.confidence, 0) / allFeedback.length;
    }

    console.log("✅ User feedback retrieved:", {
      totalFeedback: allFeedback?.length || 0,
      avgScores,
    });

    return {
      data: {
        feedback: allFeedback || [],
        avgScores,
      },
    };
  } catch (error: any) {
    console.error("❌ Unexpected error fetching user feedback:", error);
    return { error: error.message };
  }
}

/**
 * Check if current user has already submitted feedback for a session
 * Useful for determining if feedback form should be shown
 */
export async function hasUserSubmittedFeedback(
  sessionId: string
): Promise<ApiResponse<boolean>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "User not authenticated" };

    const { data, error } = await supabase
      .from("session_feedback")
      .select("id")
      .eq("session_id", sessionId)
      .eq("from_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      return { error: error.message };
    }

    return { data: !!data };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Get AI feedback for a session
 */
export async function getAIFeedback(
  sessionId: string
): Promise<ApiResponse<AIFeedback>> {
  try {
    console.log("🤖 Fetching AI feedback for session:", sessionId);

    const { data, error } = await supabase
      .from("ai_feedback")
      .select("session_id, fairness_score, summary, strengths, improvements")
      .eq("session_id", sessionId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No AI feedback yet - this is expected
        console.log("ℹ️ No AI feedback available yet");
        return { data: null as any };
      }
      console.error("❌ Error fetching AI feedback:", error.message);
      return { error: error.message };
    }

    console.log("✅ AI feedback retrieved");
    return { data: data as AIFeedback };
  } catch (error: any) {
    console.error("❌ Unexpected error fetching AI feedback:", error);
    return { error: error.message };
  }
}

/**
 * Update user's average scores in profiles table
 * Call this after feedback is submitted
 */
export async function updateUserAverageScore(): Promise<
  ApiResponse<{ success: boolean }>
> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "User not authenticated" };

    console.log("📈 Updating user average score");

    // Fetch all feedback received by user
    const { data: allFeedback, error: fetchError } = await supabase
      .from("session_feedback")
      .select("clarity, correctness, confidence")
      .eq("to_id", user.id);

    if (fetchError) {
      console.error("❌ Error fetching feedback:", fetchError.message);
      return { error: fetchError.message };
    }

    if (!allFeedback || allFeedback.length === 0) {
      // No feedback yet, set to 0
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avg_peer_score: 0 })
        .eq("id", user.id);

      if (updateError) return { error: updateError.message };
      return { data: { success: true } };
    }

    // Calculate average of all three dimensions
    const avgClarity = allFeedback.reduce((sum, f) => sum + f.clarity, 0) / allFeedback.length;
    const avgCorrectness = allFeedback.reduce((sum, f) => sum + f.correctness, 0) / allFeedback.length;
    const avgConfidence = allFeedback.reduce((sum, f) => sum + f.confidence, 0) / allFeedback.length;

    // Average the three averages (or sum and divide by 3)
    const overallAvg = (avgClarity + avgCorrectness + avgConfidence) / 3;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avg_peer_score: overallAvg })
      .eq("id", user.id);

    if (updateError) {
      console.error("❌ Error updating profile:", updateError.message);
      return { error: updateError.message };
    }

    console.log("✅ User average score updated:", overallAvg.toFixed(2));
    return { data: { success: true } };
  } catch (error: any) {
    console.error("❌ Unexpected error updating average score:", error);
    return { error: error.message };
  }
}