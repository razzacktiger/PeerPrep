import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuthStore } from '../../stores/authStore';
import {
  getUserStats,
  getSessionsOverTime,
  getPerformanceByTopic,
  getRecentSessionHistory,
  type UserStats,
  type SessionsOverTime,
  type TopicPerformance,
  type RecentSession,
} from '../api/stats';

interface StatsContextType {
  stats: UserStats | null;
  sessionsOverTime: SessionsOverTime[];
  topicPerformance: TopicPerformance[];
  recentSessions: RecentSession[];
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

interface StatsProviderProps {
  children: ReactNode;
}

export function StatsProvider({ children }: StatsProviderProps) {
  const user = useAuthStore((state) => state.user);
  
  const [stats, setStats] = useState<UserStats | null>(null);
  const [sessionsOverTime, setSessionsOverTime] = useState<SessionsOverTime[]>([]);
  const [topicPerformance, setTopicPerformance] = useState<TopicPerformance[]>([]);
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [statsData, sessionsData, performanceData, historyData] = await Promise.all([
        getUserStats(user.id),
        getSessionsOverTime(user.id),
        getPerformanceByTopic(user.id),
        getRecentSessionHistory(user.id, 5),
      ]);

      setStats(statsData);
      setSessionsOverTime(sessionsData);
      setTopicPerformance(performanceData);
      setRecentSessions(historyData);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats when user changes
  useEffect(() => {
    fetchStats();
  }, [user?.id]);

  const refreshStats = async () => {
    await fetchStats();
  };

  return (
    <StatsContext.Provider
      value={{
        stats,
        sessionsOverTime,
        topicPerformance,
        recentSessions,
        loading,
        error,
        refreshStats,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}
