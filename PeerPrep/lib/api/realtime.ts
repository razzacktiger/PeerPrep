/**
 * Real-time Collaboration API
 * Handles code sync, notes sync, and in-session chat
 */

import { supabase } from "../supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface ChatMessage {
  id: string;
  session_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

/**
 * Subscribe to code changes in a session
 */
export function subscribeToCodeChanges(
  sessionId: string,
  onCodeChange: (code: string) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`session-code:${sessionId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "sessions",
        filter: `id=eq.${sessionId}`,
      },
      (payload: any) => {
        if (payload.new.code !== undefined) {
          onCodeChange(payload.new.code);
        }
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to notes changes in a session
 */
export function subscribeToNotesChanges(
  sessionId: string,
  onNotesChange: (notes: string) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`session-notes:${sessionId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "sessions",
        filter: `id=eq.${sessionId}`,
      },
      (payload: any) => {
        if (payload.new.shared_notes !== undefined) {
          onNotesChange(payload.new.shared_notes);
        }
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to session status changes (e.g., when partner ends session)
 */
export function subscribeToSessionStatus(
  sessionId: string,
  onStatusChange: (status: string) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`session-status:${sessionId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "sessions",
        filter: `id=eq.${sessionId}`,
      },
      (payload: any) => {
        if (payload.new.status !== undefined) {
          onStatusChange(payload.new.status);
        }
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to chat messages in a session
 */
export function subscribeToChatMessages(
  sessionId: string,
  onNewMessage: (message: ChatMessage) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`session-chat:${sessionId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "session_messages",
        filter: `session_id=eq.${sessionId}`,
      },
      (payload: any) => {
        onNewMessage(payload.new as ChatMessage);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Update code in session (syncs to partner)
 */
export async function updateSessionCode(
  sessionId: string,
  code: string
): Promise<{ error?: string }> {
  try {
    const { error } = await supabase
      .from("sessions")
      .update({ code })
      .eq("id", sessionId);

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error: any) {
    return { error: error.message || "Failed to update code" };
  }
}

/**
 * Update notes in session (syncs to partner)
 */
export async function updateSessionNotes(
  sessionId: string,
  notes: string
): Promise<{ error?: string }> {
  try {
    const { error } = await supabase
      .from("sessions")
      .update({ shared_notes: notes })
      .eq("id", sessionId);

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error: any) {
    return { error: error.message || "Failed to update notes" };
  }
}

/**
 * Send a chat message
 */
export async function sendChatMessage(
  sessionId: string,
  message: string
): Promise<{ error?: string }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "User not authenticated" };
    }

    const { error } = await supabase.from("session_messages").insert({
      session_id: sessionId,
      sender_id: user.id,
      message,
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error: any) {
    return { error: error.message || "Failed to send message" };
  }
}

/**
 * Get chat history for a session
 */
export async function getChatHistory(
  sessionId: string
): Promise<{ data?: ChatMessage[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("session_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      return { error: error.message };
    }

    return { data: data as ChatMessage[] };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch chat history" };
  }
}

/**
 * Unsubscribe from a channel
 */
export async function unsubscribeChannel(channel: RealtimeChannel) {
  await supabase.removeChannel(channel);
}
