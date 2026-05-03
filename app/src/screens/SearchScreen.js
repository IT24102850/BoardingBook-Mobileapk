import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import Screen from '../components/Screen';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import RoommateCard from '../components/RoommateCard';
import api from '../services/api';

const SearchScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [filters, setFilters] = useState({
    budgetMin: '',
    budgetMax: '',
    preferredLocation: '',
    sleepHabit: '',
    studyHabit: '',
    cleanliness: '',
    interest: ''
  });

  const searchRoommates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/roommate/search', { params: filters });
      setMatches(response.data);
    } catch (error) {
      Alert.alert('Search failed', error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const sendInvite = async (toUserId) => {
    try {
      await api.post('/api/roommate/invite', { toUserId });
      Alert.alert('Success', 'Invitation sent.');
    } catch (error) {
      Alert.alert('Invite failed', error.response?.data?.error || error.message);
    }
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Find Roommates</Text>
        <Text style={styles.subtitle}>Filter by budget, habits, and interests to find the best match.</Text>

        <View style={styles.card}>
          <FormInput label="Min Budget" placeholder="15000" value={filters.budgetMin} onChangeText={(value) => setFilters((prev) => ({ ...prev, budgetMin: value }))} keyboardType="numeric" />
          <FormInput label="Max Budget" placeholder="25000" value={filters.budgetMax} onChangeText={(value) => setFilters((prev) => ({ ...prev, budgetMax: value }))} keyboardType="numeric" />
          <FormInput label="Location" placeholder="Malabe" value={filters.preferredLocation} onChangeText={(value) => setFilters((prev) => ({ ...prev, preferredLocation: value }))} />
          <FormInput label="Sleep Habit" placeholder="night owl / early bird / flexible" value={filters.sleepHabit} onChangeText={(value) => setFilters((prev) => ({ ...prev, sleepHabit: value }))} />
          <FormInput label="Study Habit" placeholder="quiet / group study / flexible" value={filters.studyHabit} onChangeText={(value) => setFilters((prev) => ({ ...prev, studyHabit: value }))} />
          <FormInput label="Cleanliness" placeholder="very tidy / moderate / casual" value={filters.cleanliness} onChangeText={(value) => setFilters((prev) => ({ ...prev, cleanliness: value }))} />
          <FormInput label="Interest" placeholder="gaming" value={filters.interest} onChangeText={(value) => setFilters((prev) => ({ ...prev, interest: value }))} />

          <PrimaryButton title={loading ? 'Searching...' : 'Search'} onPress={searchRoommates} disabled={loading} />
        </View>

        <FlatList
          data={matches}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={searchRoommates} tintColor="#38bdf8" />}
          ListEmptyComponent={<Text style={styles.empty}>Run a search to discover compatible roommates.</Text>}
          renderItem={({ item }) => (
            <RoommateCard item={item} onInvite={() => sendInvite(item.userId?._id)} />
          )}
        />
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
    marginBottom: 16
  },
  empty: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 18
  }
});

export default SearchScreen;
