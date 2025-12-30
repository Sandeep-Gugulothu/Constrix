'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import api from '@/lib/api';
import { connectWallet, signMessage, generateAuthMessage, disconnectWallet, WalletType } from '@/lib/web3';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (walletType: WalletType) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('constrix_token');
    const userData = localStorage.getItem('constrix_user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        localStorage.removeItem('constrix_token');
        localStorage.removeItem('constrix_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (walletType: WalletType) => {
    try {
      setIsLoading(true);
      
      // For demo purposes, use mock auth if API is not available or wallet fails
      if (!process.env.NEXT_PUBLIC_API_URL) {
        const { mockAuth } = await import('@/lib/mockAuth');
        const { user: userData, token } = await mockAuth.login(walletType);
        
        localStorage.setItem('constrix_token', token);
        localStorage.setItem('constrix_user', JSON.stringify(userData));
        localStorage.setItem('constrix_wallet_type', walletType);
        setUser(userData);
        return;
      }
      
      try {
        console.log('Starting login with wallet type:', walletType);
        const { address } = await connectWallet(walletType);
        console.log('Wallet connected, address:', address);
        
        const message = generateAuthMessage(address);
        console.log('Generated auth message:', message);
        
        const signature = await signMessage(message, walletType);
        console.log('Message signed successfully');
        
        console.log('Sending login request to API:', process.env.NEXT_PUBLIC_API_URL);
        const response = await api.post('/auth/login', {
          walletAddress: address,
          signature,
          message,
          walletType
        });
        
        const { token, user: userData } = response.data;
        console.log('Login successful, user:', userData);
        
        localStorage.setItem('constrix_token', token);
        localStorage.setItem('constrix_user', JSON.stringify(userData));
        localStorage.setItem('constrix_wallet_type', walletType);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
      } catch (walletError) {
        console.log('Wallet connection failed, using mock auth for demo:', walletError);
        // Fallback to mock auth for demo
        const { mockAuth } = await import('@/lib/mockAuth');
        const { user: userData, token } = await mockAuth.login(walletType);
        
        localStorage.setItem('constrix_token', token);
        localStorage.setItem('constrix_user', JSON.stringify(userData));
        localStorage.setItem('constrix_wallet_type', walletType);
        setUser(userData);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
    
    localStorage.removeItem('constrix_token');
    localStorage.removeItem('constrix_user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};