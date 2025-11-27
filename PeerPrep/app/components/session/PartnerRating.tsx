import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../styles/session/PartnerRatingStyles";

interface PartnerRatingProps {
  partnerName: string;
  partnerAvatar?: string;
  rating: number;
  hoveredRating: number;
  selectedTags: string[];
  feedback: string;
  onRatingChange: (rating: number) => void;
  onHoverChange: (rating: number) => void;
  onTagToggle: (tagId: string) => void;
  onFeedbackChange: (text: string) => void;
}

const tags = [
  { id: "helpful", label: "Helpful", icon: "thumb-up" },
  { id: "communicative", label: "Communicative", icon: "message-text" },
  { id: "knowledgeable", label: "Knowledgeable", icon: "brain" },
  { id: "collaborative", label: "Collaborative", icon: "account-group" },
];

const getRatingMessage = (rating: number) => {
  if (rating === 5) return { text: "Excellent! 🌟", emoji: "🌟" };
  if (rating === 4) return { text: "Great! 👍", emoji: "👍" };
  if (rating === 3) return { text: "Good 👌", emoji: "👌" };
  if (rating === 2) return { text: "Could be better 🤔", emoji: "🤔" };
  if (rating === 1) return { text: "Needs improvement 😕", emoji: "😕" };
  return null;
};

export default function PartnerRating({
  partnerName,
  partnerAvatar,
  rating,
  hoveredRating,
  selectedTags,
  feedback,
  onRatingChange,
  onHoverChange,
  onTagToggle,
  onFeedbackChange,
}: PartnerRatingProps) {
  const ratingMessage = getRatingMessage(rating);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Your Partner</Text>

      {/* Partner Info */}
      <View style={styles.partnerInfo}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="account-circle" size={56} color="#6366F1" />
        </View>
        <View style={styles.partnerDetails}>
          <Text style={styles.partnerName}>{partnerName}</Text>
          <Text style={styles.partnerQuestion}>How was your experience?</Text>
        </View>
      </View>

      {/* Star Rating */}
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onRatingChange(star)}
            onPressIn={() => onHoverChange(star)}
            onPressOut={() => onHoverChange(0)}
            activeOpacity={0.7}
            style={styles.starButton}
          >
            <MaterialCommunityIcons
              name={star <= (hoveredRating || rating) ? "star" : "star-outline"}
              size={48}
              color={star <= (hoveredRating || rating) ? "#FBBF24" : "#D1D5DB"}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Rating Message */}
      {ratingMessage && (
        <LinearGradient
          colors={["#DBEAFE", "#E9D5FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.ratingMessage}
        >
          <Text style={styles.ratingMessageText}>{ratingMessage.text}</Text>
        </LinearGradient>
      )}

      {/* Tags */}
      <View style={styles.tagsSection}>
        <Text style={styles.tagsLabel}>What stood out?</Text>
        <View style={styles.tagsContainer}>
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <TouchableOpacity
                key={tag.id}
                onPress={() => onTagToggle(tag.id)}
                activeOpacity={0.7}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={["#2563EB", "#4F46E5"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.tagSelected}
                  >
                    <MaterialCommunityIcons name={tag.icon as any} size={14} color="#FFFFFF" />
                    <Text style={styles.tagSelectedText}>{tag.label}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.tagUnselected}>
                    <MaterialCommunityIcons name={tag.icon as any} size={14} color="#6B7280" />
                    <Text style={styles.tagUnselectedText}>{tag.label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Written Feedback */}
      <View style={styles.feedbackSection}>
        <Text style={styles.feedbackLabel}>Additional comments (Optional)</Text>
        <View style={styles.textInputContainer}>
          <TextInput
            value={feedback}
            onChangeText={onFeedbackChange}
            placeholder="Share more details about your experience..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            style={styles.textInput}
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );
}
