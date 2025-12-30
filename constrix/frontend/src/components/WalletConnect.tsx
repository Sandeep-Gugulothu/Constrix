'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { WalletIcon } from './icons';

const WalletConnect: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      await login('metamask'); // Default to MetaMask
    } catch (error: any) {
      alert(error.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading || connecting}
      className="btn btn-primary btn-lg"
    >
      {connecting ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
      ) : (
        <WalletIcon className="w-5 h-5 mr-3" />
      )}
      {connecting ? 'Connecting Wallet...' : 'Connect Wallet'}
    </button>
  );
};

export default WalletConnect;