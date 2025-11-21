import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/schedule/SessionSummaryStyles";

interface SessionSummaryProps {
  topic?: string;
  difficulty?: string;
  date?: string;
  time?: string;
  duration?: string;
}

const getDifficultyStyle = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return styles.badgeEasy;
    case "Medium":
      return styles.badgeMedium;
    case "Hard":
      return styles.badgeHard;
    default:
      return styles.badgeDefault;
  }
};

export default function SessionSummary({
  topic,
  difficulty,
  date,
  time,
  duration,
}: SessionSummaryProps) {
  const hasAnyValue = topic || difficulty || date || time || duration;

  if (!hasAnyValue) {
    return null;
  }

  return (
    <LinearGradient
      colors={["#DBEAFE", "#E9D5FF", "#FCE7F3"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons name="star-four-points" size={20} color="#2563EB" />
        <Text style={styles.title}>Session Summary</Text>
      </View>
      <View style={styles.content}>
        {topic && (
          <View style={styles.row}>
            <Text style={styles.label}>Topic</Text>
            <Text style={styles.value}>{topic}</Text>
          </View>
        )}
        {difficulty && (
          <View style={styles.row}>
            <Text style={styles.label}>Difficulty</Text>
            <View style={[styles.badge, getDifficultyStyle(difficulty)]}>
              <Text style={styles.badgeText}>{difficulty}</Text>
            </View>
          </View>
        )}
        {date && (
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{date}</Text>
          </View>
        )}
        {time && (
          <View style={styles.row}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>{time}</Text>
          </View>
        )}
        {duration && (
          <View style={styles.row}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{duration}</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}
