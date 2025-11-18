import React from "react";
import { View, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/topics/TopicSearchStyles";

interface TopicSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function TopicSearch({
  searchQuery,
  onSearchChange,
}: TopicSearchProps) {
  return (
    <View style={styles.searchContainer}>
      <MaterialCommunityIcons
        name="magnify"
        size={20}
        color="#9CA3AF"
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Search topics..."
        placeholderTextColor="#9CA3AF"
        value={searchQuery}
        onChangeText={onSearchChange}
      />
    </View>
  );
}
