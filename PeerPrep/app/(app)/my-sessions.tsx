import React, { useState } from "react";
import { View, ScrollView, Text, StatusBar, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScheduledSessions } from "../../lib/hooks";
import { StyleSheet } from "react-native";
import { refreshAndFindMatches, debugSessionMatching } from "../../lib/api/matching";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { paddingVertical: 20, paddingHorizontal: 16, elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  headerContent: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255, 255, 255, 0.2)", justifyContent: "center", alignItems: "center" },
  headerTextContainer: { flex: 1, marginLeft: 16 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF" },
  headerSubtitle: { fontSize: 14, color: "rgba(255, 255, 255, 0.8)", marginTop: 2 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  debugButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255, 255, 255, 0.2)", justifyContent: "center", alignItems: "center" },
  refreshButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255, 255, 255, 0.2)", justifyContent: "center", alignItems: "center" },
  refreshButtonDisabled: { opacity: 0.5 },
  addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255, 255, 255, 0.2)", justifyContent: "center", alignItems: "center" },
  content: { padding: 16, paddingBottom: 32 },
  errorContainer: { backgroundColor: "#FEF2F2", padding: 12, borderRadius: 8, flexDirection: "row", alignItems: "center", marginBottom: 16, borderWidth: 1, borderColor: "#FECACA" },
  errorText: { marginLeft: 8, fontSize: 14, color: "#DC2626" },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#111827", marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, color: "#6B7280", marginBottom: 12 },
  sessionCard: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, borderWidth: 1, borderColor: "#F3F4F6" },
  sessionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  topicInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  topicIcon: { fontSize: 24, marginRight: 12 },
  topicDetails: { flex: 1 },
  topicName: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 2 },
  sessionTime: { fontSize: 14, color: "#6B7280" },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  confirmedBadge: { backgroundColor: "#D1FAE5" },
  pendingBadge: { backgroundColor: "#FEF3C7" },
  matchedBadge: { backgroundColor: "#DBEAFE" },
  defaultBadge: { backgroundColor: "#F3F4F6" },
  statusText: { fontSize: 12, fontWeight: "600" },
  partnerInfo: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  partnerName: { fontSize: 14, color: "#6B7280", marginLeft: 6 },
  actionButtons: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  actionButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: 8, gap: 6 },
  confirmButton: { backgroundColor: "#10B981" },
  confirmButtonText: { fontSize: 14, fontWeight: "600", color: "#FFFFFF" },
  cancelButton: { backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "#E5E7EB" },
  cancelButtonText: { fontSize: 14, fontWeight: "600", color: "#EF4444" },
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 64 },
  emptyTitle: { fontSize: 20, fontWeight: "bold", color: "#111827", marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 16, color: "#6B7280", textAlign: "center", marginBottom: 24 },
  scheduleButton: { marginTop: 8 },
  scheduleButtonGradient: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, gap: 8 },
  scheduleButtonText: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
});

