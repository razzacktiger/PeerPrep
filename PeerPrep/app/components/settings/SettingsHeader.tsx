import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/settings/SettingsHeaderStyles";

interface SettingsHeaderProps {
  paddingTop: number;
}

export default function SettingsHeader({ paddingTop }: SettingsHeaderProps) {
  return (
    <LinearGradient
      colors={["#8B5CF6", "#6366F1"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container, { paddingTop }]}
    >
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="account" size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.title}>Settings</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>
    </LinearGradient>
  );
}
