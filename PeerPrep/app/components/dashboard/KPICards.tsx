import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/dashboard/KPICardsStyles";

const kpis = [
  { label: "Sessions", value: "24", change: "+12%", icon: "target", gradient: ["#3B82F6", "#06B6D4"] as const },
  { label: "Success Rate", value: "87%", change: "+5%", icon: "trending-up", gradient: ["#10B981", "#059669"] as const },
  { label: "Avg Rating", value: "4.6", change: "+0.3", icon: "trophy", gradient: ["#8B5CF6", "#EC4899"] as const },
  { label: "Total Hours", value: "18h", change: "+4h", icon: "clock-outline", gradient: ["#F59E0B", "#EF4444"] as const },
] as const;

export default function KPICards() {
  return (
    <View style={styles.container}>
      {kpis.map((kpi) => (
        <View key={kpi.label} style={styles.card}>
          <LinearGradient
            colors={kpi.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <MaterialCommunityIcons name={kpi.icon as any} size={24} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.value}>{kpi.value}</Text>
          <View style={styles.footer}>
            <Text style={styles.label}>{kpi.label}</Text>
            <Text style={styles.change}>{kpi.change}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
