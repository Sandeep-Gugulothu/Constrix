'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Trophy, MessageSquare, Zap } from 'lucide-react';
import Leaderboard from '@/components/Leaderboard';
import SocialFeed from '@/components/SocialFeed';
import FriendChallenges from '@/components/FriendChallenges';

export default function SocialPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard' | 'challenges'>('feed');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/');
    }
  }, [mounted, user, router]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-slate-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Social Hub</h1>
                <p className="text-sm text-slate-400">Connect with the Constrix community</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-300">2,847 online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-900 p-1 rounded-xl mb-8">
          {[
            { id: 'feed', label: 'Community Feed', icon: MessageSquare },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
            { id: 'challenges', label: 'Challenges', icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-500 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {activeTab === 'feed' && (
            <>
              <div className="lg:col-span-2">
                <SocialFeed />
              </div>
              <div className="space-y-6">
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Your Rank</span>
                      <span className="text-white font-medium">#4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Streaks</span>
                      <span className="text-white font-medium">28 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Friends</span>
                      <span className="text-white font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Challenges Won</span>
                      <span className="text-white font-medium">3</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Trending Habits</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-blue-400 text-sm font-bold">1</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">Study Solidity</div>
                        <div className="text-xs text-slate-400">847 active users</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-red-400 text-sm font-bold">2</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">Daily Fitness</div>
                        <div className="text-xs text-slate-400">623 active users</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-emerald-400 text-sm font-bold">3</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">Read Daily</div>
                        <div className="text-xs text-slate-400">445 active users</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'leaderboard' && (
            <>
              <div className="lg:col-span-2">
                <Leaderboard />
              </div>
              <div className="space-y-6">
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Your Performance</h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-400 mb-1">#4</div>
                      <div className="text-sm text-slate-400">Current Rank</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-white">620</div>
                        <div className="text-xs text-slate-400">Weekly Points</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-white">28</div>
                        <div className="text-xs text-slate-400">Total Streak</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-emerald-400 mb-2">↑ Moved up 2 ranks this week!</div>
                      <div className="text-xs text-slate-500">Keep it up to reach top 3</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Hall of Fame</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-yellow-500/10 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Trophy size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">alex.eth</div>
                        <div className="text-xs text-yellow-400">100-day streak champion</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-purple-500/10 rounded-lg">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <Users size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">sarah_builds</div>
                        <div className="text-xs text-purple-400">Most challenges won</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'challenges' && (
            <>
              <div className="lg:col-span-2">
                <FriendChallenges />
              </div>
              <div className="space-y-6">
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Your Challenges</h3>
                  <div className="space-y-3">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">7-Day Coding Sprint</span>
                        <span className="text-xs text-emerald-400">Rank #2</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{width: '71%'}}></div>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">71% complete • 2 days left</div>
                    </div>
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">Study Streak Masters</span>
                        <span className="text-xs text-blue-400">Rank #3</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">85% complete • Completed</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Challenge Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Challenges Joined</span>
                      <span className="text-white font-medium">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Challenges Won</span>
                      <span className="text-white font-medium">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Win Rate</span>
                      <span className="text-emerald-400 font-medium">37.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">$VERY Earned</span>
                      <span className="text-yellow-400 font-medium">2,250</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}