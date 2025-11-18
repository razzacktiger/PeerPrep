/**
 * Topics Screen
 * Browse and select practice topics
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import {
  Text,
  Card,
  Chip,
  Button,
  Searchbar,
  FAB,
  Portal,
  Modal,
  RadioButton,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { TOPICS } from '../../lib/constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TopicsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Medium');
  const [showModal, setShowModal] = useState(false);

  // Filter topics based on search
  const filteredTopics = TOPICS.filter((topic) =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTopicPress = (topicId: string) => {
    setSelectedTopic(topicId);
    setShowModal(true);
  };

  const handlePracticeNow = () => {
    if (!selectedTopic) return;
    setShowModal(false);
    
    // Navigate to queue with selected topic
    router.push({
      pathname: '/(app)/queue',
      params: { topicId: selectedTopic, difficulty: selectedDifficulty },
    });
  };

  const handleScheduleSession = () => {
    if (!selectedTopic) return;
    setShowModal(false);
    
    // Navigate to schedule with selected topic
    router.push({
      pathname: '/(app)/schedule',
      params: { topicId: selectedTopic, difficulty: selectedDifficulty },
    });
  };

  const selectedTopicData = TOPICS.find((t) => t.id === selectedTopic);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search topics..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      {/* Topics Grid */}
      <FlatList
        data={filteredTopics}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <Card
            style={styles.topicCard}
            onPress={() => handleTopicPress(item.id)}
          >
            <Card.Content style={styles.cardContent}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text variant="titleMedium" style={styles.topicName}>
                {item.name}
              </Text>
              <Text variant="bodySmall" style={styles.topicDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.chipContainer}>
                {item.difficulty_levels.map((level) => (
                  <Chip
                    key={level}
                    mode="outlined"
                    compact
                    style={styles.difficultyChip}
                    textStyle={styles.chipText}
                  >
                    {level}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}
      />

      {/* Topic Selection Modal */}
      <Portal>
        <Modal
          visible={showModal}
          onDismiss={() => setShowModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              {selectedTopicData?.icon} {selectedTopicData?.name}
            </Text>
            <Text variant="bodyMedium" style={styles.modalDescription}>
              {selectedTopicData?.description}
            </Text>

            {/* Difficulty Selection */}
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Select Difficulty
              </Text>
              <RadioButton.Group
                onValueChange={setSelectedDifficulty}
                value={selectedDifficulty}
              >
                {selectedTopicData?.difficulty_levels.map((level) => (
                  <View key={level} style={styles.radioItem}>
                    <RadioButton value={level} />
                    <Text variant="bodyLarge">{level}</Text>
                  </View>
                ))}
              </RadioButton.Group>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handlePracticeNow}
                style={styles.primaryButton}
                icon="play"
              >
                Practice Now
              </Button>
              <Button
                mode="outlined"
                onPress={handleScheduleSession}
                style={styles.secondaryButton}
                icon="calendar"
              >
                Schedule Session
              </Button>
              <Button
                mode="text"
                onPress={() => setShowModal(false)}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  searchbar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  gridContainer: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  topicCard: {
    flex: 1,
    margin: 8,
    backgroundColor: 'white',
    minHeight: 180,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  icon: {
    fontSize: 48,
    marginBottom: 8,
  },
  topicName: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  topicDescription: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  difficultyChip: {
    height: 24,
    marginHorizontal: 2,
  },
  chipText: {
    fontSize: 10,
  },
  modalContainer: {
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 6,
  },
  secondaryButton: {
    paddingVertical: 6,
  },
  cancelButton: {
    marginTop: 4,
  },
});

