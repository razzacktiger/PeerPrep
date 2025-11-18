import React from "react";
import { View, Animated } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/queue/QueueProgressStyles";

interface QueueProgressProps {
  status: "searching" | "found";
  estimatedTime?: number;
  progress: number;
}

export default function QueueProgress({
  status,
  estimatedTime,
  progress,
}: QueueProgressProps) {
  return (
    <View style={styles.progressSection}>
      {status === "searching" && estimatedTime !== undefined && (
        <View style={styles.timerRow}>
          <MaterialCommunityIcons
            name="timer-sand"
            size={20}
            color="#6B7280"
          />
          <Text style={styles.timerText}>
            Est. wait time: {estimatedTime}s
          </Text>
        </View>
      )}

      {/* Animated Progress Bar */}
      <View style={styles.progressBarContainer}>
        {status === "searching" && (
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: `${progress * 100}%`,
              },
            ]}
          >
            <LinearGradient
              colors={["#2563EB", "#4F46E5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressGradient}
            />
          </Animated.View>
        )}

        {status === "found" && (
          <View style={[styles.progressBarFill, { width: "100%" }]}>
            <LinearGradient
              colors={["#10B981", "#059669"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressGradient}
            />
          </View>
        )}
      </View>
    </View>
  );
}
