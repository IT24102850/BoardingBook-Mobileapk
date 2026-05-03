import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

const PrimaryButton = ({ title, onPress, disabled, tone = 'primary' }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        tone === 'ghost' ? styles.ghost : styles.primary,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed
      ]}
    >
      <Text style={[styles.text, tone === 'ghost' && styles.ghostText]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primary: {
    backgroundColor: '#38bdf8'
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#334155'
  },
  text: {
    color: '#020617',
    fontWeight: '700'
  },
  ghostText: {
    color: '#e2e8f0'
  },
  disabled: {
    opacity: 0.6
  },
  pressed: {
    transform: [{ scale: 0.99 }]
  }
});

export default PrimaryButton;
