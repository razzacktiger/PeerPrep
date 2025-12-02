import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/schedule/ScheduleHeaderStyles";

interface ScheduleHeaderProps {
  paddingTop: number;
}

export default function ScheduleHeader({ paddingTop }: ScheduleHeaderProps) {
  return (
    <LinearGradient
      colors={["#9333ea", "#3b82f6", "#4f46e5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container, { paddingTop }]}
    >
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="calendar" size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.title}>Schedule Session</Text>
            <Text style={styles.subtitle}>Plan your coding practice ahead</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
