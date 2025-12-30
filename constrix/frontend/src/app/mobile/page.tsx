'use client';

import React from 'react';
import { ArrowLeft, Smartphone, Download, Code, Zap, Shield, Users, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function MobilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Code className="w-4 h-4 mr-2" />
            IN DEVELOPMENT
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Constrix
            </span>
            <br />
            <span className="text-3xl md:text-4xl text-white/80">Mobile App</span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
            Take your habit tracking on-the-go with our React Native mobile application. 
            Built with Wepin SDK for seamless Web3 integration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              disabled
              className="bg-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold flex items-center justify-center cursor-not-allowed"
            >
              <Download className="w-5 h-5 mr-2" />
              Coming to App Store
            </button>
            <button 
              disabled
              className="bg-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold flex items-center justify-center cursor-not-allowed"
            >
              <Download className="w-5 h-5 mr-2" />
              Coming to Google Play
            </button>
          </div>
        </div>

        {/* Development Status */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Development Progress</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">✅ Completed</h3>
              <div className="space-y-3">
                <div className="flex items-center text-green-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  React Native + Expo foundation
                </div>
                <div className="flex items-center text-green-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Wepin SDK integration
                </div>
                <div className="flex items-center text-green-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Core UI components
                </div>
                <div className="flex items-center text-green-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Navigation structure
                </div>
                <div className="flex items-center text-green-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  API service layer
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">🚧 In Progress</h3>
              <div className="space-y-3">
                <div className="flex items-center text-yellow-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  Habit creation & management
                </div>
                <div className="flex items-center text-yellow-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  Streak visualization
                </div>
                <div className="flex items-center text-yellow-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  Push notifications
                </div>
                <div className="flex items-center text-yellow-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  Offline support
                </div>
                <div className="flex items-center text-yellow-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  Web3 wallet integration
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-500/20 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-blue-400 mr-3" />
              <h4 className="text-lg font-semibold text-white">Current Status: 60% Complete</h4>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{width: '60%'}}></div>
            </div>
            <p className="text-white/70 mt-3">
              Expected beta release: Q2 2026 • Full release: Q3 2026
            </p>
          </div>
        </div>

        {/* App Screenshots Placeholder */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">App Preview</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 rounded-xl p-6 text-center">
              <div className="bg-gray-700 rounded-lg h-96 mb-4 flex items-center justify-center">
                <Smartphone className="w-16 h-16 text-gray-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">Welcome Screen</h3>
              <p className="text-white/60 text-sm">Onboarding with wallet connection</p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 text-center">
              <div className="bg-gray-700 rounded-lg h-96 mb-4 flex items-center justify-center">
                <Smartphone className="w-16 h-16 text-gray-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">Habit Dashboard</h3>
              <p className="text-white/60 text-sm">Track your daily habits and streaks</p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 text-center">
              <div className="bg-gray-700 rounded-lg h-96 mb-4 flex items-center justify-center">
                <Smartphone className="w-16 h-16 text-gray-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">Progress Analytics</h3>
              <p className="text-white/60 text-sm">Visualize your consistency journey</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-white/60">
              📸 Screenshots will be updated as development progresses
            </p>
          </div>
        </div>

        {/* Planned Features */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Planned Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-purple-500/20 rounded-xl p-6 text-center">
              <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Secure Wallet</h3>
              <p className="text-white/60 text-sm">Wepin SDK integration for mobile Web3</p>
            </div>

            <div className="bg-blue-500/20 rounded-xl p-6 text-center">
              <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Real-time Sync</h3>
              <p className="text-white/60 text-sm">Seamless sync with web dashboard</p>
            </div>

            <div className="bg-green-500/20 rounded-xl p-6 text-center">
              <Trophy className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Achievements</h3>
              <p className="text-white/60 text-sm">Milestone celebrations and NFT badges</p>
            </div>

            <div className="bg-pink-500/20 rounded-xl p-6 text-center">
              <Users className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Social Features</h3>
              <p className="text-white/60 text-sm">Share progress via VeryChat</p>
            </div>
          </div>
        </div>

        {/* Technical Stack */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Technical Stack</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Frontend</h3>
              <ul className="space-y-2 text-white/70">
                <li>• React Native with Expo</li>
                <li>• TypeScript for type safety</li>
                <li>• Native navigation</li>
                <li>• Async storage for offline data</li>
                <li>• Push notifications</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Web3 Integration</h3>
              <ul className="space-y-2 text-white/70">
                <li>• Wepin SDK for wallet management</li>
                <li>• ethers.js for blockchain interaction</li>
                <li>• Verychain network support</li>
                <li>• Smart contract integration</li>
                <li>• VERY token transactions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}