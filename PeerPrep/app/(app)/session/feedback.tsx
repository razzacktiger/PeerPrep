import React, { useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSessionStore } from "../../../stores/sessionStore";
import {
  useFeedbackSubmission,
  useHasSubmittedFeedback,
} from "../../../lib/hooks";
import FeedbackHeader from "../../components/session/FeedbackHeader";
import PartnerRating from "../../components/session/PartnerRating";
import SelfAssessment from "../../components/session/SelfAssessment";
import styles from "../../styles/feedbackStyles";

export default function FeedbackScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const currentSession = useSessionStore((state) => state.currentSession);
  const setCurrentSession = useSessionStore((state) => state.setCurrentSession);

  // Get partner info
  const partnerId = currentSession?.partner_id;
  const sessionId = currentSession?.id;

  // Initialize hooks
  const {
    clarity,
    setClarity,
    correctness,
    setCorrectness,
    confidence,
    setConfidence,
    comments,
    setComments,
    selectedTags,
    toggleTag,
    isSubmitting,
    error,
    success,
    submitFeedback,
  } = useFeedbackSubmission(sessionId || "", partnerId || "");

  const { hasSubmitted, isLoading: checkingSubmission } =
    useHasSubmittedFeedback(sessionId || "");

  // Redirect to home on successful submission
  useEffect(() => {
    if (success) {
      console.log("🎉 Success! Redirecting to home in 1.5s...");
      setTimeout(() => {
        console.log("🏠 Navigating to home...");
        // Clear session before navigating
        setCurrentSession(null);
        router.push("/(app)/home");
      }, 1500);
    }
  }, [success, router, setCurrentSession]);

  const partner = {
    name: currentSession?.partner_name || "Partner",
    avatar: currentSession?.partner_avatar || null,
  };

  const handleSubmit = async () => {
    if (clarity === 0) {
      alert("Please rate your partner's clarity");
      return;
    }
    if (correctness === 0) {
      alert("Please rate your own correctness");
      return;
    }
    if (confidence === 0) {
      alert("Please rate your confidence");
      return;
    }

    console.log("📤 Submitting feedback...");
    await submitFeedback();
    console.log("✅ Submit handler complete");
  };

  const handleSkip = () => {
    console.log("⏭️ Skip pressed, navigating to home...");
    // Clear session before navigating
    setCurrentSession(null);
    router.push("/(app)/home");
  };

  if (!currentSession) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall">No session data</Text>
        <Button mode="contained" onPress={() => router.push("/(app)/home")}>
          Go Home
        </Button>
      </View>
    );
  }

  if (checkingSubmission) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall">Loading...</Text>
      </View>
    );
  }

  if (hasSubmitted) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall">Thanks for your feedback!</Text>
        <Text variant="bodyMedium" style={{ marginTop: 8, marginBottom: 24 }}>
          You've already submitted feedback for this session.
        </Text>
        <Button mode="contained" onPress={() => router.push("/(app)/home")}>
          Go Home
        </Button>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
    >
      <FeedbackHeader />

      {/* Error Message */}
      {error && (
        <View
          style={{
            backgroundColor: "#FEE2E2",
            borderRadius: 8,
            padding: 12,
            marginHorizontal: 16,
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: "#DC2626",
          }}
        >
          <Text style={{ color: "#991B1B", fontSize: 14 }}>{error}</Text>
        </View>
      )}

      {/* Success Message */}
      {success && (
        <View
          style={{
            backgroundColor: "#DCFCE7",
            borderRadius: 8,
            padding: 12,
            marginHorizontal: 16,
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: "#16A34A",
          }}
        >
          <Text style={{ color: "#15803D", fontSize: 14 }}>
            Feedback submitted! 🎉 Redirecting home...
          </Text>
        </View>
      )}

      {/* Rate Partner - Clarity */}
      <PartnerRating
        partnerName={partner.name}
        partnerAvatar={partner.avatar}
        rating={clarity}
        hoveredRating={0}
        selectedTags={selectedTags}
        feedback={comments}
        onRatingChange={setClarity}
        onHoverChange={() => {}}
        onTagToggle={toggleTag}
        onFeedbackChange={setComments}
      />

      {/* Self Assessment - Correctness & Confidence */}
      <SelfAssessment rating={correctness} onRatingChange={setCorrectness} />

      {/* Confidence Rating */}
      <View
        style={{
          marginHorizontal: 16,
          marginBottom: 24,
          padding: 16,
          backgroundColor: "#F3F4F6",
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 16,
            color: "#1F2937",
          }}
        >
          How confident were you during the session?
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            gap: 8,
          }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setConfidence(star)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: confidence === star ? "#2563EB" : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  color: confidence === star ? "#FFFFFF" : "#6B7280",
                  fontWeight: "600",
                }}
              >
                {star}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Submit Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipButton}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={
            isSubmitting ||
            clarity === 0 ||
            correctness === 0 ||
            confidence === 0
          }
          activeOpacity={0.7}
          style={[
            styles.submitButtonWrapper,
            (isSubmitting ||
              clarity === 0 ||
              correctness === 0 ||
              confidence === 0) &&
              styles.buttonDisabled,
          ]}
        >
          <LinearGradient
            colors={["#2563EB", "#4F46E5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
