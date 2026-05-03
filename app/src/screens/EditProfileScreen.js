import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import Screen from '../components/Screen';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import api from '../services/api';

const sleepOptions = ['early bird', 'night owl', 'flexible'];
const studyOptions = ['quiet', 'group study', 'flexible'];
const cleanlinessOptions = ['very tidy', 'moderate', 'casual'];

const EditProfileScreen = () => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    budgetMin: '',
    budgetMax: '',
    preferredLocation: '',
    sleepHabit: 'flexible',
    studyHabit: 'flexible',
    cleanliness: 'moderate',
    interests: '',
    lookingForGroup: true
  });

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/roommate/profile/me');
        const data = response.data;
        setProfile({
          budgetMin: String(data.budgetMin ?? ''),
          budgetMax: String(data.budgetMax ?? ''),
          preferredLocation: data.preferredLocation ?? '',
          sleepHabit: data.sleepHabit ?? 'flexible',
          studyHabit: data.studyHabit ?? 'flexible',
          cleanliness: data.cleanliness ?? 'moderate',
          interests: Array.isArray(data.interests) ? data.interests.join(', ') : '',
          lookingForGroup: Boolean(data.lookingForGroup)
        });
      } catch (error) {
        if (error.response?.status !== 404) {
          Alert.alert('Failed to load profile', error.response?.data?.error || error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/api/roommate/profile', {
        ...profile,
        interests: profile.interests.split(',').map((item) => item.trim()).filter(Boolean)
      });
      Alert.alert('Saved', 'Roommate profile updated successfully.');
    } catch (error) {
      Alert.alert('Save failed', error.response?.data?.error || error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Roommate Profile</Text>
        <Text style={styles.subtitle}>Set your habits and preferences so the matcher can find compatible roommates.</Text>

        <View style={styles.card}>
          <FormInput label="Min Budget" placeholder="e.g. 15000" value={profile.budgetMin} onChangeText={(value) => setProfile((prev) => ({ ...prev, budgetMin: value }))} keyboardType="numeric" />
          <FormInput label="Max Budget" placeholder="e.g. 25000" value={profile.budgetMax} onChangeText={(value) => setProfile((prev) => ({ ...prev, budgetMax: value }))} keyboardType="numeric" />
          <FormInput label="Preferred Location" placeholder="e.g. Malabe" value={profile.preferredLocation} onChangeText={(value) => setProfile((prev) => ({ ...prev, preferredLocation: value }))} />

          <Text style={styles.pickerLabel}>Sleep Habit</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={profile.sleepHabit} onValueChange={(value) => setProfile((prev) => ({ ...prev, sleepHabit: value }))} dropdownIconColor="#e2e8f0" style={styles.picker}>
              {sleepOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>

          <Text style={styles.pickerLabel}>Study Habit</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={profile.studyHabit} onValueChange={(value) => setProfile((prev) => ({ ...prev, studyHabit: value }))} dropdownIconColor="#e2e8f0" style={styles.picker}>
              {studyOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>

          <Text style={styles.pickerLabel}>Cleanliness</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={profile.cleanliness} onValueChange={(value) => setProfile((prev) => ({ ...prev, cleanliness: value }))} dropdownIconColor="#e2e8f0" style={styles.picker}>
              {cleanlinessOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>

          <FormInput label="Interests" placeholder="sports, gaming, music" value={profile.interests} onChangeText={(value) => setProfile((prev) => ({ ...prev, interests: value }))} />

          <View style={styles.switchRow}>
            <View style={styles.switchCopy}>
              <Text style={styles.switchLabel}>Looking for group</Text>
              <Text style={styles.switchHelp}>Turn this off when you are already grouped.</Text>
            </View>
            <Switch value={profile.lookingForGroup} onValueChange={(value) => setProfile((prev) => ({ ...prev, lookingForGroup: value }))} />
          </View>

          <PrimaryButton title={loading || saving ? 'Saving...' : 'Save Profile'} onPress={handleSave} disabled={loading || saving} />
        </View>
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
  pickerLabel: {
    color: '#cbd5e1',
    fontWeight: '600',
    marginBottom: 6
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#111c34',
    marginBottom: 12
  },
  picker: {
    color: '#f8fafc'
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  switchCopy: {
    flex: 1,
    paddingRight: 12
  },
  switchLabel: {
    color: '#f8fafc',
    fontWeight: '700'
  },
  switchHelp: {
    color: '#94a3b8',
    marginTop: 4
  }
});

export default EditProfileScreen;
