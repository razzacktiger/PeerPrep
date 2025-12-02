/**
 * Notification Service
 * Handles push notifications for PeerPrep
 */

import * as Notifications from "expo-notifications";
import { useEffect } from "react";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request user permission for notifications
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    console.log("📲 Requesting notification permissions...");

    const { status } = await Notifications.requestPermissionsAsync();

    if (status === "granted") {
      console.log("✅ Notification permissions granted");
      return true;
    } else {
      console.log("⚠️ Notification permissions denied");
      return false;
    }
  } catch (error: any) {
    console.error("❌ Error requesting notification permissions:", error);
    return false;
  }
}

/**
 * Send local notification immediately
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: Record<string, any>,
  badge?: number
): Promise<void> {
  try {
    console.log("📨 Sending local notification...", { title, body });

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        badge: badge || 1,
        sound: true,
      },
      trigger: null, // Send immediately
    });

    console.log("✅ Notification sent");
  } catch (error: any) {
    console.error("❌ Error sending notification:", error);
  }
}

/**
 * Schedule notification for later
 */
export async function scheduleNotification(
  title: string,
  body: string,
  secondsFromNow: number,
  data?: Record<string, any>,
  badge?: number
): Promise<string> {
  try {
    console.log("⏰ Scheduling notification...", {
      title,
      secondsFromNow,
    });

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        badge: badge || 1,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsFromNow,
      },
    });

    console.log("✅ Notification scheduled:", notificationId);
    return notificationId;
  } catch (error: any) {
    console.error("❌ Error scheduling notification:", error);
    throw error;
  }
}

/**
 * Schedule notification for specific date/time
 */
export async function scheduleNotificationAtTime(
  title: string,
  body: string,
  date: Date,
  data?: Record<string, any>,
  badge?: number
): Promise<string> {
  try {
    console.log("📅 Scheduling notification at specific time...", {
      title,
      date,
    });

    // Calculate seconds from now
    const now = new Date();
    const secondsFromNow = Math.max(1, Math.floor((date.getTime() - now.getTime()) / 1000));

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        badge: badge || 1,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsFromNow,
      },
    });

    console.log("✅ Notification scheduled at time:", notificationId);
    return notificationId;
  } catch (error: any) {
    console.error("❌ Error scheduling notification at time:", error);
    throw error;
  }
}

/**
 * Cancel a scheduled notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    console.log("🔕 Cancelling notification...", { notificationId });

    await Notifications.cancelScheduledNotificationAsync(notificationId);

    console.log("✅ Notification cancelled");
  } catch (error: any) {
    console.error("❌ Error cancelling notification:", error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    console.log("🔕 Cancelling all notifications...");

    await Notifications.cancelAllScheduledNotificationsAsync();

    console.log("✅ All notifications cancelled");
  } catch (error: any) {
    console.error("❌ Error cancelling all notifications:", error);
  }
}

/**
 * Hook to setup notification listeners
 */
export function useNotificationHandler(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponseReceived?: (
    response: Notifications.NotificationResponse
  ) => void
) {
  useEffect(() => {
    // Listen for notifications when app is in foreground
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("📲 Notification received:", notification);
        onNotificationReceived?.(notification);
      }
    );

    // Listen for notification interactions (when user taps notification)
    const subscription2 =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("👆 Notification response:", response);
        onNotificationResponseReceived?.(response);
      });

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, [onNotificationReceived, onNotificationResponseReceived]);
}

/**
 * Notification templates for PeerPrep
 */
export const notificationTemplates = {
  /**
   * Send notification for received invite
   */
  inviteReceived: async (
    inviterName: string,
    topic: string,
    time: string
  ) => {
    return sendLocalNotification(
      "New Schedule Invite! 📅",
      `${inviterName} invited you to ${topic} at ${time}`,
      {
        type: "invite_received",
        action: "open_invites",
      },
      1
    );
  },

  /**
   * Send notification for accepted invite
   */
  inviteAccepted: async (partnerName: string, topic: string, time: string) => {
    return sendLocalNotification(
      "Invitation Accepted! ✅",
      `${partnerName} accepted your ${topic} session at ${time}`,
      {
        type: "invite_accepted",
        action: "open_scheduled",
      },
      0
    );
  },

  /**
   * Send notification for declined invite
   */
  inviteDeclined: async (partnerName: string, topic: string) => {
    return sendLocalNotification(
      "Invitation Declined ❌",
      `${partnerName} declined your ${topic} session invite`,
      {
        type: "invite_declined",
        action: "open_home",
      },
      0
    );
  },

  /**
   * Schedule reminder for upcoming session
   */
  sessionReminder: async (
    topic: string,
    time: Date,
    minutesBeforeSession: number = 15
  ) => {
    const reminderTime = new Date(
      time.getTime() - minutesBeforeSession * 60 * 1000
    );

    return scheduleNotificationAtTime(
      "Session Starting Soon! ⏰",
      `Your ${topic} session starts in ${minutesBeforeSession} minutes`,
      reminderTime,
      {
        type: "session_reminder",
        action: "open_session",
      },
      1
    );
  },

  /**
   * Schedule notification for when session starts
   */
  sessionStarting: async (topic: string, time: Date) => {
    return scheduleNotificationAtTime(
      "Time to Practice! 🎯",
      `Your ${topic} session is starting now`,
      time,
      {
        type: "session_starting",
        action: "open_session",
      },
      2
    );
  },
};
