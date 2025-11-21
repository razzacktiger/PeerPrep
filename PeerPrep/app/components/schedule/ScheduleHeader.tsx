import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../../styles/schedule/ScheduleHeaderStyles";

export default function ScheduleHeader() {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={["#9333EA", "#2563EB", "#4F46E5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top + 32 }]}
    >
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="calendar" size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.title}>Schedule Session</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Plan your coding practice ahead</Text>
      </View>
    </LinearGradient>
  );
}
