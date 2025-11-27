import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENTS } from "../../../lib/constants/colors";
import styles from "../../styles/settings/ProfileSectionStyles";

interface ProfileSectionProps {
  fullName: string;
  email: string;
  bio: string;
  onFullNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onBioChange: (bio: string) => void;
  onSave: () => void;
}

export default function ProfileSection({
  fullName,
  email,
  bio,
  onFullNameChange,
  onEmailChange,
  onBioChange,
  onSave,
}: ProfileSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Information</Text>
      
      <View style={styles.card}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="account-circle" size={64} color="#6366F1" />
        </View>
        <TouchableOpacity style={styles.changeAvatarButton}>
          <MaterialCommunityIcons name="camera" size={16} color="#6366F1" />
          <Text style={styles.changeAvatarText}>Change Avatar</Text>
        </TouchableOpacity>
        <Text style={styles.avatarHint}>JPG, PNG or GIF. Max 2MB.</Text>
      </View>

      {/* Name */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={fullName}
          onChangeText={onFullNameChange}
          placeholder="Enter your name"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />
      </View>

      {/* Email */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={onEmailChange}
          placeholder="Enter your email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      {/* Bio */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          value={bio}
          onChangeText={onBioChange}
          placeholder="Tell us about yourself..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={[styles.input, styles.bioInput]}
        />
      </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={onSave}
          activeOpacity={0.8}
          style={styles.saveButton}
        >
          <LinearGradient
            colors={GRADIENTS.PRIMARY}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButtonGradient}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
