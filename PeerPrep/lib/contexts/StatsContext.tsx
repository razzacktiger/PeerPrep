import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { getBatchStats } from '../api/statsOptimized';
import type {
  UserStats,
  SessionsOverTime,
  TopicPerformance,
  RecentSession,
} from '../types/stats';

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

      // OPTIMIZED: Single batch query instead of 4 separate calls
      const { userStats, sessionsOverTime: sessionsData, topicPerformance: performanceData, recentSessions: historyData } = await getBatchStats(user.id);

      setStats(userStats);
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
