import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import Screen from '../components/Screen';
import PrimaryButton from '../components/PrimaryButton';
import api from '../services/api';

const InvitationsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const loadInvitations = useCallback(async () => {
    setLoading(true);
    try {
      const [invitationsResponse, profileResponse] = await Promise.all([
        api.get('/api/roommate/invitations'),
        api.get('/api/roommate/profile/me')
      ]);
      setInvitations(invitationsResponse.data);
      setCurrentUserId(profileResponse.data.userId?._id || profileResponse.data.userId);
    } catch (error) {
      Alert.alert('Unable to load invitations', error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  const respond = async (invitationId, action) => {
    try {
      await api.put(`/api/roommate/invite/${invitationId}/${action}`);
      await loadInvitations();
    } catch (error) {
      Alert.alert('Action failed', error.response?.data?.error || error.message);
    }
  };

  const renderItem = ({ item }) => {
    const canRespond = item.status === 'pending' && item.toUser?._id === currentUserId;

    return (
      <View style={styles.card}>
        <Text style={styles.status}>{item.status.toUpperCase()}</Text>
        <Text style={styles.text}>From: {item.fromUser?.name || 'Unknown'}</Text>
        <Text style={styles.text}>To: {item.toUser?.name || 'Unknown'}</Text>

        {canRespond ? (
          <View style={styles.actions}>
            <View style={styles.actionButton}>
              <PrimaryButton title="Accept" onPress={() => respond(item._id, 'accept')} />
            </View>
            <View style={styles.actionButton}>
              <PrimaryButton title="Reject" tone="ghost" onPress={() => respond(item._id, 'reject')} />
            </View>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <Screen>
      <Text style={styles.title}>Invitations</Text>
      <Text style={styles.subtitle}>Track roommate invites and confirm the group formation flow.</Text>

      <FlatList
        data={invitations}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadInvitations} tintColor="#38bdf8" />}
        ListEmptyComponent={<Text style={styles.empty}>No invitations yet.</Text>}
        renderItem={renderItem}
      />
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
  status: {
    color: '#7dd3fc',
    fontWeight: '800',
    marginBottom: 10
  },
  text: {
    color: '#e2e8f0',
    marginBottom: 4
  },
  actions: {
    flexDirection: 'row',
    marginTop: 14
  },
  actionButton: {
    flex: 1,
    marginRight: 8
  },
  empty: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 18
  }
});

export default InvitationsScreen;
