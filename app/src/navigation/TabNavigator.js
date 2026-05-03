import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import SearchScreen from '../screens/SearchScreen';
import InvitationsScreen from '../screens/InvitationsScreen';
import MyGroupScreen from '../screens/MyGroupScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Tab = createBottomTabNavigator();

const iconFor = (name, color, size) => {
  switch (name) {
    case 'Search':
      return <Feather name="search" size={size} color={color} />;
    case 'Invitations':
      return <Feather name="mail" size={size} color={color} />;
    case 'MyGroup':
      return <Feather name="users" size={size} color={color} />;
    case 'Profile':
      return <Feather name="user" size={size} color={color} />;
    default:
      return <Feather name="circle" size={size} color={color} />;
  }
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#020617',
          borderTopColor: '#1e293b'
        },
        tabBarActiveTintColor: '#38bdf8',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarIcon: ({ color, size }) => iconFor(route.name, color, size)
      })}
    >
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Invitations" component={InvitationsScreen} />
      <Tab.Screen name="MyGroup" component={MyGroupScreen} options={{ title: 'My Group' }} />
      <Tab.Screen name="Profile" component={EditProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
