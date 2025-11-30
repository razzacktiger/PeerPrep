import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/dashboard/DashboardHeaderStyles";

interface DashboardHeaderProps {
  paddingTop: number;
}

export default function DashboardHeader({ paddingTop }: DashboardHeaderProps) {
  return (
    <LinearGradient
      colors={["#9333EA", "#3B82F6", "#6366F1"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.headerGradient, { paddingTop }]}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="chart-bar" size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.title}>Analytics</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Track your progress and performance</Text>
      </View>
    </LinearGradient>
  );
}
