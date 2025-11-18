/**
 * Entry point - Redirects to auth or app based on login status
 */

import { Redirect } from 'expo-router';
import { useAuthStore } from '../stores/authStore';

export default function Index() {
  const user = useAuthStore((state) => state.user);

  // Simple redirect logic
  // In production, you'd check for valid session/token
  if (user) {
    return <Redirect href="/(app)/home" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}
