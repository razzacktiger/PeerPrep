/**
 * Sign Up Screen
 * New user registration
 */

import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import ErrorMessage from '../components/auth/ErrorMessage';
import { authStyles } from '../styles/auth/authStyles';
import { GRADIENTS } from '../../lib/constants/colors';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [localError, setLocalError] = useState('');

  const handleSignUp = async () => {
    clearError();
    setLocalError('');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setLocalError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    const success = await signUp(email, password, name);

    if (success) {
      router.replace('/(app)/home');
    }
  };

  const isFormValid =
    name.length > 0 &&
    email.length > 0 &&
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    password === confirmPassword;

  const displayError = error || localError;

  return (
    <LinearGradient
      colors={GRADIENTS.HEADER}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={authStyles.gradientContainer}
    >
      <KeyboardAvoidingView
        style={authStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={authStyles.content}>
            {/* Logo/Title Section */}
            <View style={authStyles.header}>
              <Text style={authStyles.title}>
                🎯 PeerPrep
              </Text>
              <Text style={authStyles.subtitle}>
                Join the community
              </Text>
            </View>

            {/* Form Card */}
            <View style={authStyles.card}>
              <AuthInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
                disabled={isLoading}
                placeholder="Enter your full name"
              />

              <AuthInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                disabled={isLoading}
                placeholder="Enter your email"
              />

              <AuthInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                isPassword
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                autoCapitalize="none"
                autoComplete="password-new"
                disabled={isLoading}
                placeholder="Create a password"
              />

              <AuthInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                isPassword
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                autoCapitalize="none"
                autoComplete="password-new"
                disabled={isLoading}
                placeholder="Confirm your password"
              />

              <ErrorMessage message={displayError} />

              <AuthButton
                title="Create Account"
                onPress={handleSignUp}
                disabled={!isFormValid}
                isLoading={isLoading}
              />

              {/* Sign In Link */}
              <View style={authStyles.linkContainer}>
                <Text style={authStyles.linkText}>Already have an account? </Text>
                <Link href="/(auth)/sign-in" asChild>
                  <TouchableOpacity>
                    <Text style={authStyles.link}>Sign in</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}


