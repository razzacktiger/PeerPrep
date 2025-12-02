import { supabase } from '../supabase';

export interface SessionFeedback {
  clarity: number;
  correctness: number;
  confidence: number;
  comments: string | null;
  from_user: string;
}

export interface SessionDetailsData {
  id: string;
  topic: string;
  difficulty: string;
  partner: string;
  duration: string;
  date: string;
  rating: number;
  notes: {
    shared_notes?: string;
    code?: string;
    language?: string;
  } | null;
  feedback_received: SessionFeedback | null;
  feedback_given: SessionFeedback | null;
  ai_feedback: {
    fairness_score: number | null;
    summary: string | null;
    strengths: string[];
    improvements: string[];
  } | null;
}

export async function getSessionDetails(sessionId: string, userId: string): Promise<SessionDetailsData | null> {
  try {
    // Fetch session with related data
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select(`
        id,
        topic_id,
        host_id,
        guest_id,
        started_at,
        ended_at,
        duration_minutes,
        question_id,
        notes,
        shared_notes,
        code,
        topics (name),
        host:profiles!sessions_host_id_fkey(display_name),
        guest:profiles!sessions_guest_id_fkey(display_name)
      `)
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      console.error('Error fetching session:', sessionError);
      return null;
    }

    const isHost = session.host_id === userId;
    const partnerId = isHost ? session.guest_id : session.host_id;
    
    // Handle array returns from Supabase joins
    const hostData = Array.isArray(session.host) ? session.host[0] : session.host;
    const guestData = Array.isArray(session.guest) ? session.guest[0] : session.guest;
    const topicData = Array.isArray(session.topics) ? session.topics[0] : session.topics;
    
    const partnerName = isHost ? guestData?.display_name : hostData?.display_name;

    // Fetch question difficulty separately if question_id exists
    let difficulty = 'Medium';
    if (session.question_id) {
      const { data: questionData } = await supabase
        .from('practice_questions')
        .select('difficulty')
        .eq('id', session.question_id)
        .single();
      
      if (questionData) {
        difficulty = questionData.difficulty;
      }
    }

    // Fetch feedback received by the user
    const { data: feedbackReceived } = await supabase
      .from('session_feedback')
      .select(`
        clarity,
        correctness,
        confidence,
        comments,
        from_id,
        from_user:profiles!session_feedback_from_id_fkey(display_name)
      `)
      .eq('session_id', sessionId)
      .eq('to_id', userId)
      .single();

    // Fetch feedback given by the user
    const { data: feedbackGiven } = await supabase
      .from('session_feedback')
      .select(`
        clarity,
        correctness,
        confidence,
        comments,
        to_id,
        to_user:profiles!session_feedback_to_id_fkey(display_name)
      `)
      .eq('session_id', sessionId)
      .eq('from_id', userId)
      .single();

    // Fetch AI feedback if exists
    const { data: aiFeedback } = await supabase
      .from('ai_feedback')
      .select('fairness_score, summary, strengths, improvements')
      .eq('session_id', sessionId)
      .single();

    // Calculate average rating from received feedback
    const rating = feedbackReceived
      ? Math.round((feedbackReceived.clarity + feedbackReceived.correctness + feedbackReceived.confidence) / 3)
      : 0;

    // Format date
    const sessionDate = new Date(session.started_at || session.ended_at);
    const formattedDate = sessionDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return {
      id: session.id,
      topic: topicData?.name || 'Unknown Topic',
      difficulty: difficulty,
      partner: partnerName || 'Unknown Partner',
      duration: `${session.duration_minutes || 45} min`,
      date: formattedDate,
      rating,
      notes: {
        // Use dedicated columns from schema (shared_notes TEXT, code TEXT)
        shared_notes: session.shared_notes || null,
        code: session.code || null,
        // Extract language from notes JSONB if available
        language: (session.notes as any)?.language || 'javascript',
      },
      feedback_received: feedbackReceived ? {
        clarity: feedbackReceived.clarity,
        correctness: feedbackReceived.correctness,
        confidence: feedbackReceived.confidence,
        comments: feedbackReceived.comments,
        from_user: (() => {
          const fromUserData = feedbackReceived.from_user;
          if (Array.isArray(fromUserData) && fromUserData.length > 0) {
            return (fromUserData[0] as any)?.display_name || 'Partner';
          }
          return (fromUserData as any)?.display_name || 'Partner';
        })(),
      } : null,
      feedback_given: feedbackGiven ? {
        clarity: feedbackGiven.clarity,
        correctness: feedbackGiven.correctness,
        confidence: feedbackGiven.confidence,
        comments: feedbackGiven.comments,
        from_user: partnerName || 'Partner',
      } : null,
      ai_feedback: aiFeedback ? {
        fairness_score: aiFeedback.fairness_score,
        summary: aiFeedback.summary,
        strengths: aiFeedback.strengths || [],
        improvements: aiFeedback.improvements || [],
      } : null,
    };
  } catch (error) {
    console.error('Error fetching session details:', error);
    return null;
  }
}
