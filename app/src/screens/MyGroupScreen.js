import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import api from '../services/api';

const MyGroupScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState(null);
  const [me, setMe] = useState(null);

  const loadGroup = useCallback(async () => {
    setLoading(true);
    try {
      const [groupResponse, profileResponse] = await Promise.all([
        api.get('/api/roommate/group/my'),
        api.get('/api/roommate/profile/me')
      ]);
      setGroup(groupResponse.data);
      setMe(profileResponse.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        Alert.alert('Unable to load group', error.response?.data?.error || error.message);
      }
      setGroup(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGroup();
  }, [loadGroup]);

  const leaveGroup = async () => {
    try {
      await api.delete('/api/roommate/group/leave');
      await loadGroup();
      Alert.alert('Left group', 'You are no longer assigned to that group.');
    } catch (error) {
      Alert.alert('Unable to leave', error.response?.data?.error || error.message);
    }
  };

  if (!group) {
    return (
      <Screen>
        <Text style={styles.title}>My Group</Text>
        <Text style={styles.subtitle}>No group yet. Accept invitations or search for roommates to start forming one.</Text>
      </Screen>
    );
  }

  const isLeader = group.leaderId?._id === me?.userId?._id;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{group.groupName}</Text>
        <Text style={styles.subtitle}>Group leader: {group.leaderId?.name || 'Unknown'}</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Members</Text>
          {group.members.map((member) => (
            <View key={member._id} style={styles.memberRow}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberEmail}>{member.email}</Text>
            </View>
          ))}
        </View>

        {isLeader ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Leader Actions</Text>
            <PrimaryButton title={loading ? 'Loading...' : 'Book a Room'} onPress={() => navigation.navigate('RoomBooking', { group })} disabled={loading} />
          </View>
        ) : null}

        <PrimaryButton title="Leave Group" tone="ghost" onPress={leaveGroup} />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6
  },
  subtitle: {
    color: '#94a3b8',
    marginBottom: 16,
    lineHeight: 20
  },
  card: {
    backgroundColor: '#111c34',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
    marginBottom: 14
  },
  sectionTitle: {
    color: '#f8fafc',
    fontWeight: '800',
    marginBottom: 12,
    fontSize: 16
  },
  memberRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  memberName: {
    color: '#e2e8f0',
    fontWeight: '700'
  },
  memberEmail: {
    color: '#94a3b8',
    marginTop: 3
  }
});

export default MyGroupScreen;
