import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from './PrimaryButton';

const RoommateCard = ({ item, onInvite }) => {
  const user = item.userId || {};

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image
          source={{ uri: user.profilePicture || 'https://via.placeholder.com/120x120.png?text=Roommate' }}
          style={styles.avatar}
        />
        <View style={styles.meta}>
          <Text style={styles.name}>{user.name || 'Anonymous'}</Text>
          <Text style={styles.subtle}>{user.email || ''}</Text>
          <Text style={styles.badge}>Compatibility {item.compatibilityScore ?? 0}%</Text>
        </View>
      </View>

      <Text style={styles.detail}>Budget: LKR {item.budgetMin} - LKR {item.budgetMax}</Text>
      <Text style={styles.detail}>Location: {item.preferredLocation}</Text>
      <Text style={styles.detail}>
        Habits: {item.sleepHabit} | {item.studyHabit} | {item.cleanliness}
      </Text>
      <Text style={styles.detail}>Interests: {(item.interests || []).join(', ') || 'None'}</Text>

      <PrimaryButton title="Send Invitation" onPress={onInvite} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111c34',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 14
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#1e293b'
  },
  meta: {
    marginLeft: 12,
    flex: 1
  },
  name: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700'
  },
  subtle: {
    color: '#94a3b8',
    marginTop: 2
  },
  badge: {
    color: '#7dd3fc',
    marginTop: 6,
    fontWeight: '600'
  },
  detail: {
    color: '#e2e8f0',
    marginBottom: 6,
    lineHeight: 20
  }
});

export default RoommateCard;
