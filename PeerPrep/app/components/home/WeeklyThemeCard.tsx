import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import styles from "../../styles/home/WeeklyThemeCardStyles";

interface PracticeFocusCardProps {
  focus: {
    topic: string;
    topicId: string;
    score: number;
    sessionsCompleted: number;
    totalSessions: number;
    progress: number;
  } | null;
}

export default function WeeklyThemeCard({ focus }: PracticeFocusCardProps) {
  const router = useRouter();

  if (!focus) {
    return (
      <LinearGradient
        colors={["#faf5ff", "#fce7f3", "#ffedd5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.themeCard}
      >
        <View style={styles.themeHeader}>
          <View style={styles.themeInfo}>
            <View style={styles.themeBadge}>
              <Text style={styles.trendingIcon}>💡</Text>
              <Text style={styles.themeBadgeText}>Practice Focus</Text>
            </View>
            <Text style={styles.themeTitle}>Start Your Journey</Text>
            <Text style={styles.themeSubtitle}>Complete sessions to get personalized recommendations</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  const handlePress = () => {
    // Navigate to topics screen, could pre-select this topic
    router.push('/(app)/topics');
  };

  return (
    <Pressable onPress={handlePress}>
      <LinearGradient
        colors={["#faf5ff", "#fce7f3", "#ffedd5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.themeCard}
      >
        <View style={styles.themeHeader}>
          <View style={styles.themeInfo}>
            <View style={styles.themeBadge}>
              <Text style={styles.trendingIcon}>🎯</Text>
              <Text style={styles.themeBadgeText}>Practice Focus</Text>
            </View>
            <Text style={styles.themeTitle}>{focus.topic}</Text>
            <Text style={styles.themeSubtitle}>
              Improve your weakest area • {focus.score}% mastery
            </Text>
          </View>
          <View style={styles.themeProgress}>
            <Text style={styles.themeProgressText}>
              {focus.sessionsCompleted}/{focus.totalSessions}
            </Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarLabels}>
            <Text style={styles.progressLabel}>Sessions with feedback</Text>
            <Text style={styles.progressLabel}>{focus.progress}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={["#f59e0b", "#ef4444"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${focus.progress}%` }]}
            />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
