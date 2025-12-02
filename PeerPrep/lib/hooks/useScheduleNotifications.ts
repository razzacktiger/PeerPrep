/**
 * Hook for managing schedule notifications
 */

import { useEffect, useCallback } from "react";
import {
  scheduleNotificationAtTime,
  cancelNotification,
  notificationTemplates,
} from "../utils/notificationService";

export interface UseScheduleNotificationsReturn {
  scheduleInviteNotification: (
    inviterName: string,
    topic: string,
    scheduledTime: string
  ) => Promise<void>;

  scheduleSessionReminder: (
    topic: string,
    sessionTime: Date,
    minutesBefore?: number
  ) => Promise<void>;

  scheduleSessionStarting: (
    topic: string,
    sessionTime: Date
  ) => Promise<void>;

  scheduleInviteAcceptedNotification: (
    partnerName: string,
    topic: string,
    time: string
  ) => Promise<void>;

  scheduleInviteDeclinedNotification: (
    partnerName: string,
    topic: string
  ) => Promise<void>;

  cancelNotificationById: (notificationId: string) => Promise<void>;
}

export function useScheduleNotifications(): UseScheduleNotificationsReturn {
  const scheduleInviteNotification = useCallback(
    async (inviterName: string, topic: string, scheduledTime: string) => {
      try {
        console.log("📅 Scheduling invite notification...");
        await notificationTemplates.inviteReceived(
          inviterName,
          topic,
          scheduledTime
        );
      } catch (error: any) {
        console.error("Error scheduling invite notification:", error);
        throw error;
      }
    },
    []
  );

  const scheduleSessionReminder = useCallback(
    async (
      topic: string,
      sessionTime: Date,
      minutesBefore: number = 15
    ) => {
      try {
        console.log("⏰ Scheduling session reminder...");
        await notificationTemplates.sessionReminder(
          topic,
          sessionTime,
          minutesBefore
        );
      } catch (error: any) {
        console.error("Error scheduling session reminder:", error);
        throw error;
      }
    },
    []
  );

  const scheduleSessionStarting = useCallback(
    async (topic: string, sessionTime: Date) => {
      try {
        console.log("🎯 Scheduling session starting notification...");
        await notificationTemplates.sessionStarting(topic, sessionTime);
      } catch (error: any) {
        console.error("Error scheduling session starting notification:", error);
        throw error;
      }
    },
    []
  );

  const scheduleInviteAcceptedNotification = useCallback(
    async (partnerName: string, topic: string, time: string) => {
      try {
        console.log("✅ Scheduling invite accepted notification...");
        await notificationTemplates.inviteAccepted(partnerName, topic, time);
      } catch (error: any) {
        console.error("Error scheduling invite accepted notification:", error);
        throw error;
      }
    },
    []
  );

  const scheduleInviteDeclinedNotification = useCallback(
    async (partnerName: string, topic: string) => {
      try {
        console.log("❌ Scheduling invite declined notification...");
        await notificationTemplates.inviteDeclined(partnerName, topic);
      } catch (error: any) {
        console.error("Error scheduling invite declined notification:", error);
        throw error;
      }
    },
    []
  );

  const cancelNotificationById = useCallback(
    async (notificationId: string) => {
      try {
        console.log("🔕 Cancelling notification...");
        await cancelNotification(notificationId);
      } catch (error: any) {
        console.error("Error cancelling notification:", error);
        throw error;
      }
    },
    []
  );

  return {
    scheduleInviteNotification,
    scheduleSessionReminder,
    scheduleSessionStarting,
    scheduleInviteAcceptedNotification,
    scheduleInviteDeclinedNotification,
    cancelNotificationById,
  };
}
