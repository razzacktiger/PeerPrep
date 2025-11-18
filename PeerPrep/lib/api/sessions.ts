/**
 * Mock Sessions API
 */

import { ApiResponse, Session, PeerFeedback, AIFeedback, UserStats } from '../types';
import { MOCK_QUESTIONS } from '../constants';

// Mock sessions storage
const MOCK_SESSIONS: Session[] = [
  {
    id: 'session_1',
    topic_id: '1',
    topic_name: 'Data Structures',
    partner_id: 'partner_1',
    partner_name: 'Alice Johnson',
    partner_avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson',
    status: 'completed',
    started_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    ended_at: new Date(Date.now() - 84900000).toISOString(),
    duration_minutes: 25,
    question: MOCK_QUESTIONS['1'][0],
    notes: 'Discussed hash map approach. Partner was very helpful!',
  },
  {
    id: 'session_2',
    topic_id: '2',
    topic_name: 'Algorithms',
    partner_id: 'partner_2',
    partner_name: 'Bob Smith',
    partner_avatar: 'https://ui-avatars.com/api/?name=Bob+Smith',
    status: 'completed',
    started_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    ended_at: new Date(Date.now() - 171300000).toISOString(),
    duration_minutes: 25,
    question: MOCK_QUESTIONS['2'][0],
    notes: 'Merge sort implementation practice.',
  },
];

/**
 * Get recent sessions
 */
export async function getRecentSessions(limit: number = 10): Promise<ApiResponse<Session[]>> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    data: MOCK_SESSIONS.slice(0, limit),
  };
}

/**
 * Get session by ID
 */
export async function getSession(sessionId: string): Promise<ApiResponse<Session>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const session = MOCK_SESSIONS.find((s) => s.id === sessionId);

  if (!session) {
    return {
      error: 'Session not found',
    };
  }

  return {
    data: session,
  };
}

/**
 * Submit peer feedback
 */
export async function submitFeedback(
  sessionId: string,
  feedback: Omit<PeerFeedback, 'session_id'>
): Promise<ApiResponse<{ success: boolean }>> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  console.log('Submitting feedback for session:', sessionId, feedback);

  return {
    data: { success: true },
  };
}

/**
 * Get AI feedback (mock)
 */
export async function getAIFeedback(sessionId: string): Promise<ApiResponse<AIFeedback>> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock AI feedback
  const mockAIFeedback: AIFeedback = {
    session_id: sessionId,
    fairness_score: 8.5,
    summary: 'Both participants showed good engagement and technical understanding.',
    strengths: [
      'Clear communication of thought process',
      'Good use of examples',
      'Collaborative problem-solving',
    ],
    improvements: [
      'Consider edge cases earlier',
      'Ask clarifying questions before diving in',
    ],
  };

  return {
    data: mockAIFeedback,
  };
}

/**
 * Get user statistics
 */
export async function getUserStats(): Promise<ApiResponse<UserStats>> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockStats: UserStats = {
    total_sessions: 12,
    streak_days: 7,
    avg_peer_score: 4.3,
    weekly_scores: [
      { date: '2025-10-29', score: 4.0 },
      { date: '2025-10-30', score: 4.2 },
      { date: '2025-10-31', score: 4.5 },
      { date: '2025-11-01', score: 4.3 },
      { date: '2025-11-02', score: 4.4 },
      { date: '2025-11-03', score: 4.6 },
      { date: '2025-11-04', score: 4.5 },
    ],
    recent_sessions: MOCK_SESSIONS,
  };

  return {
    data: mockStats,
  };
}

/**
 * Update session notes
 */
export async function updateSessionNotes(
  sessionId: string,
  notes: string
): Promise<ApiResponse<{ success: boolean }>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const session = MOCK_SESSIONS.find((s) => s.id === sessionId);
  if (session) {
    session.notes = notes;
  }

  return {
    data: { success: true },
  };
}


