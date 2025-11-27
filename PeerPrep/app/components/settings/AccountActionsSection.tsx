import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../styles/settings/AccountActionsSectionStyles";

interface AccountActionsSectionProps {
  onChangePassword: () => void;
  onSignOut: () => void;
  onDeleteAccount: () => void;
}

export default function AccountActionsSection({
  onChangePassword,
  onSignOut,
  onDeleteAccount,
}: AccountActionsSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account & Security</Text>

      {/* Security */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="shield-check" size={20} color="#6366F1" />
          </View>
          <Text style={styles.cardTitle}>Security</Text>
        </View>

        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={onChangePassword}>
          <MaterialCommunityIcons name="lock" size={20} color="#475569" />
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* Account Actions */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="cog" size={20} color="#6366F1" />
          </View>
          <Text style={styles.cardTitle}>Account Actions</Text>
        </View>

        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={onSignOut}>
          <MaterialCommunityIcons name="logout" size={20} color="#475569" />
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.deleteWarning}>
          <View style={styles.warningHeader}>
            <MaterialCommunityIcons name="alert-circle" size={18} color="#DC2626" />
            <Text style={styles.warningTitle}>Once you delete your account, there is no going back. Please be certain.</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.7}
          onPress={onDeleteAccount}
        >
          <MaterialCommunityIcons name="delete" size={20} color="#FFFFFF" />
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
