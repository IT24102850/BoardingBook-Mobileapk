import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Screen from '../components/Screen';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import api from '../services/api';

const RoomBookingScreen = ({ route, navigation }) => {
  const group = route.params?.group;
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [form, setForm] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);

  const groupSize = useMemo(() => group?.members?.length || 0, [group]);

  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/rooms', {
          params: {
            minCapacity: groupSize,
            available: true
          }
        });
        setRooms(response.data);
      } catch (error) {
        Alert.alert('Unable to load rooms', error.response?.data?.error || error.message);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [groupSize]);

  const createBooking = async () => {
    if (!selectedRoom) {
      Alert.alert('Select a room', 'Pick one room before continuing.');
      return;
    }

    try {
      const response = await api.post('/api/bookings', {
        roomId: selectedRoom._id,
        groupId: group?._id,
        startDate: form.startDate,
        endDate: form.endDate
      });
      Alert.alert('Booking created', `Booking ID: ${response.data._id}`);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Booking failed', error.response?.data?.error || error.message);
    }
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Book a Room</Text>
        <Text style={styles.subtitle}>Only rooms with enough capacity for the entire group are shown.</Text>

        <View style={styles.card}>
          <FormInput label="Start Date" placeholder="2026-06-01" value={form.startDate} onChangeText={(value) => setForm((prev) => ({ ...prev, startDate: value }))} />
          <FormInput label="End Date" placeholder="2026-12-31" value={form.endDate} onChangeText={(value) => setForm((prev) => ({ ...prev, endDate: value }))} />
        </View>

        <Text style={styles.sectionTitle}>Available Rooms</Text>
        <FlatList
          data={rooms}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          ListEmptyComponent={<Text style={styles.empty}>{loading ? 'Loading rooms...' : 'No rooms available for this group size.'}</Text>}
          renderItem={({ item }) => {
            const selected = selectedRoom?._id === item._id;
            return (
              <TouchableOpacity onPress={() => setSelectedRoom(item)} style={[styles.roomCard, selected && styles.roomCardSelected]}>
                <Text style={styles.roomTitle}>{item.boardingName} • Room {item.roomNumber}</Text>
                <Text style={styles.roomText}>Location: {item.location}</Text>
                <Text style={styles.roomText}>Capacity: {item.capacity}</Text>
                <Text style={styles.roomText}>Rent: LKR {item.monthlyRent}</Text>
              </TouchableOpacity>
            );
          }}
        />

        <PrimaryButton title="Confirm Booking Request" onPress={createBooking} />
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
  roomCard: {
    backgroundColor: '#111c34',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 14,
    marginBottom: 12
  },
  roomCardSelected: {
    borderColor: '#38bdf8',
    backgroundColor: '#10213f'
  },
  roomTitle: {
    color: '#f8fafc',
    fontWeight: '700',
    marginBottom: 6
  },
  roomText: {
    color: '#cbd5e1',
    marginBottom: 4
  },
  empty: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 16
  }
});

export default RoomBookingScreen;
