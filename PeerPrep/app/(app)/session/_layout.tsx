/**
 * Session Layout - Stack navigation for session screens
 */

import { Stack } from 'expo-router';

export default function SessionLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Session',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="feedback"
        options={{
          title: 'Session Feedback',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}

