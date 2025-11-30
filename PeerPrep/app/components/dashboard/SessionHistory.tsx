import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/dashboard/SessionHistoryStyles";

const recentSessions = [
  {
    id: 1,
    partner: "Alex Chen",
    topic: "Binary Trees",
    difficulty: "Medium",
    rating: 5,
    date: "2024-11-10",
    duration: "45 min",
  },
  {
    id: 2,
    partner: "Sarah Kim",
    topic: "Dynamic Programming",
    difficulty: "Hard",
    rating: 4,
    date: "2024-11-09",
    duration: "60 min",
  },
  {
    id: 3,
    partner: "Mike Johnson",
    topic: "Graphs",
    difficulty: "Medium",
    rating: 5,
    date: "2024-11-08",
    duration: "45 min",
  },
  {
    id: 4,
    partner: "Emma Davis",
    topic: "Arrays",
    difficulty: "Easy",
    rating: 4,
    date: "2024-11-07",
    duration: "30 min",
  },
  {
    id: 5,
    partner: "James Wilson",
    topic: "Hash Tables",
    difficulty: "Medium",
    rating: 5,
    date: "2024-11-06",
    duration: "45 min",
  },
];

const getDifficultyStyle = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return styles.difficultyEasy;
    case "Medium":
      return styles.difficultyMedium;
    case "Hard":
      return styles.difficultyHard;
    default:
      return styles.difficultyMedium;
  }
};

export default function SessionHistory() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session History</Text>
      
      <View style={styles.sessionsList}>
        {recentSessions.map((session) => (
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
              <View style={[styles.difficultyBadge, getDifficultyStyle(session.difficulty)]}>
                <Text style={styles.difficultyText}>{session.difficulty}</Text>
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
        ))}
      </View>
    </View>
  );
}
