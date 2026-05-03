import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const restoreToken = async () => {
      const savedToken = await AsyncStorage.getItem('token');
      setToken(savedToken);
      setReady(true);
    };

    restoreToken();
  }, []);

  const value = useMemo(
    () => ({
      token,
      ready,
      signInWithToken: async (nextToken) => {
        await AsyncStorage.setItem('token', nextToken);
        setToken(nextToken);
      },
      signIn: async (email, password) => {
        const response = await api.post('/api/auth/login', { email, password });
        const nextToken = response.data.token || response.data.accessToken || response.data.jwt;

        if (!nextToken) {
          throw new Error('Login succeeded but no token was returned');
        }

        await AsyncStorage.setItem('token', nextToken);
        setToken(nextToken);
        return response.data;
      },
      signOut: async () => {
        await AsyncStorage.removeItem('token');
        setToken(null);
      }
    }),
    [token, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
