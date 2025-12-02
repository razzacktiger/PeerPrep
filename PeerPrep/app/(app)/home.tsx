import React from "react";
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHomeStats } from "../../lib/hooks/useHomeStats";
import HomeHeader from "../components/home/HomeHeader";
import WeeklyThemeCard from "../components/home/WeeklyThemeCard";
import QuickActions from "../components/home/QuickActions";
import UpcomingSessions from "../components/home/UpcomingSessions";
import RecentActivity from "../components/home/RecentActivity";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { quickStats, recentSessions, practiceFocus, upcomingSessions, loading, refreshStats } = useHomeStats();

  // Transform recent sessions for RecentActivity component
  const recentActivities = recentSessions.map(session => ({
    id: session.id,
    topic: session.topic,
    partner: session.partner,
    rating: session.rating,
    date: formatDate(session.date),
    difficulty: session.difficulty,
    duration: session.duration,
  }));

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshStats}
            tintColor="#8B5CF6"
            colors={["#8B5CF6"]}
          />
        }
      >
        <HomeHeader stats={quickStats} paddingTop={insets.top + 32} />

        <View style={styles.mainContent}>
          <WeeklyThemeCard focus={practiceFocus} />
          <QuickActions />
          <UpcomingSessions sessions={upcomingSessions} />
          {recentActivities.length > 0 && (
            <RecentActivity activities={recentActivities} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// Helper function to format dates
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Recently';
  }
  
  const diffTime = now.getTime() - date.getTime(); // Remove Math.abs to get proper direction
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Handle future dates (should not happen, but just in case)
  if (diffTime < 0) {
    return 'Just now';
  }
  
  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'min' : 'mins'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hr' : 'hrs'} ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  mainContent: {
    paddingHorizontal: 16,
    marginTop: -80,
    paddingBottom: 32,
    gap: 16,
  },
});