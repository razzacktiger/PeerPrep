/**
 * Mock Authentication API
 * 
 * These are mock functions for POC. In production, connect to Supabase Auth.
 */

import { ApiResponse, User } from '../types';

// Mock user storage
const MOCK_USERS: Record<string, { email: string; password: string; name: string }> = {
  'test@example.com': {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  },
};

// Current mock user (simulating session)
let currentMockUser: User | null = null;

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<ApiResponse<User>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const mockUser = MOCK_USERS[email.toLowerCase()];

  if (!mockUser || mockUser.password !== password) {
    return {
      error: 'Invalid email or password',
    };
  }

  // Create mock user object
  const user: User = {
    id: `user_${Date.now()}`,
    email: mockUser.email,
    name: mockUser.name,
    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockUser.name)}`,
    created_at: new Date().toISOString(),
  };

  currentMockUser = user;

  return {
    data: user,
  };
}

/**
 * Sign up with email, password, and name
 */
export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<ApiResponse<User>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (MOCK_USERS[email.toLowerCase()]) {
    return {
      error: 'Email already exists',
    };
  }

  // Add to mock storage
  MOCK_USERS[email.toLowerCase()] = {
    email,
    password,
    name,
  };

  // Create mock user object
  const user: User = {
    id: `user_${Date.now()}`,
    email,
    name,
    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
    created_at: new Date().toISOString(),
  };

  currentMockUser = user;

  return {
    data: user,
  };
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  return currentMockUser;
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  currentMockUser = null;
}


