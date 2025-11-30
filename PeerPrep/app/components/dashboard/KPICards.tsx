import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/dashboard/KPICardsStyles";

interface KPI {
  label: string;
  value: string;
  change: string;
  icon: string;
  gradient: string[];
}

interface KPICardsProps {
  kpis: KPI[];
}

export default function KPICards({ kpis }: KPICardsProps) {
  return (
    <View style={styles.container}>
      {kpis.map((kpi, index) => (
        <View key={index} style={styles.card}>
          <LinearGradient
            colors={kpi.gradient as any}
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
