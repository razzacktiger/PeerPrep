/**
 * Mock Matchmaking API
 */

import { ApiResponse, Session, Question } from '../types';
import { MOCK_QUESTIONS } from '../constants';

/**
 * Find a match for the user
 * Simulates matchmaking queue
 */
export async function findMatch(topicId: string): Promise<ApiResponse<Session>> {
  // Simulate searching for a match (2-4 seconds)
  const searchTime = 2000 + Math.random() * 2000;
  await new Promise((resolve) => setTimeout(resolve, searchTime));

  // Randomly decide if match is found (90% success rate for demo)
  if (Math.random() < 0.9) {
    // Get a random question from the topic
    const questions = MOCK_QUESTIONS[topicId] || MOCK_QUESTIONS['1'];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

    // Create mock session
    const session: Session = {
      id: `session_${Date.now()}`,
      topic_id: topicId,
      topic_name: randomQuestion.topic,
      partner_id: `partner_${Date.now()}`,
      partner_name: getRandomPartnerName(),
      partner_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        getRandomPartnerName()
      )}`,
      status: 'active',
      started_at: new Date().toISOString(),
      duration_minutes: 25,
      question: randomQuestion,
    };

    return {
      data: session,
    };
  } else {
    return {
      error: 'No match found. Please try again.',
    };
  }
}

/**
 * Cancel matchmaking search
 */
export async function cancelMatch(): Promise<void> {
  // Nothing to do in mock
  await new Promise((resolve) => setTimeout(resolve, 100));
}

/**
 * Get random partner name for demo
 */
function getRandomPartnerName(): string {
  const names = [
    'Emma Wilson',
    'James Brown',
    'Sophia Davis',
    'Michael Johnson',
    'Olivia Martinez',
    'William Garcia',
    'Ava Rodriguez',
    'Alexander Lee',
  ];
  return names[Math.floor(Math.random() * names.length)];
}

/**
 * Schedule a session
 */
export async function scheduleSession(
  topicId: string,
  scheduledFor: Date
): Promise<ApiResponse<{ success: boolean; sessionId: string }>> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    data: {
      success: true,
      sessionId: `scheduled_${Date.now()}`,
    },
  };
}


