/**
 * Sign In Screen
 * Email/password authentication
 */

import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText, Card } from 'react-native-paper';
import { useRouter, Link } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';

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
              Practice interviews with peers
            </Text>
          </View>

          {/* Form Card */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.cardTitle}>
                Sign In
              </Text>

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
                autoComplete="password"
                style={styles.input}
                disabled={isLoading}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              {error && (
                <HelperText type="error" visible={!!error}>
                  {error}
                </HelperText>
              )}

              <Button
                mode="contained"
                onPress={handleSignIn}
                loading={isLoading}
                disabled={!isFormValid || isLoading}
                style={styles.button}
              >
                Continue
              </Button>

              {/* Demo Credentials */}
              <Card style={styles.demoCard}>
                <Card.Content>
                  <Text variant="labelSmall" style={styles.demoText}>
                    Demo Credentials:
                  </Text>
                  <Text variant="bodySmall" style={styles.demoText}>
                    Email: test@example.com
                  </Text>
                  <Text variant="bodySmall" style={styles.demoText}>
                    Password: password123
                  </Text>
                </Card.Content>
              </Card>

              {/* Sign Up Link */}
              <View style={styles.linkContainer}>
                <Text variant="bodyMedium">Don't have an account? </Text>
                <Link href="/(auth)/sign-up" asChild>
                  <Text variant="bodyMedium" style={styles.link}>
                    Sign up
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
  demoCard: {
    marginTop: 16,
    backgroundColor: '#e3f2fd',
  },
  demoText: {
    color: '#1976d2',
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


