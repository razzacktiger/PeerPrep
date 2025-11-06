/**
 * Sign Up Screen
 * New user registration
 */

import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText, Card } from 'react-native-paper';
import { useRouter, Link } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Logo/Title Section */}
          <View style={styles.header}>
            <Text variant="displaySmall" style={styles.title}>
              🎯 PeerPrep
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Join the community
            </Text>
          </View>

          {/* Form Card */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.cardTitle}>
                Create Account
              </Text>

              <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                autoCapitalize="words"
                autoComplete="name"
                style={styles.input}
                disabled={isLoading}
              />

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
                disabled={isLoading}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password-new"
                style={styles.input}
                disabled={isLoading}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoComplete="password-new"
                style={styles.input}
                disabled={isLoading}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
              />

              {displayError && (
                <HelperText type="error" visible={!!displayError}>
                  {displayError}
                </HelperText>
              )}

              <Button
                mode="contained"
                onPress={handleSignUp}
                loading={isLoading}
                disabled={!isFormValid || isLoading}
                style={styles.button}
              >
                Create Account
              </Button>

              {/* Sign In Link */}
              <View style={styles.linkContainer}>
                <Text variant="bodyMedium">Already have an account? </Text>
                <Link href="/(auth)/sign-in" asChild>
                  <Text variant="bodyMedium" style={styles.link}>
                    Sign in
                  </Text>
                </Link>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
  },
  card: {
    backgroundColor: 'white',
    elevation: 4,
  },
  cardTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  link: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
});


