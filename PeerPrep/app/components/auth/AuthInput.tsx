import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../../lib/constants/colors';

interface AuthInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  disabled?: boolean;
}

export default function AuthInput({
  label,
  value,
  onChangeText,
  isPassword = false,
  showPassword = false,
  onTogglePassword,
  disabled = false,
  ...props
}: AuthInputProps) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          style={[styles.input, isPassword && styles.passwordInput]}
          editable={!disabled}
          placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
          {...props}
        />
        {isPassword && onTogglePassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={onTogglePassword}
          >
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={COLORS.TEXT_TERTIARY}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    backgroundColor: COLORS.BG_INPUT,
    paddingHorizontal: 16,
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 14,
    padding: 4,
  },
});
