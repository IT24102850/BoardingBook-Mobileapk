import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

const Screen = ({ children }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16
  }
});

export default Screen;
