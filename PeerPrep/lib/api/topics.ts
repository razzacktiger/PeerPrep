/**
 * Topics API - Fetch from database
 */

import { supabase } from "../supabase";
import { ApiResponse } from "../types";
import { Topic as UITopic } from "../../app/components/topics/TopicCard";

// Predefined gradients for topics
const TOPIC_GRADIENTS: Record<string, readonly [string, string]> = {
  "1": ["#3b82f6", "#06b6d4"] as const, // Data Structures - Blue
  "2": ["#a855f7", "#ec4899"] as const, // Algorithms - Purple
  "3": ["#22c55e", "#10b981"] as const, // System Design - Green
  "4": ["#ef4444", "#f97316"] as const, // Behavioral - Red
  "5": ["#eab308", "#f97316"] as const, // OOD - Yellow
  "6": ["#6366f1", "#a855f7"] as const, // Database - Indigo
};

// Icon mappings
const TOPIC_ICONS: Record<string, string> = {
  "1": "view-grid",
  "2": "flash",
  "3": "cloud",
  "4": "account-voice",
  "5": "shape",
  "6": "database",
};

/**
 * Get all topics from database and transform to UI format
 */
export async function getTopics(): Promise<ApiResponse<UITopic[]>> {
  try {
    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .order("id");

    if (error) {
      return { error: error.message };
    }

    // Transform database topics to UI format
    const uiTopics: UITopic[] = (data || []).map((topic) => ({
      id: topic.id,
      name: topic.name,
      icon: TOPIC_ICONS[topic.id] || "help-circle",
      difficulty: topic.difficulty_levels?.[0] || "Medium",
      questions: 30, // Placeholder - will calculate later
      description: topic.description || "",
      gradient: TOPIC_GRADIENTS[topic.id] || (["#6366f1", "#a855f7"] as const),
    }));

    return { data: uiTopics };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch topics" };
  }
}
