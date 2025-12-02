/**
 * Scheduled Sessions Component
 * Displays user's upcoming scheduled sessions
 */

import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScheduledSession } from "../../../lib/types";

interface ScheduledSessionsProps {
  sessions: ScheduledSession[];
  isLoading?: boolean;
  onConfirm?: (sessionId: string) => void;
  onCancel?: (sessionId: string) => void;
  isConfirming?: boolean;
  isCancelling?: boolean;
}

export default function ScheduledSessions({
  sessions,
  isLoading = false,
  onConfirm,
  onCancel,
  isConfirming = false,
  isCancelling = false,
}: ScheduledSessionsProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Scheduled Sessions</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      </View>
    );
  }

  if (!sessions || sessions.length === 0) {
    return null;
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const time = date.toLocaleTimeString("default", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return { date: `${month} ${day}`, time };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "cancelled":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return "check-circle";
      case "pending":
        return "clock-outline";
      case "cancelled":
        return "close-circle";
      default:
        return "circle-outline";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scheduled Sessions</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sessions.map((session) => {
          const { date, time } = formatDateTime(session.scheduled_for);
          const statusColor = getStatusColor(session.status);
          const statusIcon = getStatusIcon(session.status);

          return (
            <View key={session.id} style={styles.sessionCard}>
              {/* Header with Status */}
              <View style={styles.cardHeader}>
                <View style={styles.topicBadge}>
                  <Text style={styles.topicIcon}>{session.icon || "📚"}</Text>
                  <View>
                    <Text style={styles.topicName} numberOfLines={1}>
                      {session.topic_name || "Practice"}
                    </Text>
                    <Text style={styles.difficulty}>
                      {session.difficulty || "Medium"}
                    </Text>
                  </View>
                </View>
                <View
                  style={[styles.statusBadge, { backgroundColor: statusColor }]}
                >
                  <MaterialCommunityIcons
                    name={statusIcon}
                    size={14}
                    color="#FFFFFF"
                  />
                </View>
              </View>

              {/* Date & Time */}
              <View style={styles.dateTimeContainer}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={16}
                  color="#6B7280"
                />
                <Text style={styles.dateTimeText}>{date}</Text>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.dateTimeText}>{time}</Text>
              </View>

              {/* Duration */}
              <View style={styles.durationContainer}>
                <MaterialCommunityIcons
                  name="clock"
                  size={16}
                  color="#6B7280"
                />
                <Text style={styles.durationText}>
                  {session.duration_minutes || 30} mins
                </Text>
              </View>

              {/* Partner Info (if confirmed) */}
              {session.status === "confirmed" && session.partner_name && (
                <View style={styles.partnerContainer}>
                  <MaterialCommunityIcons
                    name="account"
                    size={16}
                    color="#8B5CF6"
                  />
                  <Text style={styles.partnerName} numberOfLines={1}>
                    with {session.partner_name}
                  </Text>
                </View>
              )}

              {/* Action Buttons (for pending sessions) */}
              {session.status === "pending" && (
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={() => onConfirm?.(session.id)}
                    disabled={isConfirming || isCancelling}
                  >
                    <MaterialCommunityIcons
                      name="check"
                      size={16}
                      color="#FFFFFF"
                    />
                    <Text style={styles.confirmButtonText}>
                      {isConfirming ? "..." : "Confirm"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => onCancel?.(session.id)}
                    disabled={isConfirming || isCancelling}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={16}
                      color="#EF4444"
                    />
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  sessionCard: {
    width: 280,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  topicBadge: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  topicIcon: {
    fontSize: 24,
  },
  topicName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  difficulty: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  statusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  dateTimeText: {
    fontSize: 12,
    color: "#6B7280",
  },
  separator: {
    color: "#D1D5DB",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  durationText: {
    fontSize: 12,
    color: "#6B7280",
  },
  partnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  partnerName: {
    fontSize: 12,
    color: "#8B5CF6",
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  confirmButton: {
    backgroundColor: "#10B981",
  },
  confirmButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EF4444",
  },
  loadingContainer: {
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
