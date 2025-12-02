import React from "react";
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHomeStats } from "../../lib/hooks/useHomeStats";
import { useScheduledSessions } from "../../lib/hooks/useScheduledSessions";
import { useScheduleInvites } from "../../lib/hooks/useScheduleInvites";
import { useScheduleNotifications } from "../../lib/hooks/useScheduleNotifications";
import { useNotificationHandler, requestNotificationPermissions } from "../../lib/utils/notificationService";
import HomeHeader from "../components/home/HomeHeader";
import WeeklyThemeCard from "../components/home/WeeklyThemeCard";
import QuickActions from "../components/home/QuickActions";
import UpcomingSessions from "../components/home/UpcomingSessions";
import ScheduledSessionsCard from "../components/home/ScheduledSessionsCard";
import ReceivedInvitesCard from "../components/home/ReceivedInvitesCard";
import RecentActivity from "../components/home/RecentActivity";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { quickStats, recentSessions, practiceFocus, upcomingSessions, loading, refreshStats } = useHomeStats();
  const { 
    upcomingSessions: scheduledSessions, 
    isUpcomingLoading,
    confirmSession,
    cancelSession,
    isConfirming,
    isCancelling,
    refetch: refetchScheduled,
  } = useScheduledSessions();
  const {
    receivedInvites,
    isReceivedLoading,
    acceptInvite,
    declineInvite,
    isAccepting,
    isDeclining,
    refetch: refetchInvites,
  } = useScheduleInvites();
  const {
    scheduleInviteAcceptedNotification,
    scheduleInviteDeclinedNotification,
    scheduleSessionReminder,
  } = useScheduleNotifications();

  // Request notification permissions on mount
  React.useEffect(() => {
    requestNotificationPermissions();
  }, []);

  // Setup notification handlers
  useNotificationHandler(
    (notification) => {
      console.log("📲 Notification received:", notification);
      // Handle foreground notification logic here if needed
    },
    (response) => {
      console.log("👆 Notification tapped:", response);
      const data = response.notification.request.content.data;
      
      // Navigate based on notification action
      if (data.action === "open_invites") {
        // Could navigate to invites tab/screen
      } else if (data.action === "open_scheduled") {
        // Could navigate to scheduled sessions
      }
    }
  );

  // Transform recent sessions for RecentActivity component
  const recentActivities = recentSessions.map(session => ({
    topic: session.topic,
    partner: session.partner,
    rating: session.rating,
    date: formatDate(session.date),
  }));

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      // Find the invite to get details for notification
      const invite = receivedInvites.find(inv => inv.id === inviteId);
      if (invite?.profiles?.display_name) {
        const time = new Date(invite.scheduled_for).toLocaleTimeString(
          "default",
          { hour: "2-digit", minute: "2-digit", hour12: true }
        );
        await scheduleInviteAcceptedNotification(
          invite.profiles.display_name,
          invite.topic_name || "Practice",
          time
        );
      }
      await acceptInvite(inviteId);
    } catch (error) {
      console.error("Error accepting invite:", error);
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    try {
      // Find the invite to get details for notification
      const invite = receivedInvites.find(inv => inv.id === inviteId);
      if (invite?.profiles?.display_name) {
        await scheduleInviteDeclinedNotification(
          invite.profiles.display_name,
          invite.topic_name || "Practice"
        );
      }
      await declineInvite(inviteId);
    } catch (error) {
      console.error("Error declining invite:", error);
    }
  };

  const handleRefresh = async () => {
    await refreshStats();
    await refetchScheduled();
    await refetchInvites();
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            tintColor="#8B5CF6"
            colors={["#8B5CF6"]}
          />
        }
      >
        <HomeHeader stats={quickStats} paddingTop={insets.top + 32} />

        <View style={styles.mainContent}>
          <WeeklyThemeCard focus={practiceFocus} />
          <QuickActions />
          
          {/* Received Invites */}
          {receivedInvites && receivedInvites.length > 0 && (
            <ReceivedInvitesCard
              invites={receivedInvites}
              isLoading={isReceivedLoading}
              onAccept={handleAcceptInvite}
              onDecline={handleDeclineInvite}
              isAccepting={isAccepting}
              isDeclining={isDeclining}
            />
          )}
          
          {/* Scheduled Sessions */}
          {scheduledSessions && scheduledSessions.length > 0 && (
            <ScheduledSessionsCard
              sessions={scheduledSessions}
              isLoading={isUpcomingLoading}
              onConfirm={confirmSession}
              onCancel={cancelSession}
              isConfirming={isConfirming}
              isCancelling={isCancelling}
            />
          )}
          
          <UpcomingSessions sessions={scheduledSessions || []} />
          {recentActivities.length > 0 && (
            <RecentActivity activities={recentActivities} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// Helper function to format dates
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes} minutes ago`;
    }
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  mainContent: {
    paddingHorizontal: 16,
    marginTop: -80,
    paddingBottom: 32,
    gap: 16,
  },
});