import { supabase } from '../supabase';
import type { 
  UserStats, 
  SessionsOverTime, 
  TopicPerformance, 
  RecentSession 
} from '../types/stats';

interface BatchStatsResult {
  userStats: UserStats;
  sessionsOverTime: SessionsOverTime[];
  topicPerformance: TopicPerformance[];
  recentSessions: RecentSession[];
}

/**
 * Optimized: Fetch ALL stats data in one efficient batch
 * Eliminates duplicate queries for sessions, feedback, and topics
 */
export async function getBatchStats(userId: string): Promise<BatchStatsResult> {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfLastMonth = new Date(startOfMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // SINGLE BATCH QUERY - Fetch all data once
    const [
      { data: allSessions, error: sessionsError },
      { data: allFeedback, error: feedbackError },
      { data: allTopics, error: topicsError },
      { data: allQuestions, error: questionsError },
    ] = await Promise.all([
      // All sessions (for all calculations)
      supabase
        .from('sessions')
        .select(`
          id,
          topic_id,
          host_id,
          guest_id,
          created_at,
          duration_minutes,
          question_id,
          host:profiles!sessions_host_id_fkey(display_name),
          guest:profiles!sessions_guest_id_fkey(display_name)
        `)
        .or(`host_id.eq.${userId},guest_id.eq.${userId}`)
        .eq('status', 'completed')
        .order('created_at', { ascending: false }),

      // All feedback (for all calculations)
      supabase
        .from('session_feedback')
        .select('session_id, clarity, correctness, confidence, created_at')
        .eq('to_id', userId)
        .order('created_at', { ascending: false }),

      // All topics (for lookups)
      supabase
        .from('topics')
        .select('id, name'),

      // All questions (for difficulty lookup)
      supabase
        .from('practice_questions')
        .select('id, difficulty'),
    ]);

    if (sessionsError) throw sessionsError;
    if (feedbackError) throw feedbackError;
    if (topicsError) throw topicsError;

    // Create lookup maps
    const topicMap: { [key: string]: string } = {};
    allTopics?.forEach(t => {
      topicMap[t.id] = t.name;
    });

    const questionMap: { [key: string]: string } = {};
    allQuestions?.forEach(q => {
      questionMap[q.id] = q.difficulty;
    });

    const feedbackMap: { [sessionId: string]: typeof allFeedback } = {};
    allFeedback?.forEach(f => {
      if (!feedbackMap[f.session_id]) {
        feedbackMap[f.session_id] = [];
      }
      feedbackMap[f.session_id].push(f);
    });

    // Filter sessions by date ranges
    const currentMonthSessions = allSessions?.filter(s => 
      new Date(s.created_at) >= startOfMonth
    ) || [];

    const lastMonthSessions = allSessions?.filter(s => 
      new Date(s.created_at) >= startOfLastMonth && 
      new Date(s.created_at) < startOfMonth
    ) || [];

    const sixMonthsSessions = allSessions?.filter(s => 
      new Date(s.created_at) >= sixMonthsAgo
    ) || [];

    const currentMonthFeedback = allFeedback?.filter(f => 
      new Date(f.created_at) >= startOfMonth
    ) || [];

    const lastMonthFeedback = allFeedback?.filter(f => 
      new Date(f.created_at) >= startOfLastMonth && 
      new Date(f.created_at) < startOfMonth
    ) || [];

    // Calculate UserStats
    const userStats = calculateUserStats(
      currentMonthSessions,
      lastMonthSessions,
      currentMonthFeedback,
      lastMonthFeedback,
      allSessions || []
    );

    // Calculate Sessions Over Time
    const sessionsOverTime = calculateSessionsOverTime(sixMonthsSessions);

    // Calculate Topic Performance
    const topicPerformance = calculateTopicPerformance(
      allSessions || [],
      feedbackMap,
      topicMap
    );

    // Get Recent Sessions
    const recentSessions = formatRecentSessions(
      allSessions?.slice(0, 5) || [],
      feedbackMap,
      topicMap,
      questionMap,
      userId
    );

    return {
      userStats,
      sessionsOverTime,
      topicPerformance,
      recentSessions,
    };
  } catch (error) {
    console.error('Error fetching batch stats:', error);
    // Return default values
    return {
      userStats: getDefaultUserStats(),
      sessionsOverTime: getDefaultSessionsOverTime(),
      topicPerformance: [],
      recentSessions: [],
    };
  }
}

function calculateUserStats(
  currentMonthSessions: any[],
  lastMonthSessions: any[],
  currentMonthFeedback: any[],
  lastMonthFeedback: any[],
  allSessions: any[]
): UserStats {
  const totalSessions = currentMonthSessions.length;
  const lastMonthTotal = lastMonthSessions.length;
  const sessionsChange = calculatePercentageChange(totalSessions, lastMonthTotal);

  const totalMinutes = currentMonthSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const totalHours = Math.round(totalMinutes / 60);
  const lastMonthMinutes = lastMonthSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const lastMonthHours = Math.round(lastMonthMinutes / 60);
  const totalHoursChange = `+${totalHours - lastMonthHours}h`;

  const avgRating = currentMonthFeedback.length > 0
    ? currentMonthFeedback.reduce((sum, f) => sum + ((f.clarity + f.correctness + f.confidence) / 3), 0) / currentMonthFeedback.length
    : 0;

  const lastMonthAvgRating = lastMonthFeedback.length > 0
    ? lastMonthFeedback.reduce((sum, f) => sum + ((f.clarity + f.correctness + f.confidence) / 3), 0) / lastMonthFeedback.length
    : 0;
  const avgRatingChange = (avgRating - lastMonthAvgRating).toFixed(1);

  const successfulSessions = currentMonthFeedback.filter(f => 
    ((f.clarity + f.correctness + f.confidence) / 3) >= 4
  ).length;
  const successRate = currentMonthFeedback.length > 0
    ? Math.round((successfulSessions / currentMonthFeedback.length) * 100)
    : 0;

  const lastMonthSuccessful = lastMonthFeedback.filter(f => 
    ((f.clarity + f.correctness + f.confidence) / 3) >= 4
  ).length;
  const lastMonthSuccessRate = lastMonthFeedback.length > 0
    ? Math.round((lastMonthSuccessful / lastMonthFeedback.length) * 100)
    : 0;
  const successRateChange = `+${successRate - lastMonthSuccessRate}%`;

  const { currentStreak, longestStreak } = calculateStreak(allSessions);

  return {
    totalSessions,
    successRate,
    avgRating: parseFloat(avgRating.toFixed(1)),
    totalHours,
    currentStreak,
    longestStreak,
    sessionsChange,
    successRateChange,
    avgRatingChange: avgRatingChange.startsWith('-') ? avgRatingChange : `+${avgRatingChange}`,
    totalHoursChange,
  };
}

