import React from "react";
import { View } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import styles from "../../styles/home/UpcomingSessionsStyles";

interface Session {
  id: string;
  topic: string;
  difficulty: string;
  time: string;
  partnerId?: string;
  partnerName?: string;
}

interface UpcomingSessionsProps {
  sessions: Session[];
}

export default function UpcomingSessions({ sessions }: UpcomingSessionsProps) {
  const router = useRouter();

  const handleJoinSession = (sessionId: string) => {
    // Navigate to session screen
    router.push(`/(app)/session?id=${sessionId}`);
  };

  const handleSchedule = () => {
    router.push('/(app)/schedule');
  };

  return (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
          <Text style={styles.arrowIcon}>→</Text>
        </View>
        
        {sessions.length === 0 ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>📅</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 }}>
              No Scheduled Sessions
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 16 }}>
              Scheduled sessions will appear here
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
                  <Text style={styles.sessionTopic}>{session.topic}</Text>
                  <Text style={styles.sessionTime}>
                    {session.time}
                    {session.partnerName && ` • with ${session.partnerName}`}
                  </Text>
                </View>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyText}>{session.difficulty}</Text>
                </View>
              </View>
              <Button
                mode="contained"
                style={styles.joinButton}
                labelStyle={styles.joinButtonText}
                buttonColor="#3b82f6"
                onPress={() => handleJoinSession(session.id)}
              >
                Join Session
              </Button>
            </LinearGradient>
          ))
        )}
      </Card.Content>
    </Card>
  );
}
