/**
 * Received Schedule Invites Component
 * Displays invites from other users pending user response
 */

import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScheduledSession } from "../../../lib/types";

interface ReceivedInvitesProps {
  invites: ScheduledSession[];
  isLoading?: boolean;
  onAccept?: (inviteId: string) => void;
  onDecline?: (inviteId: string) => void;
  isAccepting?: boolean;
  isDeclining?: boolean;
}

export default function ReceivedInvites({
  invites,
  isLoading = false,
  onAccept,
  onDecline,
  isAccepting = false,
  isDeclining = false,
}: ReceivedInvitesProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Invitations</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      </View>
    );
  }

  if (!invites || invites.length === 0) {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invitations</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {invites.map((invite) => {
          const { date, time } = formatDateTime(invite.scheduled_for);

          return (
            <View key={invite.id} style={styles.inviteCard}>
              {/* Creator Badge */}
              <View style={styles.creatorSection}>
                <View style={styles.creatorInfo}>
                  {invite.profiles?.avatar_url ? (
                    <Image
                      source={{ uri: invite.profiles.avatar_url }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={[styles.avatar, styles.placeholderAvatar]}>
                      <MaterialCommunityIcons
                        name="account"
                        size={20}
                        color="#8B5CF6"
                      />
                    </View>
                  )}
                  <View style={styles.creatorDetails}>
                    <Text style={styles.creatorName}>
                      {invite.profiles?.display_name || "Unknown"}
                    </Text>
                    <Text style={styles.invitedLabel}>invited you</Text>
                  </View>
                </View>
              </View>

              {/* Session Details */}
              <View style={styles.detailsSection}>
                <View style={styles.topicBadge}>
                  <Text style={styles.topicIcon}>{invite.icon || "📚"}</Text>
                  <View>
                    <Text style={styles.topicName} numberOfLines={1}>
                      {invite.topic_name || "Practice"}
                    </Text>
                    <Text style={styles.difficulty}>
                      {invite.difficulty || "Medium"}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={14}
                    color="#6B7280"
                  />
                  <Text style={styles.infoText}>{date}</Text>
                  <Text style={styles.separator}>•</Text>
                  <Text style={styles.infoText}>{time}</Text>
                </View>

                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="clock" size={14} color="#6B7280" />
                  <Text style={styles.infoText}>
                    {invite.duration_minutes || 30} mins
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={() => onAccept?.(invite.id)}
                  disabled={isAccepting || isDeclining}
                >
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={18}
                    color="#FFFFFF"
                  />
                  <Text style={styles.acceptButtonText}>
                    {isAccepting ? "..." : "Accept"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.declineButton]}
                  onPress={() => onDecline?.(invite.id)}
                  disabled={isAccepting || isDeclining}
                >
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={18}
                    color="#EF4444"
                  />
                  <Text style={styles.declineButtonText}>
                    {isDeclining ? "..." : "Decline"}
                  </Text>
                </TouchableOpacity>
              </View>
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
  inviteCard: {
    width: 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderLeftColor: "#8B5CF6",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  creatorSection: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  creatorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  placeholderAvatar: {
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  creatorDetails: {
    flex: 1,
  },
  creatorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  invitedLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  detailsSection: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  topicBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  topicIcon: {
    fontSize: 24,
  },
  topicName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  difficulty: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: "#6B7280",
  },
  separator: {
    color: "#D1D5DB",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  acceptButton: {
    backgroundColor: "#10B981",
  },
  acceptButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  declineButton: {
    backgroundColor: "#FEE2E2",
  },
  declineButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EF4444",
  },
  loadingContainer: {
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
