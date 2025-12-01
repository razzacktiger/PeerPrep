import { useMemo, useState, useEffect } from 'react';
import { useStats } from '../contexts/StatsContext';
import { useAuthStore } from '../../stores/authStore';
import { getPracticeFocus, getUpcomingSessions, type PracticeFocus, type UpcomingSession } from '../api/home';

export function useHomeStats() {
  const { stats, recentSessions, loading, error, refreshStats } = useStats();
  const user = useAuthStore((state) => state.user);
  const [practiceFocus, setPracticeFocus] = useState<PracticeFocus | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [homeLoading, setHomeLoading] = useState(false);

  // Format stats for HomeHeader component (expects array format)
  const quickStats = useMemo(() => {
    if (!stats) {
      return [
        {
          label: "Sessions",
          value: "0",
          icon: "🎯",
          gradient: ["#3b82f6", "#06b6d4"] as const,
        },
        {
          label: "Streak",
          value: "0d",
          icon: "🔥",
          gradient: ["#f97316", "#ef4444"] as const,
        },
        {
          label: "Rating",
          value: "0.0",
          icon: "⭐",
          gradient: ["#a855f7", "#ec4899"] as const,
        },
      ];
    }

    return [
      {
        label: "Sessions",
        value: stats.totalSessions.toString(),
        icon: "🎯",
        gradient: ["#3b82f6", "#06b6d4"] as const,
      },
      {
        label: "Streak",
        value: `${stats.currentStreak}d`,
        icon: "🔥",
        gradient: ["#f97316", "#ef4444"] as const,
      },
      {
        label: "Rating",
        value: stats.avgRating.toFixed(1),
        icon: "⭐",
        gradient: ["#a855f7", "#ec4899"] as const,
      },
    ];
  }, [stats]);

  // Recent sessions (limit to 3 for home screen)
  const recentSessionsPreview = useMemo(() => {
    return recentSessions.slice(0, 3);
  }, [recentSessions]);

  // Fetch practice focus and upcoming sessions
  // Only fetch once when user changes, NOT when stats change
  useEffect(() => {
    if (!user?.id) return;

    const fetchHomeData = async () => {
      setHomeLoading(true);
      try {
        const [focus, upcoming] = await Promise.all([
          getPracticeFocus(user.id),
          getUpcomingSessions(user.id, 3),
        ]);
        setPracticeFocus(focus);
        setUpcomingSessions(upcoming);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setHomeLoading(false);
      }
    };

    fetchHomeData();
  }, [user?.id]); // Removed stats dependency to prevent cascade

  const refreshHomeData = async () => {
    await refreshStats();
    if (user?.id) {
      const [focus, upcoming] = await Promise.all([
        getPracticeFocus(user.id),
        getUpcomingSessions(user.id, 3),
      ]);
      setPracticeFocus(focus);
      setUpcomingSessions(upcoming);
    }
  };

  return {
    quickStats,
    recentSessions: recentSessionsPreview,
    practiceFocus,
    upcomingSessions,
    loading: loading || homeLoading,
    error,
    refreshStats: refreshHomeData,
  };
}
