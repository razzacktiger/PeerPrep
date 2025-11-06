/**
 * Home Screen
 * Welcome dashboard with quick actions
 */

import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Platform, Alert } from "react-native";
import { Text, Card, Button, Chip, Avatar, Divider } from "react-native-paper";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useAuthStore } from "../../stores/authStore";
import * as sessionsApi from "../../lib/api/sessions";

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [notificationPermission, setNotificationPermission] = useState<
    string | null
  >(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  // Fetch recent sessions
  const { data: recentSessions, isLoading } = useQuery({
    queryKey: ["recentSessions"],
    queryFn: () => sessionsApi.getRecentSessions(3),
  });

  // Mock streak data
  const streakDays = 7;

  // Check notification permission on mount
  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotificationPermission(status);
  };

  const handleEnableNotifications = async () => {
    setIsRequestingPermission(true);

    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission Denied",
          "You can enable notifications later in your device settings.",
          [{ text: "OK" }]
        );
        setNotificationPermission(finalStatus);
        setIsRequestingPermission(false);
        return;
      }

      setNotificationPermission(finalStatus);
      Alert.alert(
        "Success!",
        "Notifications enabled. You'll be notified when partners join your sessions.",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to enable notifications. Please try again.");
    } finally {
      setIsRequestingPermission(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Welcome Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text variant="headlineMedium" style={styles.greeting}>
              Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
            </Text>
            <Chip
              icon="fire"
              style={styles.streakChip}
              textStyle={styles.streakText}
            >
              {streakDays} day streak
            </Chip>
          </View>
        </View>

        {/* Quick Action Cards */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Quick Actions
          </Text>

          <Card
            style={styles.actionCard}
            onPress={() => router.push("/(app)/topics")}
          >
            <Card.Content style={styles.cardContent}>
              <Avatar.Icon size={48} icon="play" style={styles.cardIcon} />
              <View style={styles.cardText}>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  Practice Now
                </Text>
                <Text variant="bodyMedium" style={styles.cardSubtitle}>
                  Find a partner and start practicing
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card
            style={styles.actionCard}
            onPress={() => router.push("/(app)/schedule")}
          >
            <Card.Content style={styles.cardContent}>
              <Avatar.Icon size={48} icon="calendar" style={styles.cardIcon} />
              <View style={styles.cardText}>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  Schedule Session
                </Text>
                <Text variant="bodyMedium" style={styles.cardSubtitle}>
                  Plan a session for later
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card
            style={styles.actionCard}
            onPress={() => router.push("/(app)/dashboard")}
          >
            <Card.Content style={styles.cardContent}>
              <Avatar.Icon
                size={48}
                icon="chart-line"
                style={styles.cardIcon}
              />
              <View style={styles.cardText}>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  View Dashboard
                </Text>
                <Text variant="bodyMedium" style={styles.cardSubtitle}>
                  Track your progress and stats
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Recent Sessions */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Recent Sessions
          </Text>

          {isLoading ? (
            <Text>Loading...</Text>
          ) : recentSessions?.data && recentSessions.data.length > 0 ? (
            recentSessions.data.map((session) => (
              <Card key={session.id} style={styles.sessionCard}>
                <Card.Content>
                  <View style={styles.sessionHeader}>
                    <Avatar.Image
                      size={40}
                      source={{ uri: session.partner_avatar }}
                    />
                    <View style={styles.sessionInfo}>
                      <Text variant="titleMedium">{session.partner_name}</Text>
                      <Text variant="bodySmall" style={styles.sessionTopic}>
                        {session.topic_name}
                      </Text>
                    </View>
                    <Chip mode="outlined" compact>
                      {session.duration_minutes}m
                    </Chip>
                  </View>
                  <Divider style={styles.divider} />
                  <Text variant="bodySmall" style={styles.sessionNotes}>
                    {session.notes || "No notes"}
                  </Text>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text variant="bodyMedium" style={styles.emptyText}>
                  No sessions yet. Start practicing to see your history here!
                </Text>
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Notification Permission CTA - only show if not granted */}
        {notificationPermission !== "granted" && (
          <Card style={styles.notificationCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.notificationTitle}>
                📱 Enable Notifications
              </Text>
              <Text variant="bodyMedium" style={styles.notificationText}>
                Get notified when partners join your scheduled sessions
              </Text>
              <Button
                mode="outlined"
                style={styles.notificationButton}
                onPress={handleEnableNotifications}
                loading={isRequestingPermission}
                disabled={isRequestingPermission}
              >
                {isRequestingPermission ? "Requesting..." : "Enable"}
              </Button>
            </Card.Content>
          </Card>
        )}
      </View>
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
  header: {
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontWeight: "bold",
    flex: 1,
  },
  streakChip: {
    backgroundColor: "#ff6f00",
  },
  streakText: {
    color: "white",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  actionCard: {
    marginBottom: 12,
    backgroundColor: "white",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    backgroundColor: "#6200ee",
  },
  cardText: {
    marginLeft: 16,
    flex: 1,
  },
  cardTitle: {
    fontWeight: "bold",
  },
  cardSubtitle: {
    color: "#666",
  },
  sessionCard: {
    marginBottom: 12,
    backgroundColor: "white",
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  sessionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  sessionTopic: {
    color: "#666",
  },
  divider: {
    marginVertical: 8,
  },
  sessionNotes: {
    color: "#666",
    fontStyle: "italic",
  },
  emptyCard: {
    backgroundColor: "#e3f2fd",
  },
  emptyText: {
    textAlign: "center",
    color: "#1976d2",
  },
  notificationCard: {
    backgroundColor: "#fff3e0",
    marginBottom: 16,
  },
  notificationTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  notificationText: {
    color: "#666",
    marginBottom: 12,
  },
  notificationButton: {
    borderColor: "#ff6f00",
  },
});