function calculateStreak(sessions: any[]): { currentStreak: number; longestStreak: number } {
  if (!sessions || sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const uniqueDates = [...new Set(sessions.map(s => 
    new Date(s.created_at).toISOString().split('T')[0]
  ))].sort().reverse();

  if (uniqueDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let currentStreak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    currentStreak = 1;
    let expectedDate = new Date(uniqueDates[0]);
    
    for (let i = 1; i < uniqueDates.length; i++) {
      expectedDate.setDate(expectedDate.getDate() - 1);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];
      
      if (uniqueDates[i] === expectedDateStr) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  let longestStreak = 1;
  let tempStreak = 1;
  let lastDate = new Date(uniqueDates[0]);

  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = new Date(uniqueDates[i]);
    const dayDiff = Math.floor((lastDate.getTime() - currentDate.getTime()) / 86400000);

    if (dayDiff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
    
    lastDate = currentDate;
  }

  return { currentStreak, longestStreak };
}

function calculateSessionsOverTime(sessions: any[]): SessionsOverTime[] {
  const monthCounts: { [key: string]: number } = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = monthNames[date.getMonth()];
    monthCounts[monthKey] = 0;
  }

  sessions.forEach(session => {
    const date = new Date(session.created_at);
    const monthKey = monthNames[date.getMonth()];
    if (monthKey in monthCounts) {
      monthCounts[monthKey]++;
    }
  });

  return Object.entries(monthCounts).map(([month, sessions]) => ({
    month,
    sessions,
  }));
}

function calculateTopicPerformance(
  sessions: any[],
  feedbackMap: { [key: string]: any[] },
  topicMap: { [key: string]: string }
): TopicPerformance[] {
  const topicScores: { [key: string]: { total: number; count: number } } = {};

  sessions.forEach(session => {
    const topicName = topicMap[session.topic_id] || 'Unknown';
    const sessionFeedback = feedbackMap[session.id];
    
    if (sessionFeedback && sessionFeedback.length > 0) {
      const avgScore = sessionFeedback.reduce((sum, f) => 
        sum + ((f.clarity + f.correctness + f.confidence) / 3), 0
      ) / sessionFeedback.length;

      if (!topicScores[topicName]) {
        topicScores[topicName] = { total: 0, count: 0 };
      }
      topicScores[topicName].total += avgScore;
      topicScores[topicName].count++;
    }
  });

  return Object.entries(topicScores)
    .map(([topic, { total, count }]) => ({
      topic: topic.length > 10 ? topic.substring(0, 10) : topic,
      score: Math.round((total / count) * 20),
    }))
    .slice(0, 5);
}

function formatRecentSessions(
  sessions: any[],
  feedbackMap: { [key: string]: any[] },
  topicMap: { [key: string]: string },
  questionMap: { [key: string]: string },
  userId: string
): RecentSession[] {
  return sessions.map(session => {
    const isHost = session.host_id === userId;
    const partner = isHost ? session.guest?.display_name : session.host?.display_name;
    const difficulty = session.question_id ? (questionMap[session.question_id] || 'Medium') : 'Medium';
    
    const sessionFeedback = feedbackMap[session.id];
    const rating = sessionFeedback && sessionFeedback.length > 0
      ? sessionFeedback.reduce((sum, f) => sum + ((f.clarity + f.correctness + f.confidence) / 3), 0) / sessionFeedback.length
      : 0;

    return {
      id: session.id,
      partner: partner || 'Unknown Partner',
      topic: topicMap[session.topic_id] || 'Unknown Topic',
      difficulty,
      rating: Math.round(rating),
      date: new Date(session.created_at).toISOString().split('T')[0],
      duration: `${session.duration_minutes || 45} min`,
    };
  });
}

function calculatePercentageChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const change = Math.round(((current - previous) / previous) * 100);
  return change >= 0 ? `+${change}%` : `${change}%`;
}

function getDefaultUserStats(): UserStats {
  return {
    totalSessions: 0,
    successRate: 0,
    avgRating: 0,
    totalHours: 0,
    currentStreak: 0,
    longestStreak: 0,
    sessionsChange: '0%',
    successRateChange: '0%',
    avgRatingChange: '0',
    totalHoursChange: '0h',
  };
}

function getDefaultSessionsOverTime(): SessionsOverTime[] {
  return [
    { month: 'Jan', sessions: 0 },
    { month: 'Feb', sessions: 0 },
    { month: 'Mar', sessions: 0 },
    { month: 'Apr', sessions: 0 },
    { month: 'May', sessions: 0 },
    { month: 'Jun', sessions: 0 },
  ];
}
