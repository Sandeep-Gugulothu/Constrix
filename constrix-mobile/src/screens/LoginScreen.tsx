import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const LoginScreen: React.FC = () => {
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      Alert.alert('Login Failed', 'Please try again');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Constrix</Text>
        <Text style={styles.subtitle}>Track your habits on-chain</Text>
        
        <View style={styles.features}>
          <Text style={styles.feature}>🎯 Daily habit tracking</Text>
          <Text style={styles.feature}>🔥 Streak rewards</Text>
          <Text style={styles.feature}>🏆 NFT achievements</Text>
          <Text style={styles.feature}>💰 VERY token rewards</Text>
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Connect Wallet</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Powered by Wepin • Secure wallet connection
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 48,
  },
  features: {
    marginBottom: 48,
  },
  feature: {
    fontSize: 16,
    color: '#e2e8f0',
    marginBottom: 12,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 24,
    textAlign: 'center',
  },
});

export default LoginScreen;