import React from "react";
import { View, ScrollView, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import KPICards from "../components/dashboard/KPICards";
import SessionsChart from "../components/dashboard/SessionsChart";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import SessionHistory from "../components/dashboard/SessionHistory";
import styles from "../styles/dashboardStyles";

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <DashboardHeader paddingTop={insets.top} />
        
        <View style={styles.content}>
          <KPICards />
          <SessionsChart />
          <PerformanceChart />
          <SessionHistory />
        </View>
      </ScrollView>
    </View>
  );
}
