import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSessionStore } from "../../../stores/sessionStore";
import FeedbackHeader from "../../components/session/FeedbackHeader";
import PartnerRating from "../../components/session/PartnerRating";
import SelfAssessment from "../../components/session/SelfAssessment";
import styles from "../../styles/feedbackStyles";

export default function FeedbackScreen() {
  const router = useRouter();
  const currentSession = useSessionStore((state) => state.currentSession);

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selfAssessment, setSelfAssessment] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const partner = {
    name: currentSession?.partner_name || "Partner",
    avatar: currentSession?.partner_avatar,
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please provide a rating");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      router.replace("/(app)/home");
    }, 1000);
  };

  const handleSkip = () => {
    router.replace("/(app)/home");
  };

  if (!currentSession) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall">No session data</Text>
        <Button mode="contained" onPress={() => router.replace("/(app)/home")}>
          Go Home
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <FeedbackHeader />

      <PartnerRating
        partnerName={partner.name}
        partnerAvatar={partner.avatar}
        rating={rating}
        hoveredRating={hoveredRating}
        selectedTags={selectedTags}
        feedback={feedback}
        onRatingChange={setRating}
        onHoverChange={setHoveredRating}
        onTagToggle={toggleTag}
        onFeedbackChange={setFeedback}
      />

      <SelfAssessment rating={selfAssessment} onRatingChange={setSelfAssessment} />

      {/* Submit Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton} activeOpacity={0.7}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting || rating === 0}
          activeOpacity={0.7}
          style={[styles.submitButtonWrapper, (isSubmitting || rating === 0) && styles.buttonDisabled]}
        >
          <LinearGradient
            colors={["#2563EB", "#4F46E5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
