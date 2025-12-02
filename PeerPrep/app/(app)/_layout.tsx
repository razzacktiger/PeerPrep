import { Tabs, usePathname } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons/';
import { StatsProvider } from '../../lib/contexts/StatsContext';

export default function AppLayout() {
  const pathname = usePathname();
  
  // Hide tab bar when in session or queue screens
  const hideTabBar = pathname.includes('/session') || pathname.includes('/queue');

  return (
    <StatsProvider>
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: '#757575',
          tabBarStyle: hideTabBar ? { display: 'none' } : undefined,
        }}
      >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="topics"
        options={{
          title: 'Topics',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-variant" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-line" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
      
      {/* Hidden routes (not in tabs) */}
      <Tabs.Screen
        name="queue"
        options={{
          title: 'Queue',
          headerShown: false,
          href: null, // Hide from tabs
        }}
      />
      <Tabs.Screen
        name="session"
        options={{
          title: 'Session',
          headerShown: false,
          href: null, // Hide from tabs
        }}
      />
    </Tabs>
    </StatsProvider>
  );
}