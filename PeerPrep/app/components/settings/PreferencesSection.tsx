import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import { Switch } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/settings/PreferencesSectionStyles";
import {
  requestNotificationPermissions,
  checkNotificationPermissions,
  openAppSettings,
} from "../../../lib/utils/notifications";

interface PreferencesSectionProps {
  darkMode: boolean;
  pushNotifications: boolean;
  onDarkModeChange: (value: boolean) => void;
  onPushNotificationsChange: (value: boolean) => void;
}

export default function PreferencesSection({
  darkMode,
  pushNotifications,
  onDarkModeChange,
  onPushNotificationsChange,
}: PreferencesSectionProps) {
  const [systemPermissionGranted, setSystemPermissionGranted] = useState(false);

  // Check notification permissions on mount
  useEffect(() => {
    checkPermissions();
  }, []);

  async function checkPermissions() {
    const granted = await checkNotificationPermissions();
    setSystemPermissionGranted(granted);
  }

  async function handlePushNotificationsToggle(value: boolean) {
    if (value) {
      // User wants to enable push notifications
      const granted = await requestNotificationPermissions();
      
      if (granted) {
        setSystemPermissionGranted(true);
        onPushNotificationsChange(true);
      } else {
        // Permission denied
        Alert.alert(
          'Permission Required',
          'Push notifications require permission. Would you like to open settings?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => openAppSettings() 
            },
          ]
        );
      }
    } else {
      // User wants to disable push notifications
      onPushNotificationsChange(false);
    }
  }

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
            <Text style={styles.preferenceDescription}>
              {systemPermissionGranted 
                ? 'Receive push notifications on your device'
                : 'Tap to enable push notifications'}
            </Text>
          </View>
          <Switch 
            value={pushNotifications} 
            onValueChange={handlePushNotificationsToggle} 
            color="#2563EB" 
          />
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
