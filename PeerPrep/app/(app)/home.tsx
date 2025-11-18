import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../stores/authStore";
import HomeHeader from "../components/home/HomeHeader";
import WeeklyThemeCard from "../components/home/WeeklyThemeCard";
import QuickActions from "../components/home/QuickActions";
import UpcomingSessions from "../components/home/UpcomingSessions";
import RecentActivity from "../components/home/RecentActivity";

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const insets = useSafeAreaInsets();

  const stats = [
    {
      label: "Sessions",
      value: "24",
      icon: "🎯",
      gradient: ["#3b82f6", "#06b6d4"] as const,
    },
    {
      label: "Hours",
      value: "18h",
      icon: "⏰",
      gradient: ["#a855f7", "#ec4899"] as const,
    },
    {
      label: "Topics",
      value: "7",
      icon: "🏆",
      gradient: ["#f97316", "#ef4444"] as const,
    },
  ];

  const weeklyTheme = {
    title: "Trees & Graphs",
    subtitle: "Master traversal algorithms",
    progress: 65,
    completed: 3,
    total: 12,
  };

  const upcomingSessions = [
    { topic: "Hash Tables", difficulty: "Medium", time: "Today at 3:00 PM" },
    {
      topic: "Binary Search",
      difficulty: "Easy",
      time: "Tomorrow at 10:00 AM",
    },
  ];

  const recentActivities = [
    {
      topic: "Binary Trees",
      partner: "Alex Chen",
      rating: 5,
      date: "2 hours ago",
    },
    {
      topic: "Dynamic Programming",
      partner: "Sarah Kim",
      rating: 4,
      date: "Yesterday",
    },
    {
      topic: "Graphs",
      partner: "Mike Johnson",
      rating: 5,
      date: "2 days ago",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top }}
      >
        <HomeHeader user={user} stats={stats} />

        <View style={styles.mainContent}>
          <WeeklyThemeCard theme={weeklyTheme} />
          <QuickActions />
          <UpcomingSessions sessions={upcomingSessions} />
          <RecentActivity activities={recentActivities} />
        </View>
      </ScrollView>
    </View>
  );
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