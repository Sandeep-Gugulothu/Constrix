'use client';

import React from 'react';
import { TargetIcon, ChartIcon, ShieldIcon, TrophyIcon, BlockchainIcon, WalletIcon } from './icons';

const Features: React.FC = () => {
  const features = [
    {
      icon: TargetIcon,
      title: 'Habit Tracking',
      description: 'Simple daily check-ins for study and fitness habits with intelligent streak calculation and progress visualization.',
    },
    {
      icon: ChartIcon,
      title: 'Progress Analytics',
      description: 'Comprehensive insights into your consistency patterns with detailed charts and milestone tracking.',
    },
    {
      icon: ShieldIcon,
      title: 'Blockchain Verified',
      description: 'Immutable streak records on Verychain ensure your progress can never be lost or manipulated.',
    },
    {
      icon: TrophyIcon,
      title: 'Achievement NFTs',
      description: 'Earn soulbound NFTs for major milestones that serve as portable reputation across the Very ecosystem.',
    },
    {
      icon: BlockchainIcon,
      title: 'VERY Token Rewards',
      description: 'Transparent reward distribution with decreasing curves that incentivize long-term consistency over resets.',
    },
    {
      icon: WalletIcon,
      title: 'Wallet Integration',
      description: 'Seamless Web3 authentication with MetaMask and other popular wallets for secure, decentralized access.',
    },
  ];

  return (
    <section id="features" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="block text-blue-600">Lasting Change</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built on cutting-edge blockchain technology to make habit formation 
            engaging, accountable, and genuinely rewarding.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index} 
                className="card group hover:scale-105 transition-transform duration-200"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-200">
                  <IconComponent className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-200" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;