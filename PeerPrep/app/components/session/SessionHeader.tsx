import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Text, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../../styles/session/SessionHeaderStyles";

interface SessionHeaderProps {
  partnerName: string;
  partnerAvatar: string;
  topicName: string;
  time: string;
  onEndSession: () => void;
}

export default function SessionHeader({
  partnerName,
  partnerAvatar,
  topicName,
  time,
  onEndSession,
}: SessionHeaderProps) {
  return (
    <LinearGradient
      colors={["#7C3AED", "#3B82F6", "#4F46E5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        {/* Top Row - Partner Info & Timer */}
        <View style={styles.topRow}>
          <View style={styles.partnerInfo}>
            {partnerAvatar ? (
              <Image source={{ uri: partnerAvatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialCommunityIcons name="account-circle" size={48} color="#E5E7EB" />
              </View>
            )}
            <View style={styles.partnerDetails}>
              <View style={styles.partnerNameRow}>
                <Text style={styles.partnerName}>{partnerName}</Text>
                <View style={styles.onlineIndicator} />
              </View>
              <View style={styles.topicRow}>
                <Text style={styles.topicName}>{topicName}</Text>
              </View>
            </View>
          </View>

          <View style={styles.timerContainer}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#FFFFFF" />
            <Text style={styles.timerText}>{time}</Text>
          </View>
        </View>

        {/* Controls Row */}
        <View style={styles.controlsRow}>
          <View style={styles.mediaControls}>
            <TouchableOpacity
              style={styles.mediaButton}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="microphone" size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mediaButton}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="video" size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mediaButton}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="message-text" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={onEndSession}
            style={styles.endButton}
            labelStyle={styles.endButtonLabel}
            buttonColor="#EF4444"
          >
            End
          </Button>
        </View>
      </View>
    </LinearGradient>
  );
}
