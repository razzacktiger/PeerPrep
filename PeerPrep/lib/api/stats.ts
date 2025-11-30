import { supabase } from '../supabase';

export interface UserStats {
  totalSessions: number;
  successRate: number;
  avgRating: number;
  totalHours: number;
  currentStreak: number;
  longestStreak: number;
  sessionsChange: string;
  successRateChange: string;
  avgRatingChange: string;
  totalHoursChange: string;
}

export interface SessionsOverTime {
  month: string;
  sessions: number;
}

export interface TopicPerformance {
  topic: string;
  score: number;
}

export interface RecentSession {
  id: string;
  partner: string;
  topic: string;
  difficulty: string;
  rating: number;
  date: string;
  duration: string;
}

/**
 * Calculate streak data from session history
 */
export async function getStreakData(userId: string): Promise<{ currentStreak: number; longestStreak: number }> {
  try {
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('created_at')
      .or(`host_id.eq.${userId},guest_id.eq.${userId}`)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!sessions || sessions.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Get unique dates (only count one session per day)
    const uniqueDates = [...new Set(sessions.map(s => 
      new Date(s.created_at).toISOString().split('T')[0]
    ))].sort().reverse();

    if (uniqueDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if streak is active (session today or yesterday)
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

    // Calculate longest streak
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
  } catch (error) {
    console.error('Error calculating streak:', error);
    return { currentStreak: 0, longestStreak: 0 };
  }
}

/**
 * Get user statistics for dashboard KPIs
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    // Get current month sessions
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: currentMonthSessions, error: currentError } = await supabase
      .from('sessions')
      .select('id, duration_minutes, status')
      .or(`host_id.eq.${userId},guest_id.eq.${userId}`)
      .gte('created_at', startOfMonth.toISOString())
      .eq('status', 'completed');

    if (currentError) throw currentError;

    // Get last month sessions for comparison
    const startOfLastMonth = new Date(startOfMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    const { data: lastMonthSessions, error: lastError } = await supabase
      .from('sessions')
      .select('id, duration_minutes')
      .or(`host_id.eq.${userId},guest_id.eq.${userId}`)
      .gte('created_at', startOfLastMonth.toISOString())
      .lt('created_at', startOfMonth.toISOString())
      .eq('status', 'completed');

    if (lastError) throw lastError;

    // Get feedback ratings
    const { data: feedback, error: feedbackError } = await supabase
      .from('session_feedback')
      .select('clarity, correctness, confidence, created_at')
      .eq('to_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (feedbackError) throw feedbackError;

    // Get streak data
    const { currentStreak, longestStreak } = await getStreakData(userId);

    // Calculate stats
    const totalSessions = currentMonthSessions?.length || 0;
    const lastMonthTotal = lastMonthSessions?.length || 0;
    const sessionsChange = calculatePercentageChange(totalSessions, lastMonthTotal);

    // Calculate total hours
    const totalMinutes = currentMonthSessions?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 0;
    const totalHours = Math.round(totalMinutes / 60);
    const lastMonthMinutes = lastMonthSessions?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 0;
    const lastMonthHours = Math.round(lastMonthMinutes / 60);
    const totalHoursChange = `+${totalHours - lastMonthHours}h`;

    // Calculate average rating (current month) - average of clarity, correctness, confidence
    const currentMonthFeedback = feedback?.filter(f => 
      new Date(f.created_at) >= startOfMonth
    ) || [];
    const avgRating = currentMonthFeedback.length > 0
      ? currentMonthFeedback.reduce((sum, f) => sum + ((f.clarity + f.correctness + f.confidence) / 3), 0) / currentMonthFeedback.length
      : 0;

    // Calculate last month average rating
    const lastMonthFeedback = feedback?.filter(f => 
      new Date(f.created_at) >= startOfLastMonth && new Date(f.created_at) < startOfMonth
    ) || [];
    const lastMonthAvgRating = lastMonthFeedback.length > 0
      ? lastMonthFeedback.reduce((sum, f) => sum + ((f.clarity + f.correctness + f.confidence) / 3), 0) / lastMonthFeedback.length
      : 0;
    const avgRatingChange = (avgRating - lastMonthAvgRating).toFixed(1);

    // Calculate success rate (sessions with average rating >= 4)
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
  } catch (error) {
    console.error('Error fetching user stats:', error);
    // Return default values on error
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
}

/**
 * Get sessions over time for chart (last 6 months)
 */
export async function getSessionsOverTime(userId: string): Promise<SessionsOverTime[]> {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('created_at')
      .or(`host_id.eq.${userId},guest_id.eq.${userId}`)
      .gte('created_at', sixMonthsAgo.toISOString())
      .eq('status', 'completed');

    if (error) throw error;

    // Group by month
    const monthCounts: { [key: string]: number } = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = monthNames[date.getMonth()];
      monthCounts[monthKey] = 0;
    }

    // Count sessions per month
    sessions?.forEach(session => {
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
  } catch (error) {
    console.error('Error fetching sessions over time:', error);
    // Return empty data on error
    return [
      { month: 'Jan', sessions: 0 },
      { month: 'Feb', sessions: 0 },
      { month: 'Mar', sessions: 0 },
      { month: 'Apr', sessions: 0 },
      { month: 'May', sessions: 0 },
      { month: 'Jun', sessions: 0 },
    ];
  }
}

/**
 * Get performance by topic for chart
 */
export async function getPerformanceByTopic(userId: string): Promise<TopicPerformance[]> {
  try {
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('topic_id, id')
      .or(`host_id.eq.${userId},guest_id.eq.${userId}`)
      .eq('status', 'completed');

    if (error) throw error;

    // Get feedback for these sessions
    const sessionIds = sessions?.map(s => s.id) || [];
    
    if (sessionIds.length === 0) {
      return [];
    }

    const { data: feedback, error: feedbackError } = await supabase
      .from('session_feedback')
      .select('session_id, clarity, correctness, confidence')
      .in('session_id', sessionIds)
      .eq('to_id', userId);

    if (feedbackError) throw feedbackError;

    // If no feedback exists, return empty array
    if (!feedback || feedback.length === 0) {
      return [];
    }

    // Get unique topic IDs
    const topicIds = [...new Set(sessions?.map(s => s.topic_id) || [])];
    
    if (topicIds.length === 0) {
      return [];
    }

    // Fetch topic names
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('id, name')
      .in('id', topicIds);

    if (topicsError) throw topicsError;

    // Create topic map for quick lookup
    const topicMap: { [key: string]: string } = {};
    topics?.forEach(t => {
      topicMap[t.id] = t.name;
    });

    // Group by topic and calculate average score
    const topicScores: { [key: string]: { total: number; count: number } } = {};

    sessions?.forEach((session: any) => {
      const topicName = topicMap[session.topic_id] || 'Unknown';
      const sessionFeedback = feedback?.filter(f => f.session_id === session.id);
      
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
        score: Math.round((total / count) * 20), // Convert 1-5 to 0-100 scale
      }))
      .slice(0, 5); // Top 5 topics
  } catch (error) {
    console.error('Error fetching performance by topic:', error);
    return [];
  }
}

