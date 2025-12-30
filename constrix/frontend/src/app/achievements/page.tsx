'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Star, Target, Users } from 'lucide-react';
import BadgeDisplay, { badges } from '@/components/BadgeDisplay';
import LevelSystem from '@/components/LevelSystem';

export default function AchievementsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'levels'>('overview');
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

  // Mock user progress data
  const userProgress = {
    currentXP: 1420,
    currentLevel: 4,
    totalBadges: 3,
    completedChallenges: 2,
    totalStreakDays: 28,
    longestStreak: 18
  };

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
                <h1 className="text-2xl font-bold text-white">Achievements</h1>
                <p className="text-sm text-slate-400">Track your progress and unlock rewards</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-lg font-bold text-white">{userProgress.currentXP.toLocaleString()} XP</div>
                <div className="text-sm text-slate-400">Level {userProgress.currentLevel}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-900 p-1 rounded-xl mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'badges', label: 'Badges', icon: Star },
            { id: 'levels', label: 'Levels', icon: Trophy },
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
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <Trophy size={20} className="text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{userProgress.totalBadges}</div>
                    <div className="text-sm text-slate-400">Badges Earned</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Star size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{userProgress.currentLevel}</div>
                    <div className="text-sm text-slate-400">Current Level</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <Target size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{userProgress.longestStreak}</div>
                    <div className="text-sm text-slate-400">Longest Streak</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Users size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{userProgress.completedChallenges}</div>
                    <div className="text-sm text-slate-400">Challenges Won</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Level Progress */}
            <LevelSystem 
              currentXP={userProgress.currentXP} 
              currentLevel={userProgress.currentLevel} 
            />

            {/* Recent Badges Preview */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Recent Achievements</h3>
                <button 
                  onClick={() => setActiveTab('badges')}
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                >
                  View All Badges
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.filter(badge => badge.earned).slice(0, 4).map(badge => {
                  const Icon = badge.icon;
                  return (
                    <div key={badge.id} className="bg-slate-800/50 rounded-xl p-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                        <Icon size={24} className="text-white" />
                      </div>
                      <h4 className="font-semibold text-white text-sm mb-1">{badge.name}</h4>
                      <p className="text-xs text-slate-400">{badge.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">This Week's Progress</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">XP Earned</span>
                    <span className="text-emerald-400 font-medium">+180 XP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Habits Completed</span>
                    <span className="text-emerald-400 font-medium">12/15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Streak Days</span>
                    <span className="text-emerald-400 font-medium">+7 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Badges Earned</span>
                    <span className="text-emerald-400 font-medium">1 new</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Next Goals</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Star size={16} className="text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">Fortnight Focus Badge</div>
                      <div className="text-xs text-slate-400">2 more days for 14-day streak</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Trophy size={16} className="text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">Level 5: Expert</div>
                      <div className="text-xs text-slate-400">580 XP needed</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Users size={16} className="text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">Social Butterfly</div>
                      <div className="text-xs text-slate-400">3 more achievement shares</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <BadgeDisplay badges={badges} showAll={true} />
        )}

        {activeTab === 'levels' && (
          <LevelSystem 
            currentXP={userProgress.currentXP} 
            currentLevel={userProgress.currentLevel} 
            showDetailed={true}
          />
        )}
      </main>
    </div>
  );
}