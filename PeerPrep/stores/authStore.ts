/**
 * Authentication Store
 * 
 * Manages user authentication state using Zustand
 */

import { create } from 'zustand';
import { User } from '../lib/types';
import * as authApi from '../lib/api/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    const result = await authApi.signIn(email, password);

    if (result.error) {
      set({ isLoading: false, error: result.error });
      return false;
    }

    set({ user: result.data!, isLoading: false });
    return true;
  },

  signUp: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });

    const result = await authApi.signUp(email, password, name);

    if (result.error) {
      set({ isLoading: false, error: result.error });
      return false;
    }

    set({ user: result.data!, isLoading: false });
    return true;
  },

  signOut: async () => {
    await authApi.signOut();
    set({ user: null, error: null });
  },

  clearError: () => set({ error: null }),
}));


