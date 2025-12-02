import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePotentialMatches } from '../../../lib/hooks/usePotentialMatches';
import { ScheduledSession } from '../../../lib/types';
import { TOPICS } from '../../../lib/constants';

interface PotentialMatchesProps {
  onMatchRequested?: () => void;
}

export default function PotentialMatches({ onMatchRequested }: PotentialMatchesProps) {
  const {
    potentialMatches,
    loading,
    error,
    requesting,
    refetch,
    requestMatch,
  } = usePotentialMatches();

  const handleMatchRequest = async (sessionId: string, otherUserName: string) => {
    Alert.alert(
      'Request Match',
      `Do you want to schedule a session with ${otherUserName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Match',
          onPress: async () => {
            const success = await requestMatch(sessionId);
            if (success) {
              Alert.alert(
                'Match Requested!',
                'You have been matched with this user. Both of you will be notified to confirm the session.',
                [{ text: 'OK', onPress: onMatchRequested }]
              );
            } else if (error) {
              Alert.alert('Failed to Request Match', error);
            }
          }
        }
      ]
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTopicInfo = (topicId: string) => {
    return TOPICS.find(topic => topic.id === topicId) || {
      name: 'Unknown Topic',
      icon: '❓'
    };
  };

  const renderPotentialMatch = ({ item }: { item: ScheduledSession }) => {
    const topic = getTopicInfo(item.topic_id);
    const profileName = item.profiles?.display_name || 'Anonymous User';
    const isRequesting = requesting === item.id;

    return (
      <View style={styles.matchCard}>
        <View style={styles.matchHeader}>
          <View style={styles.userInfo}>
            {item.profiles?.avatar_url ? (
              <Image source={{ uri: item.profiles.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={20} color="#666" />
              </View>
            )}
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{profileName}</Text>
              <Text style={styles.topicName}>{topic.icon} {topic.name}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.matchButton, isRequesting && styles.matchButtonDisabled]}
            onPress={() => handleMatchRequest(item.id, profileName)}
            disabled={isRequesting}
          >
            {isRequesting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="people" size={16} color="#fff" />
                <Text style={styles.matchButtonText}>Match</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.sessionDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{formatTime(item.scheduled_for)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>Available for matching</Text>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    // Component will auto-fetch on mount via the hook
  }, []);

  const onRefresh = async () => {
    await refetch();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Finding potential matches...</Text>
      </View>
    );
  }

  if (potentialMatches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="people-outline" size={48} color="#ccc" />
        <Text style={styles.emptyTitle}>No Potential Matches</Text>
        <Text style={styles.emptySubtitle}>
          There are no other users with similar scheduling requirements at the moment.
        </Text>
        <TouchableOpacity style={styles.refreshButton} onPress={() => refetch()}>
          <Ionicons name="refresh" size={16} color="#007AFF" />
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="people" size={20} color="#007AFF" />
        <Text style={styles.headerTitle}>Potential Matches</Text>
        <Text style={styles.matchCount}>{potentialMatches.length}</Text>
      </View>
      
      <FlatList
        data={potentialMatches}
        renderItem={renderPotentialMatch}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  matchCount: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  listContent: {
    padding: 20,
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  topicName: {
    fontSize: 14,
    color: '#666',
  },
  matchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matchButtonDisabled: {
    opacity: 0.7,
  },
  matchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sessionDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  refreshButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});