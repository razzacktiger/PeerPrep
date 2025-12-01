import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getDifficultyColor } from "../../../lib/utils/difficultyColors";
import styles from "../../styles/dashboard/SessionHistoryStyles";

interface Session {
  id: string;
  partner: string;
  topic: string;
  difficulty: string;
  rating: number;
  date: string;
  duration: string;
}

interface SessionHistoryProps {
  sessions: Session[];
}

export default function SessionHistory({ sessions }: SessionHistoryProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session History</Text>
      
      <View style={styles.sessionsList}>
        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="history" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No sessions yet</Text>
            <Text style={styles.emptySubtext}>Start practicing to see your history</Text>
          </View>
        ) : (
          sessions.map((session) => {
            const difficultyColors = getDifficultyColor(session.difficulty);
            return (
              <View key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionTopic}>{session.topic}</Text>
                    <View style={styles.sessionMeta}>
                      <Text style={styles.metaText}>{session.partner}</Text>
                      <Text style={styles.metaDivider}>•</Text>
                      <Text style={styles.metaText}>{session.duration}</Text>
                    </View>
                  </View>
                  <View style={[styles.difficultyBadge, { backgroundColor: difficultyColors.bg }]}>
                    <Text style={[styles.difficultyText, { color: difficultyColors.text }]}>
                      {session.difficulty}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.sessionFooter}>
                  <Text style={styles.dateText}>
                    {new Date(session.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                  <View style={styles.rating}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <MaterialCommunityIcons
                        key={i}
                        name="star"
                        size={14}
                        color={i < session.rating ? "#F59E0B" : "#D1D5DB"}
                      />
                    ))}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}
