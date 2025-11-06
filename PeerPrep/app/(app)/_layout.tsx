/**
 * App Layout with Bottom Tabs
 * Main navigation for authenticated users
 */

import { Tabs } from 'expo-router';
import { Appbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: '#757575',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="topics"
        options={{
          title: 'Topics',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-variant" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-line" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
      
      {/* Hidden routes (not in tabs) */}
      <Tabs.Screen
        name="queue"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="session"
        options={{
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          href: null, // Hide from tabs
        }}
      />
    </Tabs>
  );
}