export default function MySessionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  
  const {
    pendingSessions,
    confirmedSessions,
    upcomingSessions,
    isPendingLoading,
    isConfirmedLoading,
    isUpcomingLoading,
    pendingError,
    confirmedError,
    upcomingError,
    refetch,
    confirmSession,
    cancelSession,
  } = useScheduledSessions();

  const handleDebugMatching = async () => {
    console.log("🔍 DEBUG: Checking session matching...");
    const result = await debugSessionMatching();
    if (result.data) {
      Alert.alert(
        "Debug Info",
        `Found ${result.data.allPending?.length || 0} pending sessions. Check console for detailed info.`
      );
    } else {
      Alert.alert("Debug Error", result.error || "Failed to get debug info");
    }
  };

  const handleManualMatchRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      const result = await refreshAndFindMatches();
      if (result.data) {
        const { matchedCount } = result.data;
        if (matchedCount > 0) {
          Alert.alert(
            "New Matches Found! 🎉",
            `Found ${matchedCount} new match${matchedCount > 1 ? 'es' : ''} for your pending sessions!`,
            [{ text: "Great!" }]
          );
          await refetch(); // Refresh the sessions data
        } else {
          Alert.alert(
            "No New Matches",
            "No new compatible sessions found. Keep your sessions active and try again later!"
          );
        }
      } else {
        Alert.alert("Error", result.error || "Failed to refresh matches");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to refresh matches");
    } finally {
      setIsManualRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderSessionCard = (session: any, showActions = false) => {
    // Get current user ID to determine which profile to show as partner
    const partnerProfile = session.partner_profile; // Always show partner_profile when available
    
    return (
      <View key={session.id} style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <View style={styles.topicInfo}>
            <Text style={styles.topicIcon}>{session.topics?.icon || "📚"}</Text>
            <View style={styles.topicDetails}>
              <Text style={styles.topicName}>{session.topics?.name || "Unknown Topic"}</Text>
              <Text style={styles.sessionTime}>
                {formatDate(session.scheduled_for)} • {formatTime(session.scheduled_for)}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, 
            session.status === "confirmed" ? styles.confirmedBadge :
            session.status === "pending" ? styles.pendingBadge :
            session.status === "matched" ? styles.matchedBadge : styles.defaultBadge
          ]}>
            <Text style={styles.statusText}>
              {session.status === "confirmed" ? "Confirmed" : 
               session.status === "pending" ? "Pending" :
               session.status === "matched" ? "Matched" : session.status}
            </Text>
          </View>
        </View>

        {session.partner_id && partnerProfile?.display_name && (
          <View style={styles.partnerInfo}>
            <MaterialCommunityIcons name="account" size={16} color="#6B7280" />
            <Text style={styles.partnerName}>
              {session.status === 'matched' ? 'Matched with: ' : 'Partner: '}{partnerProfile.display_name}
            </Text>
          </View>
        )}

      {showActions && session.status === "matched" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => confirmSession(session.id)}
          >
            <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
            <Text style={styles.confirmButtonText}>Accept Match</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => cancelSession(session.id)}
          >
            <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
            <Text style={styles.cancelButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}

      {showActions && session.status === "pending" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => confirmSession(session.id)}
          >
            <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => cancelSession(session.id)}
          >
            <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <LinearGradient
        colors={["#9333EA", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>My Sessions</Text>
            <Text style={styles.headerSubtitle}>Upcoming & Pending Sessions</Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleDebugMatching}
              style={styles.debugButton}
            >
              <MaterialCommunityIcons name="bug" size={18} color="#FF6B35" />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleManualMatchRefresh}
              style={[styles.refreshButton, isManualRefreshing && styles.refreshButtonDisabled]}
              disabled={isManualRefreshing}
            >
              <MaterialCommunityIcons 
                name="refresh" 
                size={20} 
                color={isManualRefreshing ? "rgba(255,255,255,0.5)" : "#FFFFFF"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => router.push("/(app)/schedule")}
              style={styles.addButton}
            >
              <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isPendingLoading || isConfirmedLoading || isUpcomingLoading}
            onRefresh={handleRefresh}
            colors={["#9333EA"]}
            tintColor="#9333EA"
          />
        }
      >
        {(pendingError || confirmedError || upcomingError) && (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle" size={20} color="#EF4444" />
            <Text style={styles.errorText}>
              {pendingError || confirmedError || upcomingError}
            </Text>
          </View>
        )}

        {/* Matched Sessions (waiting for acceptance) */}
        {upcomingSessions.filter(session => session.status === 'matched').length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Matched Sessions ({upcomingSessions.filter(session => session.status === 'matched').length})
            </Text>
            <Text style={styles.sectionSubtitle}>
              Sessions matched with other users - accept or decline
            </Text>
            {upcomingSessions
              .filter(session => session.status === 'matched')
              .map((session) => renderSessionCard(session, true))}
          </View>
        )}

        {/* Pending Sessions */}
        {pendingSessions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Pending Sessions ({pendingSessions.length})
            </Text>
            <Text style={styles.sectionSubtitle}>
              Sessions waiting for confirmation
            </Text>
            {pendingSessions.map((session) => renderSessionCard(session, true))}
          </View>
        )}

        {/* Confirmed Sessions */}
        {confirmedSessions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Confirmed Sessions ({confirmedSessions.length})
            </Text>
            <Text style={styles.sectionSubtitle}>
              Ready to go sessions
            </Text>
            {confirmedSessions.map((session) => renderSessionCard(session))}
          </View>
        )}

        {/* Upcoming Sessions (all) */}
        {upcomingSessions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              All Upcoming ({upcomingSessions.length})
            </Text>
            <Text style={styles.sectionSubtitle}>
              All sessions in chronological order
            </Text>
            {upcomingSessions.map((session) => renderSessionCard(session))}
          </View>
        )}

        {/* Empty State */}
        {!isPendingLoading && !isConfirmedLoading && !isUpcomingLoading && 
         pendingSessions.length === 0 && confirmedSessions.length === 0 && upcomingSessions.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="calendar-blank" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Upcoming Sessions</Text>
            <Text style={styles.emptySubtitle}>
              Schedule your first session to get started
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(app)/schedule")}
              style={styles.scheduleButton}
            >
              <LinearGradient
                colors={["#9333EA", "#2563EB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.scheduleButtonGradient}
              >
                <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
                <Text style={styles.scheduleButtonText}>Schedule Session</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}