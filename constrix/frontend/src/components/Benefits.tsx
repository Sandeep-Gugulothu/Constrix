'use client';

import React from 'react';
import { CheckIcon } from './icons';

const Benefits: React.FC = () => {
  const benefits = [
    'Immutable streak records that can never be lost',
    'Transparent reward distribution with on-chain verification',
    'Portable reputation NFTs across the Very ecosystem',
    'Social accountability through Verychat integration',
    'Sustainable tokenomics with deflationary mechanisms',
    'Cross-platform habit verification and proof-of-action',
  ];

  return (
    <section id="benefits" className="section-padding bg-gray-900">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Why Choose
              <span className="block text-blue-400">Constrix?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Unlike traditional habit trackers, Constrix leverages blockchain technology 
              to create permanent, verifiable records of your consistency while rewarding 
              your dedication with real value.
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-300 text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-gray-300">Uptime Guarantee</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-300">Blockchain Security</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">0%</div>
                <div className="text-gray-300">Platform Fees</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">∞</div>
                <div className="text-gray-300">Data Permanence</div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;