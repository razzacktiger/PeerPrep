import React from "react";
import { View, ScrollView, StatusBar, ActivityIndicator, RefreshControl } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDashboard } from "../../lib/hooks/useDashboard";
import { useStats } from "../../lib/contexts/StatsContext";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import KPICards from "../components/dashboard/KPICards";
import SessionsChart from "../components/dashboard/SessionsChart";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import SessionHistory from "../components/dashboard/SessionHistory";
import styles from "../styles/dashboardStyles";

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { kpis, sessionsOverTime, topicPerformance, recentSessions, loading } = useDashboard();
  const { refreshStats } = useStats();

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshStats}
            tintColor="#8B5CF6"
            colors={["#8B5CF6"]}
          />
        }
      >
        <DashboardHeader paddingTop={insets.top + 32} />
        
        <View style={styles.content}>
          <KPICards kpis={kpis} />
          <SessionsChart data={sessionsOverTime} />
          <PerformanceChart data={topicPerformance} />
          <SessionHistory sessions={recentSessions} />
        </View>
      </ScrollView>
    </View>
  );
}
