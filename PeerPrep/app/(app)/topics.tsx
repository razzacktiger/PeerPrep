import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopicCard, { Topic } from '../components/topics/TopicCard';
import TopicSearch from '../components/topics/TopicSearch';
import topicsStyles from '../styles/topicsStyles';

export default function TopicsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  const topics: Topic[] = [
    {
      id: '1',
      name: 'Arrays',
      icon: 'view-grid',
      difficulty: 'Easy',
      questions: 45,
      description: 'Master array manipulation',
      gradient: ['#3b82f6', '#06b6d4'] as const,
    },
    {
      id: '2',
      name: 'Strings',
      icon: 'code-tags',
      difficulty: 'Easy',
      questions: 38,
      description: 'String processing',
      gradient: ['#a855f7', '#ec4899'] as const,
    },
    {
      id: '3',
      name: 'Binary Trees',
      icon: 'source-branch',
      difficulty: 'Medium',
      questions: 52,
      description: 'Tree traversal',
      gradient: ['#22c55e', '#10b981'] as const,
    },
    {
      id: '4',
      name: 'Graphs',
      icon: 'network',
      difficulty: 'Hard',
      questions: 41,
      description: 'Graph algorithms',
      gradient: ['#ef4444', '#f97316'] as const,
    },
    {
      id: '5',
      name: 'Dynamic Programming',
      icon: 'flash',
      difficulty: 'Hard',
      questions: 35,
      description: 'Optimization problems',
      gradient: ['#eab308', '#f97316'] as const,
    },
    {
      id: '6',
      name: 'Hash Tables',
      icon: 'pound',
      difficulty: 'Medium',
      questions: 29,
      description: 'Hashing optimization',
      gradient: ['#6366f1', '#a855f7'] as const,
    },
    {
      id: '7',
      name: 'Linked Lists',
      icon: 'view-list',
      difficulty: 'Easy',
      questions: 31,
      description: 'List manipulation',
      gradient: ['#14b8a6', '#06b6d4'] as const,
    },
    {
      id: '8',
      name: 'Binary Search',
      icon: 'file-search',
      difficulty: 'Medium',
      questions: 24,
      description: 'Search algorithms',
      gradient: ['#8b5cf6', '#a855f7'] as const,
    },
    {
      id: '9',
      name: 'Sorting',
      icon: 'database',
      difficulty: 'Medium',
      questions: 27,
      description: 'Sorting algorithms',
      gradient: ['#ec4899', '#f43f5e'] as const,
    },
  ];

  const filteredTopics = topics.filter((topic) =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePracticeNow = async (topic: Topic) => {
    try {
      await AsyncStorage.setItem('selectedTopic', JSON.stringify(topic));
      router.push({
        pathname: '/(app)/queue',
        params: {
          topicId: topic.id,
          difficulty: topic.difficulty,
        },
      });
    } catch (error) {
      console.error('Error saving selected topic:', error);
    }
  };

  const handleSchedule = async (topic: Topic) => {
    try {
      await AsyncStorage.setItem('selectedTopic', JSON.stringify(topic));
      router.push('/(app)/schedule');
    } catch (error) {
      console.error('Error saving selected topic:', error);
    }
  };

  const renderEmptyState = () => (
    <View style={topicsStyles.emptyContainer}>
      <View style={topicsStyles.emptyIconContainer}>
        <MaterialCommunityIcons name="magnify" size={32} color="#9CA3AF" />
      </View>
      <Text style={topicsStyles.emptyText}>
        No topics found matching "{searchQuery}"
      </Text>
    </View>
  );

  return (
    <View style={topicsStyles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#9333ea', '#3b82f6', '#4f46e5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[topicsStyles.headerGradient, { paddingTop: insets.top + 32 }]}
      >
        <View style={topicsStyles.headerContent}>
          <Text style={topicsStyles.title}>Practice Topics</Text>
          <Text style={topicsStyles.subtitle}>
            Choose a topic to start practicing
          </Text>

          {/* Search Bar */}
          <TopicSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </View>
      </LinearGradient>

      {/* Topics List */}
      <ScrollView style={topicsStyles.contentContainer}>
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onPracticeNow={handlePracticeNow}
              onSchedule={handleSchedule}
            />
          ))
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </View>
  );
}
