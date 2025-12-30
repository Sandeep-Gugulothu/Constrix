'use client';

import React from 'react';
import { ArrowRightIcon, WalletIcon } from './icons';

interface HeroProps {
  onConnectWallet: () => void;
  isConnecting: boolean;
}

const Hero: React.FC<HeroProps> = ({ onConnectWallet, isConnecting }) => {
  return (
    <section className="gradient-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="container-custom text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Build Habits That
            <span className="block bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              Last Forever
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your daily routines into verifiable on-chain achievements. 
            Earn VERY tokens, build portable reputation, and create lasting habits 
            with blockchain-verified consistency.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={onConnectWallet}
              disabled={isConnecting}
              className="btn btn-primary btn-lg group"
            >
              <WalletIcon className="w-6 h-6 mr-3" />
              {isConnecting ? 'Connecting Wallet...' : 'Start Building Habits'}
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="btn btn-secondary btn-lg">
              Watch Demo
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-white/80">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-sm uppercase tracking-wide">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">2.5M</div>
              <div className="text-sm uppercase tracking-wide">Habits Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500K</div>
              <div className="text-sm uppercase tracking-wide">VERY Earned</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;