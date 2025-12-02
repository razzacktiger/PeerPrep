import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getSessionDetails, SessionDetailsData } from "../../../lib/api/sessionDetails";
import { useAuthStore } from "../../../stores/authStore";
import styles from "../../styles/home/SessionDetailModalStyles";

interface SessionDetailModalProps {
  visible: boolean;
  sessionId: string | null;
  onClose: () => void;
}

export default function SessionDetailModal({
  visible,
  sessionId,
  onClose,
}: SessionDetailModalProps) {
  const user = useAuthStore((state) => state.user);
  const [session, setSession] = useState<SessionDetailsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && sessionId && user?.id) {
      fetchSessionDetails();
    }
  }, [visible, sessionId, user?.id]);

  const fetchSessionDetails = async () => {
    if (!sessionId || !user?.id) return;
    
    setLoading(true);
    try {
      const data = await getSessionDetails(sessionId, user.id);
      setSession(data);
    } catch (error) {
      console.error('Error loading session details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Text key={i} style={i < rating ? styles.starFilled : styles.starEmpty}>
        ★
      </Text>
    ));
  };

  const getDifficultyColor = (difficulty: string): readonly [string, string] => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return ["#10B981", "#059669"] as const;
      case "medium":
        return ["#F59E0B", "#D97706"] as const;
      case "hard":
        return ["#EF4444", "#DC2626"] as const;
      default:
        return ["#6B7280", "#4B5563"] as const;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View 
        style={styles.overlay} 
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Session Details</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close session details"
            >
              <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366F1" />
              <Text style={styles.loadingText}>Loading session details...</Text>
            </View>
          ) : !session ? (
            <View style={styles.loadingContainer}>
              <MaterialCommunityIcons name="alert-circle" size={48} color="#EF4444" />
              <Text style={styles.errorText}>Failed to load session details</Text>
            </View>
          ) : (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Topic Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <LinearGradient
                  colors={["#3B82F6", "#2563EB"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.topicIconContainer}
                >
                  <MaterialCommunityIcons name="book-open" size={28} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.cardHeaderInfo}>
                  <Text style={styles.cardTitle}>{session.topic}</Text>
                  <LinearGradient
                    colors={getDifficultyColor(session.difficulty)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.difficultyBadge}
                  >
                    <Text style={styles.difficultyText}>{session.difficulty}</Text>
                  </LinearGradient>
                </View>
              </View>
            </View>

            {/* Partner Info */}
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <MaterialCommunityIcons name="account" size={20} color="#6366F1" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Partner</Text>
                  <Text style={styles.infoValue}>{session.partner}</Text>
                </View>
              </View>
            </View>

            {/* Session Stats */}
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="#6366F1" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Duration</Text>
                  <Text style={styles.infoValue}>{session.duration}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <MaterialCommunityIcons name="calendar" size={20} color="#6366F1" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Date</Text>
                  <Text style={styles.infoValue}>{session.date}</Text>
                </View>
              </View>
            </View>

            {/* Rating */}
            <View style={styles.card}>
              <View style={styles.ratingSection}>
                <Text style={styles.ratingLabel}>Your Rating</Text>
                <View style={styles.starsContainer}>
                  {renderStars(session.rating)}
                </View>
                <Text style={styles.ratingValue}>{session.rating} out of 5</Text>
              </View>
            </View>

            {/* Shared Notes and Code */}
            <View style={styles.card}>
              <View style={styles.feedbackHeader}>
                <MaterialCommunityIcons name="note-text" size={20} color="#F59E0B" />
                <Text style={styles.feedbackTitle}>Session Notes & Code</Text>
              </View>

              {session.notes?.shared_notes ? (
                <View style={styles.notesSection}>
                  <Text style={styles.notesLabel}>Shared Notes</Text>
                  <View style={styles.notesBox}>
                    <Text style={styles.notesText}>{session.notes.shared_notes}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.emptySection}>
                  <MaterialCommunityIcons name="note-off" size={32} color="#D1D5DB" />
                  <Text style={styles.emptyText}>No shared notes for this session</Text>
                </View>
              )}

              {session.notes?.code ? (
                <View style={[styles.notesSection, (session.notes.shared_notes || !session.notes?.shared_notes) && { marginTop: 16 }]}>
                  <View style={styles.codeHeader}>
                    <Text style={styles.notesLabel}>Code Snippet</Text>
                    <View style={styles.languageBadge}>
                      <Text style={styles.languageText}>{session.notes.language || 'javascript'}</Text>
                    </View>
                  </View>
                  <View style={styles.codeBox}>
                    <Text style={styles.codeText}>{session.notes.code}</Text>
                  </View>
                </View>
              ) : !session.notes?.shared_notes && (
                <View style={[styles.emptySection, { marginTop: 16 }]}>
                  <MaterialCommunityIcons name="code-tags" size={32} color="#D1D5DB" />
                  <Text style={styles.emptyText}>No code shared in this session</Text>
                </View>
              )}
            </View>

            {/* Feedback Received */}
            {session.feedback_received && (
              <View style={styles.card}>
                <View style={styles.feedbackHeader}>
                  <MaterialCommunityIcons name="comment-account" size={20} color="#6366F1" />
                  <Text style={styles.feedbackTitle}>Feedback from {session.feedback_received.from_user}</Text>
                </View>
                
                <View style={styles.feedbackScores}>
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>Clarity</Text>
                    <View style={styles.scoreBar}>
                      <View style={[styles.scoreBarFill, { width: `${(session.feedback_received.clarity / 5) * 100}%` }]} />
                    </View>
                    <Text style={styles.scoreValue}>{session.feedback_received.clarity}/5</Text>
                  </View>
                  
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>Correctness</Text>
                    <View style={styles.scoreBar}>
                      <View style={[styles.scoreBarFill, { width: `${(session.feedback_received.correctness / 5) * 100}%` }]} />
                    </View>
                    <Text style={styles.scoreValue}>{session.feedback_received.correctness}/5</Text>
                  </View>
                  
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>Confidence</Text>
                    <View style={styles.scoreBar}>
                      <View style={[styles.scoreBarFill, { width: `${(session.feedback_received.confidence / 5) * 100}%` }]} />
                    </View>
                    <Text style={styles.scoreValue}>{session.feedback_received.confidence}/5</Text>
                  </View>
                </View>

                {session.feedback_received.comments && (
                  <View style={styles.commentsSection}>
                    <Text style={styles.commentsLabel}>Comments</Text>
                    <Text style={styles.commentsText}>{session.feedback_received.comments}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Feedback Given */}
            {session.feedback_given && (
              <View style={styles.card}>
                <View style={styles.feedbackHeader}>
                  <MaterialCommunityIcons name="comment-edit" size={20} color="#10B981" />
                  <Text style={styles.feedbackTitle}>Your Feedback to {session.feedback_given.from_user}</Text>
                </View>
                
                <View style={styles.feedbackScores}>
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>Clarity</Text>
                    <View style={styles.scoreBar}>
                      <View style={[styles.scoreBarFill, { width: `${(session.feedback_given.clarity / 5) * 100}%` }]} />
                    </View>
                    <Text style={styles.scoreValue}>{session.feedback_given.clarity}/5</Text>
                  </View>
                  
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>Correctness</Text>
                    <View style={styles.scoreBar}>
                      <View style={[styles.scoreBarFill, { width: `${(session.feedback_given.correctness / 5) * 100}%` }]} />
                    </View>
                    <Text style={styles.scoreValue}>{session.feedback_given.correctness}/5</Text>
                  </View>
                  
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>Confidence</Text>
                    <View style={styles.scoreBar}>
                      <View style={[styles.scoreBarFill, { width: `${(session.feedback_given.confidence / 5) * 100}%` }]} />
                    </View>
                    <Text style={styles.scoreValue}>{session.feedback_given.confidence}/5</Text>
                  </View>
                </View>

                {session.feedback_given.comments && (
                  <View style={styles.commentsSection}>
                    <Text style={styles.commentsLabel}>Your Comments</Text>
                    <Text style={styles.commentsText}>{session.feedback_given.comments}</Text>
                  </View>
                )}
              </View>
            )}

            {/* AI Feedback */}
            {session.ai_feedback && (
              <View style={styles.card}>
                <View style={styles.feedbackHeader}>
                  <MaterialCommunityIcons name="robot" size={20} color="#8B5CF6" />
                  <Text style={styles.feedbackTitle}>AI Analysis</Text>
                </View>

                {session.ai_feedback.fairness_score && (
                  <View style={styles.aiScoreContainer}>
                    <Text style={styles.aiScoreLabel}>Fairness Score</Text>
                    <Text style={styles.aiScoreValue}>{session.ai_feedback.fairness_score.toFixed(1)}/10</Text>
                  </View>
                )}

                {session.ai_feedback.summary && (
                  <View style={styles.aiSection}>
                    <Text style={styles.aiSectionLabel}>Summary</Text>
                    <Text style={styles.aiSectionText}>{session.ai_feedback.summary}</Text>
                  </View>
                )}

                {session.ai_feedback.strengths.length > 0 && (
                  <View style={styles.aiSection}>
                    <Text style={styles.aiSectionLabel}>Strengths</Text>
                    {session.ai_feedback.strengths.map((strength, index) => (
                      <View key={index} style={styles.aiListItem}>
                        <Text style={styles.aiListBullet}>✓</Text>
                        <Text style={styles.aiListText}>{strength}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {session.ai_feedback.improvements.length > 0 && (
                  <View style={styles.aiSection}>
                    <Text style={styles.aiSectionLabel}>Areas for Improvement</Text>
                    {session.ai_feedback.improvements.map((improvement, index) => (
                      <View key={index} style={styles.aiListItem}>
                        <Text style={styles.aiListBullet}>→</Text>
                        <Text style={styles.aiListText}>{improvement}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Session ID (for reference) */}
            <View style={styles.sessionIdContainer}>
              <Text style={styles.sessionIdLabel}>Session ID</Text>
              <Text style={styles.sessionIdValue}>{session.id}</Text>
            </View>
          </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
