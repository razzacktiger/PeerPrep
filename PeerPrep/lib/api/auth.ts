/**
 * Supabase Authentication API
 * Real authentication using Supabase Auth + Profiles
 */

import { supabase } from "../supabase";
import { ApiResponse, User } from "../types";

/**
 * Sign up with email, password, and name
 * Profile is created automatically by database trigger
 */
export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<ApiResponse<User>> {
  try {
    // Create auth user (trigger will create profile automatically)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          display_name: name, // Stored in auth.users.raw_user_meta_data
        },
      },
    });

    if (authError) {
      return { error: authError.message };
    }

    if (!authData.user) {
      return { error: "Failed to create user account" };
    }

    // Fetch the profile that was created by trigger
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profile) {
      return {
        error: "Account created but profile not found. Please try signing in.",
      };
    }

    // Return user data matching your User type
    const user: User = {
      id: authData.user.id,
      email: profile.email,
      name: profile.display_name,
      avatar_url: profile.avatar_url,
      created_at: authData.user.created_at,
    };

    return { data: user };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Sign in with email and password
 * Fetches user profile from database
 */
export async function signIn(
  email: string,
  password: string
): Promise<ApiResponse<User>> {
  try {
    // Sign in with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

    if (authError) {
      return { error: authError.message };
    }

    if (!authData.user) {
      return { error: "Invalid credentials" };
    }

    // Fetch user profile from database
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profile) {
      return { error: "Profile not found. Please contact support." };
    }

    // Return user data
    const user: User = {
      id: authData.user.id,
      email: profile.email,
      name: profile.display_name,
      avatar_url: profile.avatar_url,
      created_at: authData.user.created_at,
    };

    return { data: user };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Get current authenticated user
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    // Get auth user from session
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return null;
    }

    // Fetch profile from database
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    // Return user data
    return {
      id: authUser.id,
      email: profile.email,
      name: profile.display_name,
      avatar_url: profile.avatar_url,
      created_at: authUser.created_at,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Sign out current user
 * Clears session from AsyncStorage
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error.message);
    throw error;
  }
}
