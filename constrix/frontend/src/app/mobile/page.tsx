'use client';

import React from 'react';
import { ArrowLeft, Smartphone, Download, Code, Zap, Shield, Users, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function MobilePage() {
  return (
    <div className="min-h-screen bg-slate-950">
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
          <div className="inline-flex items-center bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Code className="w-4 h-4 mr-2" />
            IN DEVELOPMENT
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
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
              className="bg-slate-700 text-slate-400 px-8 py-4 rounded-xl font-semibold flex items-center justify-center cursor-not-allowed border border-slate-600"
            >
              <Download className="w-5 h-5 mr-2" />
              Coming to App Store
            </button>
            <button 
              disabled
              className="bg-slate-700 text-slate-400 px-8 py-4 rounded-xl font-semibold flex items-center justify-center cursor-not-allowed border border-slate-600"
            >
              <Download className="w-5 h-5 mr-2" />
              Coming to Google Play
            </button>
          </div>
        </div>

        {/* Development Status */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 mb-16">
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

          <div className="mt-8 bg-indigo-500/20 border border-indigo-500/20 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-indigo-400 mr-3" />
              <h4 className="text-lg font-semibold text-white">Current Status: 60% Complete</h4>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3">
              <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-3 rounded-full" style={{width: '60%'}}></div>
            </div>
            <p className="text-white/70 mt-3">
              Expected beta release: Q2 2026 • Full release: Q3 2026
            </p>
          </div>
        </div>

        {/* App Screenshots Placeholder */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">App Preview</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 rounded-xl p-6 text-center">
              <div className="bg-slate-700 rounded-lg h-96 mb-4 flex items-center justify-center">
                <Smartphone className="w-16 h-16 text-slate-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">Welcome Screen</h3>
              <p className="text-white/60 text-sm">Onboarding with wallet connection</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 text-center">
              <div className="bg-slate-700 rounded-lg h-96 mb-4 flex items-center justify-center">
                <Smartphone className="w-16 h-16 text-slate-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">Habit Dashboard</h3>
              <p className="text-white/60 text-sm">Track your daily habits and streaks</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 text-center">
              <div className="bg-slate-700 rounded-lg h-96 mb-4 flex items-center justify-center">
                <Smartphone className="w-16 h-16 text-slate-500" />
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
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Planned Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-indigo-500/20 border border-indigo-500/20 rounded-xl p-6 text-center">
              <Shield className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Secure Wallet</h3>
              <p className="text-white/60 text-sm">Wepin SDK integration for mobile Web3</p>
            </div>

            <div className="bg-indigo-500/20 border border-indigo-500/20 rounded-xl p-6 text-center">
              <Zap className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Real-time Sync</h3>
              <p className="text-white/60 text-sm">Seamless sync with web dashboard</p>
            </div>

            <div className="bg-emerald-500/20 border border-emerald-500/20 rounded-xl p-6 text-center">
              <Trophy className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Achievements</h3>
              <p className="text-white/60 text-sm">Milestone celebrations and NFT badges</p>
            </div>

            <div className="bg-violet-500/20 border border-violet-500/20 rounded-xl p-6 text-center">
              <Users className="w-12 h-12 text-violet-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Social Features</h3>
              <p className="text-white/60 text-sm">Share progress via VeryChat</p>
            </div>
          </div>
        </div>

        {/* Technical Stack */}
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-8">
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