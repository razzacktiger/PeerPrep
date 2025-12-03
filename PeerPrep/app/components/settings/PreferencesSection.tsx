import React from "react";
import { View, Text } from "react-native";
import { Switch } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/settings/PreferencesSectionStyles";

interface PreferencesSectionProps {
  darkMode: boolean;
  onDarkModeChange: (value: boolean) => void;
}

export default function PreferencesSection({
  darkMode,
  onDarkModeChange,
}: PreferencesSectionProps) {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferences</Text>

      {/* Appearance */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, styles.appearanceIcon]}>
            <MaterialCommunityIcons name="moon-waning-crescent" size={20} color="#F59E0B" />
          </View>
          <Text style={styles.cardTitle}>Appearance</Text>
        </View>

        <View style={styles.preferenceRow}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>Dark Mode</Text>
            <Text style={styles.preferenceDescription}>Switch to dark mode</Text>
            <Text style={styles.comingSoonBadge}>Coming Soon</Text>
          </View>
          <Switch value={darkMode} onValueChange={onDarkModeChange} color="#2563EB" disabled={true} />
        </View>
      </View>

      {/* Session Preferences */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, styles.sessionIcon]}>
            <MaterialCommunityIcons name="account-group" size={20} color="#6366F1" />
          </View>
          <Text style={styles.cardTitle}>Coming Soon</Text>
        </View>

        <Text style={styles.comingSoonText}>
          Additional preferences like session reminders, match updates, and auto-matching will be available in future updates.
        </Text>
      </View>
    </View>
  );
}
