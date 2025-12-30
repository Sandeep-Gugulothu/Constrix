'use client';

import React from 'react';
import { WalletIcon } from './icons';

interface HeaderProps {
  onConnectWallet: () => void;
  isConnecting: boolean;
}

const Header: React.FC<HeaderProps> = ({ onConnectWallet, isConnecting }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="container-custom flex items-center justify-between py-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-2xl font-bold text-white">Constrix</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">How it Works</a>
          <a href="#benefits" className="text-white/80 hover:text-white transition-colors">Benefits</a>
        </div>
        
        <button
          onClick={onConnectWallet}
          disabled={isConnecting}
          className="btn btn-secondary btn-lg"
        >
          <WalletIcon className="w-5 h-5 mr-2" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </nav>
    </header>
  );
};

export default Header;