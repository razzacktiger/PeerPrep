import React from "react";
import { View, Text } from "react-native";
import { Switch } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/settings/PreferencesSectionStyles";

interface PreferencesSectionProps {
  darkMode: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  sessionReminders: boolean;
  matchUpdates: boolean;
  autoMatchOnPreferences: boolean;
  onDarkModeChange: (value: boolean) => void;
  onPushNotificationsChange: (value: boolean) => void;
  onEmailNotificationsChange: (value: boolean) => void;
  onSessionRemindersChange: (value: boolean) => void;
  onMatchUpdatesChange: (value: boolean) => void;
  onAutoMatchOnPreferencesChange: (value: boolean) => void;
}

export default function PreferencesSection({
  darkMode,
  pushNotifications,
  emailNotifications,
  sessionReminders,
  matchUpdates,
  autoMatchOnPreferences,
  onDarkModeChange,
  onPushNotificationsChange,
  onEmailNotificationsChange,
  onSessionRemindersChange,
  onMatchUpdatesChange,
  onAutoMatchOnPreferencesChange,
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
          </View>
          <Switch value={darkMode} onValueChange={onDarkModeChange} color="#2563EB" />
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, styles.notificationIcon]}>
            <MaterialCommunityIcons name="bell" size={20} color="#2563EB" />
          </View>
          <Text style={styles.cardTitle}>Notifications</Text>
        </View>

        <View style={styles.preferenceRow}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>Push Notifications</Text>
            <Text style={styles.preferenceDescription}>Receive push notifications on your device</Text>
          </View>
          <Switch value={pushNotifications} onValueChange={onPushNotificationsChange} color="#2563EB" />
        </View>

        <View style={styles.divider} />

        <View style={styles.preferenceRow}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>Email Notifications</Text>
            <Text style={styles.preferenceDescription}>Receive notifications via email</Text>
          </View>
          <Switch value={emailNotifications} onValueChange={onEmailNotificationsChange} color="#2563EB" />
        </View>

        <View style={styles.divider} />

        <View style={styles.preferenceRow}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>Session Reminders</Text>
            <Text style={styles.preferenceDescription}>Get reminded before sessions start</Text>
          </View>
          <Switch value={sessionReminders} onValueChange={onSessionRemindersChange} color="#2563EB" />
        </View>

        <View style={styles.divider} />

        <View style={styles.preferenceRow}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>Match Updates</Text>
            <Text style={styles.preferenceDescription}>Get notified when you're matched</Text>
          </View>
          <Switch value={matchUpdates} onValueChange={onMatchUpdatesChange} color="#2563EB" />
        </View>
      </View>

      {/* Session Preferences */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, styles.sessionIcon]}>
            <MaterialCommunityIcons name="account-group" size={20} color="#6366F1" />
          </View>
          <Text style={styles.cardTitle}>Session Preferences</Text>
        </View>

        <View style={styles.preferenceRow}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>Auto-match on Preferences</Text>
            <Text style={styles.preferenceDescription}>Automatically match based on your preferences</Text>
          </View>
          <Switch value={autoMatchOnPreferences} onValueChange={onAutoMatchOnPreferencesChange} color="#2563EB" />
        </View>
      </View>
    </View>
  );
}
