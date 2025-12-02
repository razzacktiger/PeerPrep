/**
 * Settings API
 * 
 * Handles profile updates, preferences, and account settings
 */

import { supabase } from '../supabase';
import type { ApiResponse } from '../types';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  user_id: string;
  dark_mode: boolean;
}

export interface ProfileUpdateData {
  display_name?: string;
  bio?: string;
  avatar_url?: string;
}

/**
 * Get user profile from profiles table
 */
export async function getUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return { data: data as UserProfile };
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return { error: error.message || 'Failed to fetch profile' };
  }
}

/**
 * Update user profile in profiles table
 */
export async function updateUserProfile(
  userId: string,
  updates: ProfileUpdateData
): Promise<ApiResponse<UserProfile>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return { data: data as UserProfile };
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return { error: error.message || 'Failed to update profile' };
  }
}

/**
 * Get user preferences
 * Note: For Phase 1, we'll store preferences in a simple key-value table
 * or use profiles.skills jsonb field to store preferences
 */
export async function getUserPreferences(userId: string): Promise<ApiResponse<UserPreferences>> {
  try {
    // For now, we'll use the profiles table's skills jsonb to store preferences
    const { data, error } = await supabase
      .from('profiles')
      .select('id, skills')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // Extract preferences from skills jsonb or use defaults
    const skills = data?.skills as any || {};
    const preferences: UserPreferences = {
      user_id: userId,
      dark_mode: skills.dark_mode ?? false,
    };

    return { data: preferences };
  } catch (error: any) {
    console.error('Error fetching user preferences:', error);
    return { error: error.message || 'Failed to fetch preferences' };
  }
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  userId: string,
  preferences: Partial<Omit<UserPreferences, 'user_id'>>
): Promise<ApiResponse<UserPreferences>> {
  try {
    // First get current preferences
    const currentResult = await getUserPreferences(userId);
    if (currentResult.error) {
      return { error: currentResult.error };
    }

    // Merge with updates
    const updatedPreferences = {
      ...currentResult.data,
      ...preferences,
    };

    // Store in skills jsonb field
    const { data, error } = await supabase
      .from('profiles')
      .update({
        skills: {
          dark_mode: updatedPreferences.dark_mode,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select('id, skills')
      .single();

    if (error) throw error;

    // Return formatted preferences
    const skills = data?.skills as any || {};
    return {
      data: {
        user_id: userId,
        dark_mode: skills.dark_mode ?? false,
      },
    };
  } catch (error: any) {
    console.error('Error updating user preferences:', error);
    return { error: error.message || 'Failed to update preferences' };
  }
}

/**
 * Change user password
 */
export async function changePassword(newPassword: string): Promise<ApiResponse<void>> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { data: undefined };
  } catch (error: any) {
    console.error('Error changing password:', error);
    return { error: error.message || 'Failed to change password' };
  }
}

/**
 * Delete user account
 * This will cascade delete all user data due to foreign key constraints
 */
export async function deleteAccount(userId: string): Promise<ApiResponse<void>> {
  try {
    // First delete from profiles table (will cascade)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) throw profileError;

    // Then delete auth user (admin API required - for now just sign out)
    // Note: Full account deletion requires admin API or custom function
    await supabase.auth.signOut();

    return { data: undefined };
  } catch (error: any) {
    console.error('Error deleting account:', error);
    return { error: error.message || 'Failed to delete account' };
  }
}