/**
 * Get recent session history
 */
export async function getRecentSessionHistory(userId: string, limit: number = 5): Promise<RecentSession[]> {
  try {
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select(`
        id,
        created_at,
        duration_minutes,
        host_id,
        guest_id,
        host:profiles!sessions_host_id_fkey (display_name),
        guest:profiles!sessions_guest_id_fkey (display_name),
        topics (name),
        question_id
      `)
      .or(`host_id.eq.${userId},guest_id.eq.${userId}`)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Get question difficulties for these sessions
    const questionIds = sessions?.map(s => s.question_id).filter(Boolean) || [];
    let questionsMap: { [key: string]: string } = {};
    
    if (questionIds.length > 0) {
      const { data: questions } = await supabase
        .from('practice_questions')
        .select('id, difficulty')
        .in('id', questionIds);
      
      questionsMap = questions?.reduce((acc, q) => {
        acc[q.id] = q.difficulty;
        return acc;
      }, {} as { [key: string]: string }) || {};
    }

    // Get feedback for these sessions
    const sessionIds = sessions?.map(s => s.id) || [];
    let feedbackMap: { [key: string]: number } = {};
    
    if (sessionIds.length > 0) {
      const { data: feedback } = await supabase
        .from('session_feedback')
        .select('session_id, clarity, correctness, confidence')
        .in('session_id', sessionIds)
        .eq('to_id', userId);
      
      feedbackMap = feedback?.reduce((acc, f) => {
        acc[f.session_id] = (f.clarity + f.correctness + f.confidence) / 3;
        return acc;
      }, {} as { [key: string]: number }) || {};
    }

    return sessions?.map((session: any) => {
      const isHost = session.host_id === userId;
      const partner = isHost ? session.guest?.display_name : session.host?.display_name;
      const difficulty = session.question_id ? (questionsMap[session.question_id] || 'Medium') : 'Medium';
      const rating = feedbackMap[session.id] || 0;

      return {
        id: session.id,
        partner: partner || 'Unknown Partner',
        topic: session.topics?.name || 'Unknown Topic',
        difficulty,
        rating: Math.round(rating),
        date: new Date(session.created_at).toISOString().split('T')[0],
        duration: `${session.duration_minutes || 45} min`,
      };
    }) || [];
  } catch (error) {
    console.error('Error fetching recent sessions:', error);
    return [];
  }
}

/**
 * Helper function to calculate percentage change
 */
function calculatePercentageChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const change = Math.round(((current - previous) / previous) * 100);
  return change >= 0 ? `+${change}%` : `${change}%`;
}
