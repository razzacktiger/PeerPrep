import { useMemo, useState } from 'react';
import { useStats } from '../contexts/StatsContext';

interface KPI {
  label: string;
  value: string;
  change: string;
  icon: string;
  gradient: string[];
}

const INITIAL_SESSIONS_LIMIT = 5;
const LOAD_MORE_INCREMENT = 5;

export function useDashboard() {
  const { stats, sessionsOverTime, topicPerformance, recentSessions: allRecentSessions, loading, error, refreshStats } = useStats();
  const [sessionsLimit, setSessionsLimit] = useState(INITIAL_SESSIONS_LIMIT);
  const [loadingMore, setLoadingMore] = useState(false);

  // Slice sessions based on current limit
  const recentSessions = useMemo(() => {
    return allRecentSessions.slice(0, sessionsLimit);
  }, [allRecentSessions, sessionsLimit]);

  // Check if there are more sessions to load
  const hasMoreSessions = useMemo(() => {
    return allRecentSessions.length > sessionsLimit;
  }, [allRecentSessions.length, sessionsLimit]);

  // Transform stats into KPI format
  const kpis: KPI[] = useMemo(() => {
    if (!stats) {
      return [
        {
          label: "Sessions",
          value: "0",
          change: "0%",
          icon: "target",
          gradient: ["#3B82F6", "#06B6D4"],
        },
        {
          label: "Success Rate",
          value: "0%",
          change: "0%",
          icon: "trending-up",
          gradient: ["#10B981", "#059669"],
        },
        {
          label: "Avg Rating",
          value: "0.0",
          change: "0",
          icon: "trophy",
          gradient: ["#8B5CF6", "#EC4899"],
        },
        {
          label: "Total Hours",
          value: "0h",
          change: "0h",
          icon: "clock-outline",
          gradient: ["#F59E0B", "#EF4444"],
        },
      ];
    }

    return [
      {
        label: "Sessions",
        value: stats.totalSessions.toString(),
        change: stats.sessionsChange,
        icon: "target",
        gradient: ["#3B82F6", "#06B6D4"],
      },
      {
        label: "Success Rate",
        value: `${stats.successRate}%`,
        change: stats.successRateChange,
        icon: "trending-up",
        gradient: ["#10B981", "#059669"],
      },
      {
        label: "Avg Rating",
        value: stats.avgRating.toFixed(1),
        change: stats.avgRatingChange,
        icon: "trophy",
        gradient: ["#8B5CF6", "#EC4899"],
      },
      {
        label: "Total Hours",
        value: `${stats.totalHours}h`,
        change: stats.totalHoursChange,
        icon: "clock-outline",
        gradient: ["#F59E0B", "#EF4444"],
      },
    ];
  }, [stats]);

  const loadMoreSessions = () => {
    setLoadingMore(true);
    setSessionsLimit(prev => prev + LOAD_MORE_INCREMENT);
    setLoadingMore(false);
  };

  const resetSessionsLimit = () => {
    setSessionsLimit(INITIAL_SESSIONS_LIMIT);
  };

  return {
    kpis,
    sessionsOverTime,
    topicPerformance,
    recentSessions,
    loading,
    loadingMore,
    hasMoreSessions,
    error,
    refreshStats,
    loadMoreSessions,
    resetSessionsLimit,
  };
}
