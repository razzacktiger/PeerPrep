/**
 * Session Feedback Screen
 * Peer feedback rubric and AI cross-check
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  Button,
  TextInput,
  Divider,
  ProgressBar,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Slider from '@react-native-community/slider';
import { useSessionStore } from '../../../stores/sessionStore';
import * as sessionsApi from '../../../lib/api/sessions';

export default function FeedbackScreen() {
  const router = useRouter();
  const currentSession = useSessionStore((state) => state.currentSession);
  
  const [clarity, setClarity] = useState(3);
  const [correctness, setCorrectness] = useState(3);
  const [confidence, setConfidence] = useState(3);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch AI feedback
  const { data: aiFeedback, isLoading: isLoadingAI } = useQuery({
    queryKey: ['aiFeedback', currentSession?.id],
    queryFn: () => sessionsApi.getAIFeedback(currentSession?.id || ''),
    enabled: !!currentSession?.id,
  });

  const handleSubmit = async () => {
    if (!currentSession) return;

    setIsSubmitting(true);

    const feedback = {
      clarity,
      correctness,
      confidence,
      comments,
    };

    await sessionsApi.submitFeedback(currentSession.id, feedback);

    setIsSubmitting(false);
    
    // Navigate to dashboard
    router.replace('/(app)/dashboard');
  };

  const getRatingLabel = (value: number) => {
    if (value === 1) return 'Poor';
    if (value === 2) return 'Fair';
    if (value === 3) return 'Good';
    if (value === 4) return 'Very Good';
    return 'Excellent';
  };

  const getRatingColor = (value: number) => {
    if (value <= 2) return '#f44336';
    if (value === 3) return '#ff9800';
    return '#4caf50';
  };

  if (!currentSession) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall">No session data</Text>
        <Button mode="contained" onPress={() => router.replace('/(app)/home')}>
          Go Home
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>
            Session Feedback
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Rate your partner: {currentSession.partner_name}
          </Text>
        </Card.Content>
      </Card>

      {/* Peer Feedback Rubric */}
      <Card style={styles.rubricCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Peer Feedback
          </Text>
          <Text variant="bodySmall" style={styles.sectionSubtitle}>
            Rate your partner on a scale of 1-5
          </Text>

          <Divider style={styles.divider} />

          {/* Clarity */}
          <View style={styles.criteriaContainer}>
            <View style={styles.criteriaHeader}>
              <Text variant="titleMedium">💬 Clarity</Text>
              <Text
                variant="titleMedium"
                style={[styles.ratingValue, { color: getRatingColor(clarity) }]}
              >
                {clarity} - {getRatingLabel(clarity)}
              </Text>
            </View>
            <Text variant="bodySmall" style={styles.criteriaDescription}>
              How clearly did your partner communicate their thoughts?
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={clarity}
              onValueChange={setClarity}
              minimumTrackTintColor="#6200ee"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#6200ee"
            />
          </View>

          <Divider style={styles.divider} />

          {/* Correctness */}
          <View style={styles.criteriaContainer}>
            <View style={styles.criteriaHeader}>
              <Text variant="titleMedium">✓ Correctness</Text>
              <Text
                variant="titleMedium"
                style={[styles.ratingValue, { color: getRatingColor(correctness) }]}
              >
                {correctness} - {getRatingLabel(correctness)}
              </Text>
            </View>
            <Text variant="bodySmall" style={styles.criteriaDescription}>
              How accurate was your partner's approach and solution?
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={correctness}
              onValueChange={setCorrectness}
              minimumTrackTintColor="#6200ee"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#6200ee"
            />
          </View>

          <Divider style={styles.divider} />

          {/* Confidence */}
          <View style={styles.criteriaContainer}>
            <View style={styles.criteriaHeader}>
              <Text variant="titleMedium">💪 Confidence</Text>
              <Text
                variant="titleMedium"
                style={[styles.ratingValue, { color: getRatingColor(confidence) }]}
              >
                {confidence} - {getRatingLabel(confidence)}
              </Text>
            </View>
            <Text variant="bodySmall" style={styles.criteriaDescription}>
              How confident and prepared did your partner seem?
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={confidence}
              onValueChange={setConfidence}
              minimumTrackTintColor="#6200ee"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#6200ee"
            />
          </View>

          <Divider style={styles.divider} />

          {/* Comments */}
          <View style={styles.commentsContainer}>
            <Text variant="titleMedium" style={styles.commentsTitle}>
              Additional Comments (Optional)
            </Text>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={4}
              value={comments}
              onChangeText={setComments}
              placeholder="Share any specific feedback or observations..."
              style={styles.commentsInput}
            />
          </View>
        </Card.Content>
      </Card>

      {/* AI Cross-Check */}
      <Card style={styles.aiCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            🤖 AI Cross-Check
          </Text>
          <Text variant="bodySmall" style={styles.sectionSubtitle}>
            Automated analysis for fairness
          </Text>

          <Divider style={styles.divider} />

          {isLoadingAI ? (
            <View style={styles.loadingContainer}>
              <ProgressBar indeterminate color="#6200ee" />
              <Text variant="bodyMedium" style={styles.loadingText}>
                Analyzing session...
              </Text>
            </View>
          ) : aiFeedback?.data ? (
            <>
              <View style={styles.fairnessScore}>
                <Text variant="headlineLarge" style={styles.scoreValue}>
                  {aiFeedback.data.fairness_score}/10
                </Text>
                <Text variant="bodyMedium" style={styles.scoreLabel}>
                  Fairness Score
                </Text>
              </View>

              <View style={styles.aiSummary}>
                <Text variant="titleSmall" style={styles.aiLabel}>
                  Summary:
                </Text>
                <Text variant="bodyMedium" style={styles.aiText}>
                  {aiFeedback.data.summary}
                </Text>
              </View>

              {aiFeedback.data.strengths.length > 0 && (
                <View style={styles.aiSection}>
                  <Text variant="titleSmall" style={styles.aiLabel}>
                    ✅ Strengths:
                  </Text>
                  {aiFeedback.data.strengths.map((strength, index) => (
                    <Text key={index} variant="bodySmall" style={styles.aiListItem}>
                      • {strength}
                    </Text>
                  ))}
                </View>
              )}

              {aiFeedback.data.improvements.length > 0 && (
                <View style={styles.aiSection}>
                  <Text variant="titleSmall" style={styles.aiLabel}>
                    💡 Improvements:
                  </Text>
                  {aiFeedback.data.improvements.map((improvement, index) => (
                    <Text key={index} variant="bodySmall" style={styles.aiListItem}>
                      • {improvement}
                    </Text>
                  ))}
                </View>
              )}
            </>
          ) : (
            <Text variant="bodyMedium" style={styles.aiError}>
              AI feedback not available
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Submit Button */}
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={styles.submitButton}
      >
        Submit Feedback
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  headerCard: {
    backgroundColor: 'white',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
  },
  rubricCard: {
    backgroundColor: 'white',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#666',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  criteriaContainer: {
    marginBottom: 8,
  },
  criteriaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingValue: {
    fontWeight: 'bold',
  },
  criteriaDescription: {
    color: '#666',
    marginBottom: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  commentsContainer: {
    marginTop: 8,
  },
  commentsTitle: {
    marginBottom: 12,
  },
  commentsInput: {
    marginBottom: 0,
  },
  aiCard: {
    backgroundColor: '#e3f2fd',
    marginBottom: 24,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  fairnessScore: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  scoreValue: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  scoreLabel: {
    color: '#666',
    marginTop: 4,
  },
  aiSummary: {
    marginBottom: 16,
  },
  aiSection: {
    marginBottom: 16,
  },
  aiLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  aiText: {
    color: '#1976d2',
  },
  aiListItem: {
    color: '#1976d2',
    marginBottom: 4,
    marginLeft: 8,
  },
  aiError: {
    color: '#666',
    textAlign: 'center',
    paddingVertical: 16,
  },
  submitButton: {
    paddingVertical: 8,
  },
});

