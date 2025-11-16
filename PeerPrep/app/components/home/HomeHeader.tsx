import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { User } from "../../../lib/types";
import styles from "../../styles/home/HomeHeaderStyles";

interface HomeHeaderProps {
  user: User | null;
  stats: Array<{
    label: string;
    value: string;
    icon: string;
    gradient: readonly [string, string];
  }>;
}

export default function HomeHeader({ user, stats }: HomeHeaderProps) {
  return (
    <LinearGradient
      colors={["#9333ea", "#3b82f6", "#4f46e5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={require("../../../assets/default-pic.jpg")}
                style={styles.avatar}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.userName}>{user?.name || "User"} 👋</Text>
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
