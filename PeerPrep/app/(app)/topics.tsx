import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopicCard, { Topic } from "../components/topics/TopicCard";
import TopicSearch from "../components/topics/TopicSearch";
import topicsStyles from "../styles/topicsStyles";
import { getTopics } from "../../lib/api/topics";

export default function TopicsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch topics from database
  useEffect(() => {
    async function loadTopics() {
      const { data, error } = await getTopics();
      if (data) {
        setTopics(data);
      }
      setLoading(false);
    }
    loadTopics();
  }, []);

  const filteredTopics = topics.filter((topic) =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePracticeNow = async (topic: Topic) => {
    try {
      await AsyncStorage.setItem("selectedTopic", JSON.stringify(topic));
      router.push({
        pathname: "/(app)/queue",
        params: {
          topicId: topic.id,
        },
      });
    } catch (error) {
      console.error("Error saving selected topic:", error);
    }
  };

  const handleSchedule = async (topic: Topic) => {
    try {
      await AsyncStorage.setItem("selectedTopic", JSON.stringify(topic));
      router.push("/(app)/schedule");
    } catch (error) {
      console.error("Error saving selected topic:", error);
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
        colors={["#9333ea", "#3b82f6", "#4f46e5"]}
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
        {filteredTopics.length > 0
          ? filteredTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onPracticeNow={handlePracticeNow}
                onSchedule={handleSchedule}
              />
            ))
          : renderEmptyState()}
      </ScrollView>
    </View>
  );
}
