/**
 * Supabase Client Configuration
 *
 * Includes iOS Simulator network fix with custom fetch
 */

import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

// For demo/POC, we'll use mock values
// In production, use environment variables
const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || "https://mock.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key";

// Custom fetch with retry logic (fixes iOS Simulator network bug)
const customFetch = async (url: RequestInfo | URL, options?: RequestInit) => {
  const maxRetries = 3;
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      lastError = error;
      console.warn(
        `⚠️ Fetch attempt ${i + 1}/${maxRetries} failed, retrying...`
      );
      // Wait before retry (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 100));
    }
  }

  console.error("❌ All fetch attempts failed:", lastError);
  throw lastError;
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    fetch: customFetch, // Use custom fetch with retry
  },
});

/**
 * Get currently logged in user
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error getting current user:", error.message);
    return null;
  }

  return user;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error.message);
    throw error;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
