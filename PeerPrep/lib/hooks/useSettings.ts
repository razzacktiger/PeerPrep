/**
 * useSettings Hook
 * 
 * Manages user settings state including profile and preferences
 */

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import * as settingsApi from '../api/settings';

export interface UseSettingsReturn {
  // Profile state
  profile: settingsApi.UserProfile | null;
  displayName: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
  
  // Preferences state
  preferences: settingsApi.UserPreferences | null;
  darkMode: boolean;
  
  // Loading & error states
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  saveError: string | null;
  saveSuccess: boolean;
  
  // Actions
  updateProfile: (updates: settingsApi.ProfileUpdateData) => Promise<boolean>;
  updateAvatar: (avatarUrl: string) => Promise<void>;
  updatePreference: (key: keyof Omit<settingsApi.UserPreferences, 'user_id'>, value: boolean) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
  clearSaveStatus: () => void;
}

export function useSettings(): UseSettingsReturn {
  const user = useAuthStore((state) => state.user);
  
  // Profile state
  const [profile, setProfile] = useState<settingsApi.UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // Preferences state
  const [preferences, setPreferences] = useState<settingsApi.UserPreferences | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  
  // Loading & error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Fetch profile and preferences on mount
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    
    fetchSettings();
  }, [user?.id]);
  
  async function fetchSettings() {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch profile
      const profileResult = await settingsApi.getUserProfile(user.id);
      if (profileResult.error) {
        setError(profileResult.error);
      } else if (profileResult.data) {
        setProfile(profileResult.data);
        setDisplayName(profileResult.data.display_name);
        setEmail(profileResult.data.email);
        setBio(profileResult.data.bio || '');
        setAvatarUrl(profileResult.data.avatar_url || null);
      }
      
      // Fetch preferences
      const prefsResult = await settingsApi.getUserPreferences(user.id);
      if (prefsResult.error) {
        console.error('Failed to fetch preferences:', prefsResult.error);
        // Don't set error, use defaults
      } else if (prefsResult.data) {
        setPreferences(prefsResult.data);
        setDarkMode(prefsResult.data.dark_mode);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  }
  
  async function updateProfile(updates: settingsApi.ProfileUpdateData): Promise<boolean> {
    if (!user?.id) return false;
    
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      const result = await settingsApi.updateUserProfile(user.id, updates);
      
      if (result.error) {
        setSaveError(result.error);
        return false;
      }
      
      if (result.data) {
        setProfile(result.data);
        setDisplayName(result.data.display_name);
        setEmail(result.data.email);
        setBio(result.data.bio || '');
        setAvatarUrl(result.data.avatar_url || null);
        
        // Update auth store if display_name changed
        if (updates.display_name) {
          useAuthStore.setState({
            user: {
              ...user,
              display_name: updates.display_name,
            },
          });
        }
        
        // Update auth store if avatar_url changed
        if (updates.avatar_url !== undefined) {
          useAuthStore.setState({
            user: {
              ...user,
              avatar_url: updates.avatar_url,
            },
          });
        }
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      return true;
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update profile');
      return false;
    } finally {
      setIsSaving(false);
    }
  }
  
  async function updateAvatar(avatarUrl: string): Promise<void> {
    if (!user?.id) return;
    
    try {
      const result = await settingsApi.updateUserProfile(user.id, { avatar_url: avatarUrl });
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      if (result.data) {
        setProfile(result.data);
        setAvatarUrl(result.data.avatar_url || null);
        
        // Update auth store
        useAuthStore.setState({
          user: {
            ...user,
            avatar_url: avatarUrl,
          },
        });
      }
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update avatar');
    }
  }
  
  async function updatePreference(
    key: keyof Omit<settingsApi.UserPreferences, 'user_id'>,
    value: boolean
  ): Promise<boolean> {
    if (!user?.id) return false;
    
    // Optimistic update
    switch (key) {
      case 'dark_mode':
        setDarkMode(value);
        break;
    }
    
    try {
      const result = await settingsApi.updateUserPreferences(user.id, { [key]: value });
      
      if (result.error) {
        console.error('Failed to update preference:', result.error);
        // Revert optimistic update
        if (preferences) {
          switch (key) {
            case 'dark_mode':
              setDarkMode(preferences.dark_mode);
              break;
          }
        }
        return false;
      }
      
      if (result.data) {
        setPreferences(result.data);
      }
      
      return true;
    } catch (err) {
      console.error('Error updating preference:', err);
      return false;
    }
  }
  
  function clearSaveStatus() {
    setSaveError(null);
    setSaveSuccess(false);
  }
  
  async function refreshSettings() {
    await fetchSettings();
  }
  
  return {
    // Profile state
    profile,
    displayName,
    email,
    bio,
    avatarUrl,
    
    // Preferences state
    preferences,
    darkMode,
    
    // Loading & error states
    isLoading,
    error,
    isSaving,
    saveError,
    saveSuccess,
    
    // Actions
    updateProfile,
    updateAvatar,
    updatePreference,
    refreshSettings,
    clearSaveStatus,
  };
}
