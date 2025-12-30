'use client';

import React from 'react';
import { WalletIcon, TargetIcon, ChartIcon, TrophyIcon } from './icons';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: WalletIcon,
      title: 'Connect Wallet',
      description: 'Link your MetaMask or compatible Web3 wallet to get started with secure, decentralized authentication.',
      step: '01',
    },
    {
      icon: TargetIcon,
      title: 'Create Habits',
      description: 'Choose from study or fitness habits and set your daily commitment goals with customizable parameters.',
      step: '02',
    },
    {
      icon: ChartIcon,
      title: 'Track Progress',
      description: 'Check in daily to maintain your streaks and watch your consistency build over time with detailed analytics.',
      step: '03',
    },
    {
      icon: TrophyIcon,
      title: 'Earn Rewards',
      description: 'Reach milestones to earn VERY tokens and mint achievement NFTs that prove your dedication.',
      step: '04',
    },
  ];

  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How Constrix Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A simple four-step process to transform your daily routines into 
            verifiable achievements with real rewards.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 transform -translate-y-1/2"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center relative">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-xl font-bold mb-6 relative z-10">
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;