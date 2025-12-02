import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Image, ActivityIndicator, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENTS } from "../../../lib/constants/colors";
import { pickAndUploadProfileImage } from "../../../lib/utils/imageUpload";
import styles from "../../styles/settings/ProfileSectionStyles";

interface ProfileSectionProps {
  displayName: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
  onDisplayNameChange: (name: string) => void;
  onBioChange: (bio: string) => void;
  onAvatarChange: (url: string) => Promise<void>;
  onSave: () => void;
  isSaving?: boolean;
  saveSuccess?: boolean;
  userId: string;
}

export default function ProfileSection({
  displayName,
  email,
  bio,
  avatarUrl,
  onDisplayNameChange,
  onBioChange,
  onAvatarChange,
  onSave,
  isSaving = false,
  saveSuccess = false,
  userId,
}: ProfileSectionProps) {
  const [showBioModal, setShowBioModal] = useState(false);
  const [localDisplayName, setLocalDisplayName] = useState(displayName);
  const [localBio, setLocalBio] = useState(bio);
  const [hasChanges, setHasChanges] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  // Update local state when props change
  React.useEffect(() => {
    setLocalDisplayName(displayName);
    setHasChanges(false);
  }, [displayName]);
  
  React.useEffect(() => {
    setLocalBio(bio);
    setHasChanges(false);
  }, [bio]);
  
  // Detect changes
  React.useEffect(() => {
    const changed = localDisplayName !== displayName || localBio !== bio;
    setHasChanges(changed);
  }, [localDisplayName, localBio, displayName, bio]);
  
  const handleSave = () => {
    // Update parent with changes
    if (localDisplayName !== displayName) {
      onDisplayNameChange(localDisplayName);
    }
    if (localBio !== bio) {
      onBioChange(localBio);
    }
    // Trigger save
    onSave();
  };
  
  const handleAvatarUpload = async () => {
    try {
      setIsUploadingAvatar(true);
      
      const result = await pickAndUploadProfileImage(userId, avatarUrl);
      
      if (!result.success) {
        if (result.error && result.error !== 'Image selection cancelled') {
          Alert.alert('Upload Failed', result.error);
        }
        return;
      }
      
      if (result.url) {
        await onAvatarChange(result.url);
        Alert.alert('Success', 'Profile picture updated successfully');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to upload profile picture');
    } finally {
      setIsUploadingAvatar(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Information</Text>
      
      <View style={styles.card}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            {avatarUrl ? (
              <Image 
                source={{ uri: avatarUrl }} 
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <MaterialCommunityIcons name="account-circle" size={64} color="#6366F1" />
            )}
            {isUploadingAvatar && (
              <View style={styles.avatarOverlay}>
                <ActivityIndicator size="large" color="#FFFFFF" />
              </View>
            )}
          </View>
          <TouchableOpacity 
            style={styles.changeAvatarButton}
            onPress={handleAvatarUpload}
            disabled={isUploadingAvatar}
          >
            <MaterialCommunityIcons name="camera" size={16} color="#6366F1" />
            <Text style={styles.changeAvatarText}>
              {isUploadingAvatar ? 'Uploading...' : 'Change Avatar'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>JPG, PNG or GIF. Max 2MB.</Text>
        </View>

      {/* Name */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Display Name</Text>
        <TextInput
          value={localDisplayName}
          onChangeText={setLocalDisplayName}
          placeholder="Enter your display name"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />
      </View>

      {/* Email */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        <View style={[styles.input, styles.disabledInput]}>
          <Text style={styles.disabledText}>{email}</Text>
        </View>
        <Text style={styles.hint}>Email cannot be changed</Text>
      </View>

      {/* Bio */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Bio</Text>
        <TouchableOpacity onPress={() => setShowBioModal(true)} activeOpacity={1}>
          <View style={[styles.input, styles.bioInput]}>
            <Text 
              style={[styles.bioText, !localBio && styles.placeholderText]}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {localBio || "Tell us about yourself..."}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.8}
          style={styles.saveButton}
          disabled={isSaving || !hasChanges}
        >
          <LinearGradient
            colors={isSaving || !hasChanges ? ['#9CA3AF', '#9CA3AF'] : GRADIENTS.PRIMARY}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButtonGradient}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : saveSuccess ? 'Saved ✓' : hasChanges ? 'Save Changes' : 'No Changes'}
            </Text>
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
                value={localBio}
                onChangeText={setLocalBio}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#9CA3AF"
                multiline
                autoFocus
                textAlignVertical="top"
                style={styles.modalTextInput}
              />
            </ScrollView>
            
            <TouchableOpacity
              onPress={() => {
                onBioChange(localBio);
                setShowBioModal(false);
              }}
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
