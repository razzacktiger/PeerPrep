import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../styles/home/WeeklyThemeCardStyles";

interface WeeklyThemeCardProps {
  theme: {
    title: string;
    subtitle: string;
    progress: number;
    completed: number;
    total: number;
  };
}

export default function WeeklyThemeCard({ theme }: WeeklyThemeCardProps) {
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
            <Text style={styles.trendingIcon}>📈</Text>
            <Text style={styles.themeBadgeText}>Weekly Focus</Text>
          </View>
          <Text style={styles.themeTitle}>{theme.title}</Text>
          <Text style={styles.themeSubtitle}>{theme.subtitle}</Text>
        </View>
        <View style={styles.themeProgress}>
          <Text style={styles.themeProgressText}>
            {theme.completed}/{theme.total}
          </Text>
        </View>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarLabels}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressLabel}>{theme.progress}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <LinearGradient
            colors={["#a855f7", "#ec4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${theme.progress}%` }]}
          />
        </View>
      </View>
    </LinearGradient>
  );
}
