import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthStore } from "../../../stores/authStore";
import styles from "../../styles/home/HomeHeaderStyles";

interface HomeHeaderProps {
  stats: Array<{
    label: string;
    value: string;
    icon: string;
    gradient: readonly [string, string];
  }>;
  paddingTop: number;
}

export default function HomeHeader({ stats, paddingTop }: HomeHeaderProps) {
  const user = useAuthStore((state) => state.user);
  
  return (
    <LinearGradient
      colors={["#9333ea", "#3b82f6", "#4f46e5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.headerGradient, { paddingTop }]}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons
                name="account-circle"
                size={56}
                color="#E5E7EB"
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.userName}>{user?.display_name || "User"} 👋</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <LinearGradient
                colors={stat.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statIconContainer}
              >
                <Text style={styles.statIcon}>{stat.icon}</Text>
              </LinearGradient>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}
