import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import styles from "../../styles/home/QuickActionsStyles";

export default function QuickActions() {
  const router = useRouter();

  return (
    <View style={styles.quickActions}>
      <Pressable
        onPress={() => router.push("/(app)/topics")}
        style={({ pressed }) => [
          styles.actionButton,
          pressed && styles.actionButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Practice Now"
        accessibilityHint="Start a coding practice session immediately"
      >
        <LinearGradient
          colors={["#2563eb", "#1d4ed8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.actionButtonGradient}
        >
          <View style={styles.actionIconContainer}>
            <Text style={styles.actionIcon}>📖</Text>
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Practice Now</Text>
            <Text style={styles.actionSubtitle}>Start a session</Text>
          </View>
        </LinearGradient>
      </Pressable>

      <Pressable
        onPress={() => router.push("/(app)/schedule")}
        style={({ pressed }) => [
          styles.actionButton,
          pressed && styles.actionButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Schedule Session"
        accessibilityHint="Plan a coding practice session for later"
      >
        <View style={styles.actionButtonWhite}>
          <LinearGradient
            colors={["#f3e8ff", "#dbeafe"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionIconContainer}
          >
            <Text style={styles.actionIconDark}>📅</Text>
          </LinearGradient>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitleDark}>Schedule</Text>
            <Text style={styles.actionSubtitleDark}>Plan ahead</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
