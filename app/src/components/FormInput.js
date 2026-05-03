import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const FormInput = ({ label, style, ...props }) => {
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput placeholderTextColor="#94a3b8" style={[styles.input, style]} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: 12
  },
  label: {
    color: '#cbd5e1',
    fontWeight: '600',
    marginBottom: 6
  },
  input: {
    backgroundColor: '#111c34',
    color: '#f8fafc',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12
  }
});

export default FormInput;
