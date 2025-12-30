'use client';

import React from 'react';
import { ArrowRightIcon, WalletIcon } from './icons';

interface CTAProps {
  onConnectWallet: () => void;
  isConnecting: boolean;
}

const CTA: React.FC<CTAProps> = ({ onConnectWallet, isConnecting }) => {
  return (
    <section className="section-padding bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container-custom text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Build Lasting Habits?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of users who are transforming their lives with 
            blockchain-verified consistency and earning real rewards.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={onConnectWallet}
              disabled={isConnecting}
              className="btn btn-secondary btn-lg group"
            >
              <WalletIcon className="w-6 h-6 mr-3" />
              {isConnecting ? 'Connecting...' : 'Get Started Now'}
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="mt-12 text-white/70 text-sm">
            No signup required • Connect with any Web3 wallet • Start earning immediately
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;