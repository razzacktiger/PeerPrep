import { useMemo } from 'react';
import { useStats } from '../contexts/StatsContext';

interface KPI {
  label: string;
  value: string;
  change: string;
  icon: string;
  gradient: string[];
}

export function useDashboard() {
  const { stats, sessionsOverTime, topicPerformance, recentSessions, loading, error, refreshStats } = useStats();

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

  return {
    kpis,
    sessionsOverTime,
    topicPerformance,
    recentSessions,
    loading,
    error,
    refreshStats,
  };
}
