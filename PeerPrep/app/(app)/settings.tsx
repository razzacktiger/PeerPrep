import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SettingsHeader from "../components/settings/SettingsHeader";
import ProfileSection from "../components/settings/ProfileSection";
import PreferencesSection from "../components/settings/PreferencesSection";
import AccountActionsSection from "../components/settings/AccountActionsSection";
import { useAuthStore } from "../../stores/authStore";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);

  // Profile state
  const [fullName, setFullName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex.johnson@example.com");
  const [bio, setBio] = useState(
    "Passionate software engineer specializing in full-stack development. Love solving algorithmic challenges and sharing knowledge with peers."
  );

  // Preference state
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [matchUpdates, setMatchUpdates] = useState(true);
  const [autoMatchOnPreferences, setAutoMatchOnPreferences] = useState(false);

  const handleSaveProfile = () => {
    console.log("Saving profile:", { fullName, email, bio });
    // TODO: API call to save profile
  };

  const handleChangePassword = () => {
    console.log("Change password");
    router.push("/(app)/settings/change-password");
  };

  const handleSignOut = async () => {
    console.log("Sign out");
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const handleDeleteAccount = () => {
    console.log("Delete account");
    // TODO: Delete account logic with confirmation
  };

  return (
    <View style={styles.container}>
      <SettingsHeader paddingTop={insets.top + 32} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ProfileSection
          fullName={fullName}
          email={email}
          bio={bio}
          onFullNameChange={setFullName}
          onEmailChange={setEmail}
          onBioChange={setBio}
          onSave={handleSaveProfile}
        />

        <PreferencesSection
          darkMode={darkMode}
          pushNotifications={pushNotifications}
          emailNotifications={emailNotifications}
          sessionReminders={sessionReminders}
          matchUpdates={matchUpdates}
          autoMatchOnPreferences={autoMatchOnPreferences}
          onDarkModeChange={setDarkMode}
          onPushNotificationsChange={setPushNotifications}
          onEmailNotificationsChange={setEmailNotifications}
          onSessionRemindersChange={setSessionReminders}
          onMatchUpdatesChange={setMatchUpdates}
          onAutoMatchOnPreferencesChange={setAutoMatchOnPreferences}
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
});
