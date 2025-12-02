import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GRADIENTS } from "../../../lib/constants/colors";
import styles from "../../styles/settings/SettingsHeaderStyles";

interface SettingsHeaderProps {
  paddingTop: number;
}

export default function SettingsHeader({ paddingTop }: SettingsHeaderProps) {
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
            <MaterialCommunityIcons name="account" size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Manage your account and preferences</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
