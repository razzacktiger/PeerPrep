/**
 * Sign In Screen
 * Email/password authentication
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

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    clearError();

    if (!email || !password) {
      return;
    }

    const success = await signIn(email, password);

    if (success) {
      router.replace('/(app)/home');
    }
  };

  const isFormValid = email.length > 0 && password.length > 0;

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
                Practice interviews with peers
              </Text>
            </View>

            {/* Form Card */}
            <View style={authStyles.card}>
              <AuthInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                disabled={isLoading}
                placeholder="test@example.com"
              />

              <AuthInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                isPassword
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                autoCapitalize="none"
                autoComplete="password"
                disabled={isLoading}
                placeholder="password123"
              />

              <ErrorMessage message={error || ''} />

              <AuthButton
                title="Continue"
                onPress={handleSignIn}
                disabled={!isFormValid}
                isLoading={isLoading}
              />

              {/* Demo Credentials */}
              <View style={authStyles.demoCard}>
                <MaterialCommunityIcons name="lightbulb-on" size={16} color="#8B5CF6" />
                <View style={authStyles.demoContent}>
                  <Text style={authStyles.demoTitle}>Demo Credentials:</Text>
                  <Text style={authStyles.demoText}>Email: test@example.com</Text>
                  <Text style={authStyles.demoText}>Password: password123</Text>
                </View>
              </View>

              {/* Sign Up Link */}
              <View style={authStyles.linkContainer}>
                <Text style={authStyles.linkText}>Don't have an account? </Text>
                <Link href="/(auth)/sign-up" asChild>
                  <TouchableOpacity>
                    <Text style={authStyles.link}>Sign up</Text>
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


