/**
 * Core Type Definitions for PeerPrep
 */

// User & Auth Types
export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface UserProfile extends User {
  bio?: string;
  streak_days: number;
  total_sessions: number;
  avg_peer_score: number;
  preferred_topics: string[];
  updated_at: string;
}

export interface UserPreferences {
  user_id: string;
  push_notifications: boolean;
  dark_mode: boolean;
}

// Topic Types
export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty_levels: string[];
}

// Session Types
export interface Session {
  id: string;
  topic_id: string;
  topic_name: string;
  partner_id: string;
  partner_name: string;
  partner_avatar?: string;
  status: "active" | "completed" | "cancelled";
  started_at: string;
  ended_at?: string;
  duration_minutes: number;
  question?: Question;
  notes?: string;
}

export interface Question {
  id: string;
  title: string;
  prompt: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  hints?: string[];
}

// Feedback Types
export interface PeerFeedback {
  session_id: string;
  clarity: number; // 1-5
  correctness: number; // 1-5
  confidence: number; // 1-5
  comments?: string;
}

export interface AIFeedback {
  session_id: string;
  fairness_score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
}

// Dashboard Types
export interface UserStats {
  total_sessions: number;
  streak_days: number;
  avg_peer_score: number;
  weekly_scores: { date: string; score: number }[];
  recent_sessions: Session[];
}

// Matchmaking Types
export interface MatchmakingRequest {
  user_id: string;
  topic_id: string;
  difficulty: string;
  timestamp: string;
}

export interface ScheduledSession {
  id: string;
  topic_id: string;
  topic_name: string;
  scheduled_for: string;
  partner_id?: string;
  partner_name?: string;
  status: "pending" | "confirmed" | "cancelled";
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
