import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/topics/TopicCardStyles";

export interface Topic {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  difficulty: "Easy" | "Medium" | "Hard";
  questions: number;
  description: string;
  gradient: readonly [string, string];
}

interface TopicCardProps {
  topic: Topic;
  onPracticeNow: (topic: Topic) => void;
  onSchedule: (topic: Topic) => void;
}

export default function TopicCard({
  topic,
  onPracticeNow,
  onSchedule,
}: TopicCardProps) {
  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return styles.difficultyEasy;
      case "Medium":
        return styles.difficultyMedium;
      case "Hard":
        return styles.difficultyHard;
      default:
        return styles.difficultyDefault;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.topSection}>
          <LinearGradient
            colors={topic.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <MaterialCommunityIcons
              name={topic.icon}
              size={28}
              color="#FFFFFF"
            />
          </LinearGradient>

          <View style={styles.infoContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.topicName}>{topic.name}</Text>
              <View
                style={[
                  styles.difficultyBadge,
                  getDifficultyStyle(topic.difficulty),
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    getDifficultyStyle(topic.difficulty),
                  ]}
                >
                  {topic.difficulty}
                </Text>
              </View>
            </View>
            <Text style={styles.description}>{topic.description}</Text>
            <Text style={styles.questionsCount}>
              {topic.questions} questions
            </Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.practiceButton}
            onPress={() => onPracticeNow(topic)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#2563eb", "#4f46e5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.practiceGradient}
            >
              <Text style={styles.practiceButtonText}>Practice Now</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.scheduleButton}
            onPress={() => onSchedule(topic)}
            activeOpacity={0.8}
          >
            <Text style={styles.scheduleButtonText}>Schedule</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
