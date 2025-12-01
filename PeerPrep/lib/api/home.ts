import { supabase } from '../supabase';

export interface PracticeFocus {
  topic: string;
  topicId: string;
  score: number;
  sessionsCompleted: number;
  totalSessions: number;
  progress: number;
}

export interface UpcomingSession {
  id: string;
  topic: string;
  topicId: string;
  difficulty: string;
  time: string;
  scheduledFor: string;
  partnerId?: string;
  partnerName?: string;
}

/**
 * Get the user's weakest topic for practice focus
 */
export async function getPracticeFocus(userId: string): Promise<PracticeFocus | null> {
  try {
    // Get all sessions with feedback
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('topic_id, id')
      .or(`host_id.eq.${userId},guest_id.eq.${userId}`)
      .eq('status', 'completed');

    if (error) throw error;

    if (!sessions || sessions.length === 0) {
      return null;
    }

    const sessionIds = sessions.map(s => s.id);

    // Get feedback
    const { data: feedback, error: feedbackError } = await supabase
      .from('session_feedback')
      .select('session_id, clarity, correctness, confidence')
      .in('session_id', sessionIds)
      .eq('to_id', userId);

    if (feedbackError) throw feedbackError;

    if (!feedback || feedback.length === 0) {
      return null;
    }

    // Get topic names
    const topicIds = [...new Set(sessions.map(s => s.topic_id))];
    const { data: topics } = await supabase
      .from('topics')
      .select('id, name')
      .in('id', topicIds);

    const topicMap: { [key: string]: string } = {};
    topics?.forEach(t => {
      topicMap[t.id] = t.name;
    });

    // Calculate scores by topic
    const topicStats: { 
      [key: string]: { 
        total: number; 
        count: number; 
        sessions: number;
      } 
    } = {};

    sessions.forEach((session: any) => {
      const topicId = session.topic_id;
      const sessionFeedback = feedback?.filter(f => f.session_id === session.id);
      
      if (!topicStats[topicId]) {
        topicStats[topicId] = { total: 0, count: 0, sessions: 0 };
      }
      
      topicStats[topicId].sessions++;
      
      if (sessionFeedback && sessionFeedback.length > 0) {
        const avgScore = sessionFeedback.reduce((sum, f) => 
          sum + ((f.clarity + f.correctness + f.confidence) / 3), 0
        ) / sessionFeedback.length;

        topicStats[topicId].total += avgScore;
        topicStats[topicId].count++;
      }
    });

    // Find weakest topic (lowest average score)
    let weakestTopic = null;
    let lowestScore = 6; // Max score is 5

    for (const [topicId, stats] of Object.entries(topicStats)) {
      if (stats.count > 0) {
        const avgScore = stats.total / stats.count;
        if (avgScore < lowestScore) {
          lowestScore = avgScore;
          weakestTopic = {
            topicId,
            topic: topicMap[topicId] || 'Unknown',
            score: Math.round(avgScore * 20), // 0-100 scale
            sessionsCompleted: stats.count,
            totalSessions: stats.sessions,
            progress: stats.count > 0 ? Math.round((stats.count / stats.sessions) * 100) : 0,
          };
        }
      }
    }

    return weakestTopic;
  } catch (error) {
    console.error('Error fetching practice focus:', error);
    return null;
  }
}

/**
 * Get upcoming scheduled sessions
 */
export async function getUpcomingSessions(userId: string, limit: number = 3): Promise<UpcomingSession[]> {
  try {
    const now = new Date().toISOString();
    
    const { data: scheduledSessions, error } = await supabase
      .from('scheduled_sessions')
      .select(`
        id,
        topic_id,
        scheduled_for,
        partner_id,
        partner:profiles!scheduled_sessions_partner_id_fkey(display_name)
      `)
      .eq('creator_id', userId)
      .eq('status', 'pending')
      .gte('scheduled_for', now)
      .order('scheduled_for', { ascending: true })
      .limit(limit);

    if (error) throw error;

    if (!scheduledSessions || scheduledSessions.length === 0) {
      return [];
    }

    // Get topic names
    const topicIds = [...new Set(scheduledSessions.map(s => s.topic_id))];
    const { data: topics } = await supabase
      .from('topics')
      .select('id, name')
      .in('id', topicIds);

    const topicMap: { [key: string]: string } = {};
    topics?.forEach(t => {
      topicMap[t.id] = t.name;
    });

    return scheduledSessions.map((session: any) => {
      const scheduledDate = new Date(session.scheduled_for);
      const timeStr = formatScheduledTime(scheduledDate);
      
      return {
        id: session.id,
        topic: topicMap[session.topic_id] || 'Unknown Topic',
        topicId: session.topic_id,
        difficulty: 'Medium', // Default for now, can be enhanced
        time: timeStr,
        scheduledFor: session.scheduled_for,
        partnerId: session.partner_id,
        partnerName: session.partner?.display_name,
      };
    });
  } catch (error) {
    console.error('Error fetching upcoming sessions:', error);
    return [];
  }
}

/**
 * Format scheduled time as relative string
 */
function formatScheduledTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const timeStr = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  if (diffMins < 60) {
    return `In ${diffMins} minutes`;
  } else if (diffHours < 24) {
    return `Today at ${timeStr}`;
  } else if (diffDays === 1) {
    return `Tomorrow at ${timeStr}`;
  } else if (diffDays < 7) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${dayName} at ${timeStr}`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit' 
    });
  }
}
