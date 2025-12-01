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
