import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView } from "react-native";
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
  const [showBioModal, setShowBioModal] = useState(false);
  
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
        <TouchableOpacity onPress={() => setShowBioModal(true)} activeOpacity={1}>
          <View style={[styles.input, styles.bioInput]}>
            <Text 
              style={styles.bioText}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {bio || "Tell us about yourself..."}
            </Text>
          </View>
        </TouchableOpacity>
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

      {/* Bio Edit Modal */}
      <Modal
        visible={showBioModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBioModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Bio</Text>
              <TouchableOpacity onPress={() => setShowBioModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#475569" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <TextInput
                value={bio}
                onChangeText={onBioChange}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#9CA3AF"
                multiline
                autoFocus
                textAlignVertical="top"
                style={styles.modalTextInput}
              />
            </ScrollView>
            
            <TouchableOpacity
              onPress={() => setShowBioModal(false)}
              activeOpacity={0.8}
              style={styles.modalButton}
            >
              <LinearGradient
                colors={GRADIENTS.PRIMARY}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalButtonGradient}
              >
                <Text style={styles.modalButtonText}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
