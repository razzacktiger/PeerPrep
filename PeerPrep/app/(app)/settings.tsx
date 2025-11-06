/**
 * Settings Screen
 * User profile and preferences
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  List,
  Switch,
  Button,
  Avatar,
  Divider,
  Menu,
  Portal,
  Dialog,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  
  const [recordingDefault, setRecordingDefault] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [deleteAfterDays, setDeleteAfterDays] = useState(7);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  const handleSignOut = async () => {
    setShowSignOutDialog(false);
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Section */}
        <Card style={styles.card}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Image
              size={80}
              source={{ uri: user?.avatar_url || 'https://ui-avatars.com/api/?name=User' }}
            />
            <View style={styles.profileInfo}>
              <Text variant="headlineSmall" style={styles.name}>
                {user?.name}
              </Text>
              <Text variant="bodyMedium" style={styles.email}>
                {user?.email}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Recording Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Recording Settings
            </Text>

            <List.Item
              title="Default Recording"
              description="Automatically start recording sessions"
              left={() => <List.Icon icon="record-circle" />}
              right={() => (
                <Switch
                  value={recordingDefault}
                  onValueChange={setRecordingDefault}
                  color="#6200ee"
                />
              )}
            />

            <Divider />

            <List.Item
              title="Delete Recordings After"
              description={`Auto-delete after ${deleteAfterDays} days`}
              left={() => <List.Icon icon="delete-clock" />}
              right={() => (
                <Menu
                  visible={showDeleteMenu}
                  onDismiss={() => setShowDeleteMenu(false)}
                  anchor={
                    <Button onPress={() => setShowDeleteMenu(true)}>
                      {deleteAfterDays} days
                    </Button>
                  }
                >
                  <Menu.Item
                    onPress={() => {
                      setDeleteAfterDays(7);
                      setShowDeleteMenu(false);
                    }}
                    title="7 days"
                  />
                  <Menu.Item
                    onPress={() => {
                      setDeleteAfterDays(14);
                      setShowDeleteMenu(false);
                    }}
                    title="14 days"
                  />
                  <Menu.Item
                    onPress={() => {
                      setDeleteAfterDays(30);
                      setShowDeleteMenu(false);
                    }}
                    title="30 days"
                  />
                  <Menu.Item
                    onPress={() => {
                      setDeleteAfterDays(90);
                      setShowDeleteMenu(false);
                    }}
                    title="90 days"
                  />
                </Menu>
              )}
            />
          </Card.Content>
        </Card>

        {/* Notification Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Notifications
            </Text>

            <List.Item
              title="Push Notifications"
              description="Get notified about matches and sessions"
              left={() => <List.Icon icon="bell" />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  color="#6200ee"
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Privacy Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Privacy & Data
            </Text>

            <List.Item
              title="Privacy Policy"
              description="View our privacy policy"
              left={() => <List.Icon icon="shield-lock" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => alert('Privacy Policy coming soon')}
            />

            <Divider />

            <List.Item
              title="Terms of Service"
              description="View terms and conditions"
              left={() => <List.Icon icon="file-document" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => alert('Terms of Service coming soon')}
            />

            <Divider />

            <List.Item
              title="Data Export"
              description="Download your data"
              left={() => <List.Icon icon="download" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => alert('Data export coming soon')}
            />
          </Card.Content>
        </Card>

        {/* About Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              About
            </Text>

            <List.Item
              title="Version"
              description="1.0.0"
              left={() => <List.Icon icon="information" />}
            />

            <Divider />

            <List.Item
              title="Help & Support"
              description="Get help with PeerPrep"
              left={() => <List.Icon icon="help-circle" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => alert('Support coming soon')}
            />

            <Divider />

            <List.Item
              title="Rate Us"
              description="Share your feedback"
              left={() => <List.Icon icon="star" />}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => alert('Rating feature coming soon')}
            />
          </Card.Content>
        </Card>

        {/* Sign Out Button */}
        <Button
          mode="outlined"
          onPress={() => setShowSignOutDialog(true)}
          style={styles.signOutButton}
          icon="logout"
          textColor="#b00020"
        >
          Sign Out
        </Button>
      </View>

      {/* Sign Out Confirmation Dialog */}
      <Portal>
        <Dialog visible={showSignOutDialog} onDismiss={() => setShowSignOutDialog(false)}>
          <Dialog.Title>Sign Out?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to sign out? You'll need to sign in again to access your account.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowSignOutDialog(false)}>Cancel</Button>
            <Button onPress={handleSignOut} textColor="#b00020">Sign Out</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 16,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  profileInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: '#666',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  signOutButton: {
    marginTop: 8,
    marginBottom: 24,
    borderColor: '#b00020',
  },
});

