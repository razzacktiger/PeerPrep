/**
 * Dashboard Screen
 * User stats, history, and progress tracking
 */

import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import {
  Text,
  Card,
  Chip,
  Button,
  Avatar,
  Divider,
  Portal,
  Modal,
} from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { LineChart } from "react-native-chart-kit";
import * as sessionsApi from "../../lib/api/sessions";

export default function DashboardScreen() {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch user stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: sessionsApi.getUserStats,
  });

  const handleSessionPress = (session: any) => {
    setSelectedSession(session);
    setShowDetailModal(true);
  };

  const handleExport = () => {
    // Stub - would export data as CSV/JSON
    alert("Export feature coming soon!");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading stats...</Text>
      </View>
    );
  }

  const userStats = stats?.data;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* KPI Cards */}
        <View style={styles.kpiRow}>
          <Card style={styles.kpiCard}>
            <Card.Content style={styles.kpiContent}>
              <Text variant="headlineMedium" style={styles.kpiValue}>
                {userStats?.total_sessions || 0}
              </Text>
              <Text variant="bodyMedium" style={styles.kpiLabel}>
                Total Sessions
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.kpiCard}>
            <Card.Content style={styles.kpiContent}>
              <Text
                variant="headlineMedium"
                style={[styles.kpiValue, styles.streakValue]}
              >
                🔥 {userStats?.streak_days || 0}
              </Text>
              <Text variant="bodyMedium" style={styles.kpiLabel}>
                Day Streak
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.kpiCard}>
            <Card.Content style={styles.kpiContent}>
              <Text variant="headlineMedium" style={styles.kpiValue}>
                {userStats?.avg_peer_score?.toFixed(1) || "0.0"}
              </Text>
              <Text variant="bodyMedium" style={styles.kpiLabel}>
                Avg Score
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Line Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <View style={styles.chartHeader}>
              <Text variant="titleLarge" style={styles.chartTitle}>
                Weekly Progress
              </Text>
              <Chip mode="outlined" compact>
                Last 7 Days
              </Chip>
            </View>

            {userStats?.weekly_scores && userStats.weekly_scores.length > 0 ? (
              <LineChart
                data={{
                  labels: userStats.weekly_scores.map((s: any) =>
                    new Date(s.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })
                  ),
                  datasets: [
                    {
                      data: userStats.weekly_scores.map((s: any) => s.score),
                    },
                  ],
                }}
                width={Dimensions.get("window").width - 64}
                height={220}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#6200ee",
                  },
                }}
                bezier
                style={styles.chart}
              />
            ) : (
              <Text style={styles.noDataText}>No data available yet</Text>
            )}
          </Card.Content>
        </Card>

        {/* Session History */}
        <Card style={styles.historyCard}>
          <Card.Content>
            <View style={styles.historyHeader}>
              <Text variant="titleLarge" style={styles.historyTitle}>
                Session History
              </Text>
              <Button mode="outlined" compact onPress={handleExport}>
                Export
              </Button>
            </View>

            <Divider style={styles.divider} />

            {userStats?.recent_sessions &&
            userStats.recent_sessions.length > 0 ? (
              userStats.recent_sessions.map((session: any) => (
                <Card
                  key={session.id}
                  style={styles.sessionCard}
                  onPress={() => handleSessionPress(session)}
                >
                  <Card.Content>
                    <View style={styles.sessionRow}>
                      <Avatar.Image
                        size={48}
                        source={{ uri: session.partner_avatar }}
                      />
                      <View style={styles.sessionInfo}>
                        <Text variant="titleMedium">
                          {session.partner_name}
                        </Text>
                        <Text variant="bodySmall" style={styles.sessionMeta}>
                          {session.topic_name} • {session.duration_minutes}m
                        </Text>
                        <Text variant="bodySmall" style={styles.sessionDate}>
                          {new Date(session.started_at).toLocaleDateString()}
                        </Text>
                      </View>
                      <Chip
                        mode="flat"
                        compact
                        style={styles.statusChip}
                        textStyle={styles.statusChipText}
                      >
                        {session.status}
                      </Chip>
                    </View>
                  </Card.Content>
                </Card>
              ))
            ) : (
              <Text style={styles.noDataText}>No sessions yet</Text>
            )}
          </Card.Content>
        </Card>
      </View>

      {/* Session Detail Modal */}
      <Portal>
        <Modal
          visible={showDetailModal}
          onDismiss={() => setShowDetailModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          {selectedSession && (
            <View style={styles.modalContent}>
              <Text variant="headlineSmall" style={styles.modalTitle}>
                Session Details
              </Text>

              <View style={styles.modalRow}>
                <Text variant="titleMedium">Partner:</Text>
                <Text variant="bodyMedium">{selectedSession.partner_name}</Text>
              </View>

              <View style={styles.modalRow}>
                <Text variant="titleMedium">Topic:</Text>
                <Text variant="bodyMedium">{selectedSession.topic_name}</Text>
              </View>

              <View style={styles.modalRow}>
                <Text variant="titleMedium">Duration:</Text>
                <Text variant="bodyMedium">
                  {selectedSession.duration_minutes} minutes
                </Text>
              </View>

              <View style={styles.modalRow}>
                <Text variant="titleMedium">Question:</Text>
                <Text variant="bodyMedium">
                  {selectedSession.question?.title}
                </Text>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.notesSection}>
                <Text variant="titleMedium" style={styles.notesTitle}>
                  Notes:
                </Text>
                <Text variant="bodyMedium" style={styles.notesText}>
                  {selectedSession.notes || "No notes taken"}
                </Text>
              </View>

              <Button
                mode="contained"
                onPress={() => setShowDetailModal(false)}
              >
                Close
              </Button>
            </View>
          )}
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  kpiRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "white",
  },
  kpiContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  kpiValue: {
    fontWeight: "bold",
    color: "#6200ee",
  },
  streakValue: {
    color: "#ff6f00",
  },
  kpiLabel: {
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  chartCard: {
    backgroundColor: "white",
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chartTitle: {
    fontWeight: "bold",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    textAlign: "center",
    color: "#666",
    paddingVertical: 24,
  },
  historyCard: {
    backgroundColor: "white",
    marginBottom: 16,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  historyTitle: {
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 12,
  },
  sessionCard: {
    backgroundColor: "#f5f5f5",
    marginBottom: 8,
  },
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sessionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  sessionMeta: {
    color: "#666",
    marginTop: 2,
  },
  sessionDate: {
    color: "#999",
    fontSize: 12,
    marginTop: 2,
  },
  statusChip: {
    backgroundColor: "#4caf50",
  },
  statusChipText: {
    color: "white",
  },
  modalContainer: {
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  notesSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  notesTitle: {
    marginBottom: 8,
  },
  notesText: {
    color: "#666",
    fontStyle: "italic",
  },
});
