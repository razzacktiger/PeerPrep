import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '../../../lib/constants/colors';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function AuthButton({
  title,
  onPress,
  disabled = false,
  isLoading = false,
}: AuthButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, (disabled || isLoading) && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={GRADIENTS.PRIMARY}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.buttonGradient}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
