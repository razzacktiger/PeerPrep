/**
 * Matchmaking Edge Function
 * Pairs users waiting in the queue for the same topic
 */

// @ts-ignore: Deno imports work in Supabase Edge Functions runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore: Deno imports work in Supabase Edge Functions runtime
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    // @ts-ignore: Deno global is available in Supabase Edge Functions runtime
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    // @ts-ignore: Deno global is available in Supabase Edge Functions runtime
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request data
    const { topic_id, user_id } = await req.json();

    if (!topic_id || !user_id) {
      return new Response(
        JSON.stringify({ error: "topic_id and user_id are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check for waiting users with the same topic (excluding current user)
    const { data: waitingUsers, error: queueError } = await supabase
      .from("matchmaking_queue")
      .select("id, profile_id, topic_id")
      .eq("topic_id", topic_id)
      .eq("status", "waiting")
      .neq("profile_id", user_id)
      .order("created_at", { ascending: true })
      .limit(1);

    if (queueError) {
      throw queueError;
    }

    // If no one is waiting, just return (current user stays in queue)
    if (!waitingUsers || waitingUsers.length === 0) {
      return new Response(
        JSON.stringify({ status: "waiting", message: "No match found yet" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Found a match! Get partner info
    const partner = waitingUsers[0];

    // Fetch topic name
    const { data: topic } = await supabase
      .from("topics")
      .select("name")
      .eq("id", topic_id)
      .single();

    // Create session for both users
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .insert({
        topic_id: topic_id,
        host_id: user_id,
        guest_id: partner.profile_id,
        status: "pending",
        started_at: new Date().toISOString(),
        duration_minutes: 25,
      })
      .select()
      .single();

    if (sessionError) {
      throw sessionError;
    }

    // Remove both users from queue
    await supabase
      .from("matchmaking_queue")
      .delete()
      .in("profile_id", [user_id, partner.profile_id]);

    return new Response(
      JSON.stringify({
        status: "matched",
        session: {
          id: session.id,
          topic_id: session.topic_id,
          topic_name: topic?.name || "Unknown",
          partner_id: partner.profile_id,
          status: session.status,
          started_at: session.started_at,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Matchmaking error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
