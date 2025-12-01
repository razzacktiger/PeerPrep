import React from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SettingsHeader from "../components/settings/SettingsHeader";
import ProfileSection from "../components/settings/ProfileSection";
import PreferencesSection from "../components/settings/PreferencesSection";
import AccountActionsSection from "../components/settings/AccountActionsSection";
import { useAuthStore } from "../../stores/authStore";
import { useSettings } from "../../lib/hooks/useSettings";
import { deleteAccount } from "../../lib/api/settings";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);
  const user = useAuthStore((state) => state.user);
  const settings = useSettings();
  
  // Local state for profile updates
  const [pendingDisplayName, setPendingDisplayName] = React.useState('');
  const [pendingBio, setPendingBio] = React.useState('');
  
  // Update pending state when settings load
  React.useEffect(() => {
    setPendingDisplayName(settings.displayName);
    setPendingBio(settings.bio);
  }, [settings.displayName, settings.bio]);

  const handleSaveProfile = async () => {
    const success = await settings.updateProfile({
      display_name: pendingDisplayName,
      bio: pendingBio,
    });
    
    if (success) {
      Alert.alert('Success', 'Profile updated successfully');
    } else if (settings.saveError) {
      Alert.alert('Error', settings.saveError);
    }
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'Password reset email will be sent to your email address.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Email', 
          onPress: () => {
            // In production, implement password reset via email
            Alert.alert('Coming Soon', 'Password reset via email coming in Phase 2');
          }
        },
      ]
    );
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace("/(auth)/sign-in");
            } catch (error) {
              console.error("Failed to sign out:", error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Double confirmation
            Alert.alert(
              'Are you absolutely sure?',
              'Type DELETE to confirm account deletion.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Confirm Delete',
                  style: 'destructive',
                  onPress: async () => {
                    if (!user?.id) return;
                    
                    const result = await deleteAccount(user.id);
                    if (result.error) {
                      Alert.alert('Error', result.error);
                    } else {
                      router.replace("/(auth)/sign-in");
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };
  
  // Loading state
  if (settings.isLoading) {
    return (
      <View style={styles.container}>
        <SettingsHeader paddingTop={insets.top + 32} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </View>
    );
  }
  
  // Error state
  if (settings.error) {
    return (
      <View style={styles.container}>
        <SettingsHeader paddingTop={insets.top + 32} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{settings.error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SettingsHeader paddingTop={insets.top + 32} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ProfileSection
          displayName={settings.displayName}
          email={settings.email}
          bio={settings.bio}
          avatarUrl={settings.avatarUrl}
          onDisplayNameChange={setPendingDisplayName}
          onBioChange={setPendingBio}
          onSave={handleSaveProfile}
          isSaving={settings.isSaving}
          saveSuccess={settings.saveSuccess}
        />

        <PreferencesSection
          darkMode={settings.darkMode}
          pushNotifications={settings.pushNotifications}
          emailNotifications={settings.emailNotifications}
          sessionReminders={settings.sessionReminders}
          matchUpdates={settings.matchUpdates}
          autoMatchOnPreferences={settings.autoMatchOnPreferences}
          onDarkModeChange={(value) => settings.updatePreference('dark_mode', value)}
          onPushNotificationsChange={(value) => settings.updatePreference('push_notifications', value)}
          onEmailNotificationsChange={(value) => settings.updatePreference('email_notifications', value)}
          onSessionRemindersChange={(value) => settings.updatePreference('session_reminders', value)}
          onMatchUpdatesChange={(value) => settings.updatePreference('match_updates', value)}
          onAutoMatchOnPreferencesChange={(value) => settings.updatePreference('auto_match_on_preferences', value)}
        />

        <AccountActionsSection
          onChangePassword={handleChangePassword}
          onSignOut={handleSignOut}
          onDeleteAccount={handleDeleteAccount}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
  },
});
