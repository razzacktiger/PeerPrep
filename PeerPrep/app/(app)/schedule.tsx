/**
 * Schedule Screen
 * Schedule future practice sessions
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import {
  Text,
  Card,
  Button,
  TextInput,
  Chip,
  Menu,
  Portal,
  Dialog,
} from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TOPICS } from '../../lib/constants';
import * as matchmakingApi from '../../lib/api/matchmaking';

export default function ScheduleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [selectedTopic, setSelectedTopic] = useState(params.topicId as string || TOPICS[0].id);
  const [selectedDifficulty, setSelectedDifficulty] = useState(params.difficulty as string || 'Medium');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTopicMenu, setShowTopicMenu] = useState(false);
  const [showDifficultyMenu, setShowDifficultyMenu] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const topic = TOPICS.find((t) => t.id === selectedTopic) || TOPICS[0];

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      setSelectedTime(time);
    }
  };

  const handleSchedule = async () => {
    setIsSubmitting(true);

    // Combine date and time
    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(selectedTime.getHours());
    scheduledDateTime.setMinutes(selectedTime.getMinutes());

    const result = await matchmakingApi.scheduleSession(selectedTopic, scheduledDateTime);

    setIsSubmitting(false);

    if (result.data?.success) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmOk = () => {
    setShowConfirmDialog(false);
    router.back();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Schedule a Session
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Plan ahead and practice at your convenience
            </Text>
          </Card.Content>
        </Card>

        {/* Topic Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.fieldLabel}>
              Topic
            </Text>
            <Menu
              visible={showTopicMenu}
              onDismiss={() => setShowTopicMenu(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setShowTopicMenu(true)}
                  style={styles.selectButton}
                >
                  {topic.icon} {topic.name}
                </Button>
              }
            >
              {TOPICS.map((t) => (
                <Menu.Item
                  key={t.id}
                  onPress={() => {
                    setSelectedTopic(t.id);
                    setShowTopicMenu(false);
                  }}
                  title={`${t.icon} ${t.name}`}
                />
              ))}
            </Menu>
          </Card.Content>
        </Card>

        {/* Difficulty Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.fieldLabel}>
              Difficulty
            </Text>
            <Menu
              visible={showDifficultyMenu}
              onDismiss={() => setShowDifficultyMenu(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setShowDifficultyMenu(true)}
                  style={styles.selectButton}
                >
                  {selectedDifficulty}
                </Button>
              }
            >
              {topic.difficulty_levels.map((level) => (
                <Menu.Item
                  key={level}
                  onPress={() => {
                    setSelectedDifficulty(level);
                    setShowDifficultyMenu(false);
                  }}
                  title={level}
                />
              ))}
            </Menu>
          </Card.Content>
        </Card>

        {/* Date Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.fieldLabel}>
              Date
            </Text>
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.selectButton}
              icon="calendar"
            >
              {formatDate(selectedDate)}
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </Card.Content>
        </Card>

        {/* Time Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.fieldLabel}>
              Time
            </Text>
            <Button
              mode="outlined"
              onPress={() => setShowTimePicker(true)}
              style={styles.selectButton}
              icon="clock"
            >
              {formatTime(selectedTime)}
            </Button>
            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </Card.Content>
        </Card>

        {/* Summary */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.summaryTitle}>
              Summary
            </Text>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium" style={styles.summaryLabel}>Topic:</Text>
              <Chip mode="outlined">{topic.icon} {topic.name}</Chip>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium" style={styles.summaryLabel}>Difficulty:</Text>
              <Chip mode="outlined">{selectedDifficulty}</Chip>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium" style={styles.summaryLabel}>When:</Text>
              <Text variant="bodyMedium">
                {formatDate(selectedDate)} at {formatTime(selectedTime)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Schedule Button */}
        <Button
          mode="contained"
          onPress={handleSchedule}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.scheduleButton}
          icon="calendar-check"
        >
          Schedule Session
        </Button>
      </View>

      {/* Confirmation Dialog */}
      <Portal>
        <Dialog visible={showConfirmDialog} onDismiss={handleConfirmOk}>
          <Dialog.Icon icon="check-circle" size={64} color="#4caf50" />
          <Dialog.Title style={styles.dialogTitle}>Session Scheduled!</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.dialogText}>
              Your session has been scheduled successfully. We'll notify you when a partner joins.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleConfirmOk}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  card: {
    backgroundColor: 'white',
    marginBottom: 12,
  },
  fieldLabel: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  selectButton: {
    justifyContent: 'flex-start',
  },
  summaryCard: {
    backgroundColor: '#e3f2fd',
    marginBottom: 24,
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontWeight: '600',
  },
  scheduleButton: {
    paddingVertical: 8,
  },
  dialogTitle: {
    textAlign: 'center',
  },
  dialogText: {
    textAlign: 'center',
  },
});

