/**
 * Notifications Utility
 * 
 * Handles push notification permissions and registration
 */

import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';

// Configure notification behavior when app is in foreground
// Only set this if we're not in Expo Go to avoid warnings
if (!__DEV__ || Platform.OS !== 'android') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * Request notification permissions from the user
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If not already granted, ask for permission
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Check if notification permissions are currently granted
 */
export async function checkNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
}

/**
 * Configure notification channels (Android only)
 */
export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6366F1',
      });

      await Notifications.setNotificationChannelAsync('sessions', {
        name: 'Session Reminders',
        description: 'Notifications for upcoming practice sessions',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6366F1',
      });

      await Notifications.setNotificationChannelAsync('matches', {
        name: 'Match Updates',
        description: 'Notifications when you get matched with a peer',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10B981',
      });
    } catch (error) {
      // Silently fail in Expo Go
      console.log('Notification channels setup skipped (Expo Go limitation)');
    }
  }
}

/**
 * Schedule a local notification
 */
export async function scheduleNotification(
  title: string,
  body: string,
  data?: Record<string, any>,
  triggerSeconds?: number
): Promise<string> {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: triggerSeconds 
      ? { seconds: triggerSeconds, repeats: false } as Notifications.TimeIntervalTriggerInput
      : null,
  });

  return notificationId;
}

/**
 * Cancel a scheduled notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Send a test notification (for testing purposes)
 */
export async function sendTestNotification(): Promise<void> {
  await scheduleNotification(
    'Test Notification',
    'This is a test notification from PeerPrep!',
    { type: 'test' },
    2 // Trigger after 2 seconds
  );
}

/**
 * Open device settings for this app (to manage permissions)
 */
export function openAppSettings(): void {
  if (Platform.OS === 'ios') {
    Alert.alert(
      'Notification Settings',
      'Please enable notifications in Settings > Notifications > PeerPrep',
      [{ text: 'OK' }]
    );
  } else {
    Alert.alert(
      'Notification Settings',
      'Please enable notifications in your device settings',
      [{ text: 'OK' }]
    );
  }
}
