import React from "react";
import { View } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../styles/home/UpcomingSessionsStyles";

interface Session {
  topic: string;
  difficulty: string;
  time: string;
}

interface UpcomingSessionsProps {
  sessions: Session[];
}

export default function UpcomingSessions({ sessions }: UpcomingSessionsProps) {
  if (sessions.length === 0) return null;

  return (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
          <Text style={styles.arrowIcon}>→</Text>
        </View>
        {sessions.map((session, index) => (
          <LinearGradient
            key={index}
            colors={["#dbeafe", "#e0e7ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sessionItem}
          >
            <View style={styles.sessionContent}>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionTopic}>{session.topic}</Text>
                <Text style={styles.sessionTime}>{session.time}</Text>
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
            >
              Join Session
            </Button>
          </LinearGradient>
        ))}
      </Card.Content>
    </Card>
  );
}
