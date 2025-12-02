import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScheduledSession } from "../../../lib/types";
import { TOPICS } from "../../../lib/constants";
import styles from "../../styles/home/UpcomingSessionsStyles";

interface UpcomingSessionsProps {
  sessions: ScheduledSession[];
}

export default function UpcomingSessions({ sessions }: UpcomingSessionsProps) {
  const router = useRouter();

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
                    {session.profiles?.display_name && ` • with ${session.profiles.display_name}`}
                  </Text>
                </View>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyText}>{session.status}</Text>
                </View>
              </View>
              {session.status === "confirmed" && (
                <Button
                  mode="contained"
                  style={styles.joinButton}
                  labelStyle={styles.joinButtonText}
                  buttonColor="#3b82f6"
                  onPress={() => handleJoinSession(session.id)}
                >
                  Join Session
                </Button>
              )}
            </LinearGradient>
          ))
        )}
      </Card.Content>
    </Card>
  );
}
