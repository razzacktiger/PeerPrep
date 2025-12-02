import React, { useState } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScheduledSession } from "../../../lib/types";
import { TOPICS } from "../../../lib/constants";
import { canJoinSession, canCancelSession, refreshAndFindMatches } from "../../../lib/api/matching";
import { confirmMatchedSession, declineMatchedSession } from "../../../lib/api/scheduling";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/home/UpcomingSessionsStyles";

interface UpcomingSessionsProps {
  sessions: ScheduledSession[];
  onRefresh?: () => void;
}

export default function UpcomingSessions({ sessions, onRefresh }: UpcomingSessionsProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debug log to see what data we're receiving
  React.useEffect(() => {
    console.log("🏠 UpcomingSessions received:", sessions);
    sessions.forEach((session, index) => {
      console.log(`Session ${index}:`, {
        id: session.id,
        topic_id: session.topic_id,
        topics: session.topics,
        scheduled_for: session.scheduled_for,
        status: session.status
      });
    });
  }, [sessions]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await refreshAndFindMatches();
      if (result.data) {
        const { matchedCount, matches } = result.data;
        if (matchedCount > 0) {
          Alert.alert(
            "New Matches Found! 🎉",
            `Found ${matchedCount} new match${matchedCount > 1 ? 'es' : ''} for your sessions. Check your sessions page to accept or decline.`,
            [
              { 
                text: "View Sessions", 
                onPress: () => router.push("/(app)/my-sessions")
              },
              { text: "OK" }
            ]
          );
          onRefresh?.(); // Refresh the parent component data
        } else {
          Alert.alert(
            "No New Matches",
            "No new compatible sessions found at this time. Try again later!"
          );
        }
      } else {
        Alert.alert("Error", result.error || "Failed to refresh matches");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to refresh matches");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleJoinSession = (sessionId: string) => {
    // Navigate to session screen
    router.push(`/(app)/session?id=${sessionId}`);
  };

  const handleSchedule = () => {
    router.push('/(app)/schedule');
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short", 
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const handleConfirmMatch = async (sessionId: string) => {
    try {
      await confirmMatchedSession(sessionId);
      // Refresh would be handled by parent component
    } catch (error) {
      console.error("Failed to confirm match:", error);
    }
  };

  const handleDeclineMatch = async (sessionId: string) => {
    try {
      await declineMatchedSession(sessionId);
      // Refresh would be handled by parent component  
    } catch (error) {
      console.error("Failed to decline match:", error);
    }
  };

  const getTopicName = (session: ScheduledSession) => {
    // Try to get from joined data first
    if (session.topics?.name) {
      return session.topics.name;
    }
    
    // Fallback to constants lookup
    const topic = TOPICS.find(t => t.id === session.topic_id);
    return topic?.name || "Unknown Topic";
  };

  return (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => router.push("/(app)/my-sessions")}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
          <Text style={styles.arrowIcon}>→</Text>
        </TouchableOpacity>
        
        {sessions.length === 0 ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>📅</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 }}>
              No Upcoming Sessions
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 16 }}>
              Schedule your first session to get started
            </Text>
            <Button
              mode="contained"
              style={{ backgroundColor: '#3b82f6', borderRadius: 8 }}
              labelStyle={{ fontSize: 14, fontWeight: '600' }}
              onPress={handleSchedule}
            >
              Schedule Session
            </Button>
          </View>
        ) : (
          sessions.map((session) => (
            <LinearGradient
              key={session.id}
              colors={["#dbeafe", "#e0e7ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sessionItem}
            >
              <View style={styles.sessionContent}>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionTopic}>
                    {getTopicName(session)}
                  </Text>
                  <Text style={styles.sessionTime}>
                    {formatDateTime(session.scheduled_for)}
                    {session.partner_profile?.display_name && ` • with ${session.partner_profile.display_name}`}
                  </Text>
                </View>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyText}>
                    {session.status === "matched" ? "Found Match!" : 
                     session.status === "confirmed" ? "Confirmed" : 
                     session.status === "pending" ? "Looking..." : session.status}
                  </Text>
                </View>
              </View>
              
              {/* Action buttons based on status */}
              {session.status === "matched" && (
                <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                  <Button
                    mode="contained"
                    style={{ flex: 1, backgroundColor: "#10B981" }}
                    labelStyle={{ fontSize: 12 }}
                    onPress={() => handleConfirmMatch(session.id)}
                  >
                    Accept Match
                  </Button>
                  <Button
                    mode="outlined"
                    style={{ flex: 1 }}
                    labelStyle={{ fontSize: 12 }}
                    onPress={() => handleDeclineMatch(session.id)}
                  >
                    Decline
                  </Button>
                </View>
              )}
              
              {session.status === "confirmed" && canJoinSession(session.scheduled_for) && (
                <Button
                  mode="contained"
                  style={[styles.joinButton, { backgroundColor: "#2563EB" }]}
                  labelStyle={styles.joinButtonText}
                  onPress={() => handleJoinSession(session.id)}
                >
                  Join Session
                </Button>
              )}
              
              {(session.status === "pending" || session.status === "matched") && canCancelSession(session.scheduled_for) && (
                <Button
                  mode="outlined"
                  style={{ marginTop: 8, borderColor: "#EF4444" }}
                  labelStyle={{ color: "#EF4444", fontSize: 12 }}
                  onPress={() => {/* Handle cancel */}}
                >
                  Cancel Session
                </Button>
              )}
            </LinearGradient>
          ))
        )}
      </Card.Content>
    </Card>
  );
}
