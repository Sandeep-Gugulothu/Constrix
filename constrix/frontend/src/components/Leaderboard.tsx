'use client';

import React, { useState } from 'react';
import { Crown, Flame, Trophy, Medal, Award, Users } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  username: string;
  walletAddress: string;
  totalStreak: number;
  weeklyPoints: number;
  avatar: string;
  badges: number;
  rank: number;
}

const mockUsers: LeaderboardUser[] = [
  { id: '1', username: 'alex.eth', walletAddress: '0x1234...5678', totalStreak: 45, weeklyPoints: 850, avatar: 'AX', badges: 8, rank: 1 },
  { id: '2', username: 'sarah_builds', walletAddress: '0x2345...6789', totalStreak: 38, weeklyPoints: 720, avatar: 'SB', badges: 6, rank: 2 },
  { id: '3', username: 'crypto_dev', walletAddress: '0x3456...7890', totalStreak: 31, weeklyPoints: 680, avatar: 'CD', badges: 5, rank: 3 },
  { id: '4', username: 'you', walletAddress: '0x4567...8901', totalStreak: 28, weeklyPoints: 620, avatar: 'YU', badges: 4, rank: 4 },
  { id: '5', username: 'habit_master', walletAddress: '0x5678...9012', totalStreak: 25, weeklyPoints: 580, avatar: 'HM', badges: 4, rank: 5 },
  { id: '6', username: 'daily_grind', walletAddress: '0x6789...0123', totalStreak: 22, weeklyPoints: 540, avatar: 'DG', badges: 3, rank: 6 },
  { id: '7', username: 'streak_king', walletAddress: '0x7890...1234', totalStreak: 19, weeklyPoints: 480, avatar: 'SK', badges: 3, rank: 7 },
  { id: '8', username: 'consistency_queen', walletAddress: '0x8901...2345', totalStreak: 16, weeklyPoints: 420, avatar: 'CQ', badges: 2, rank: 8 },
];

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');
  const [category, setCategory] = useState<'all' | 'study' | 'fitness'>('all');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="text-yellow-400" size={20} />;
      case 2: return <Medal className="text-gray-400" size={20} />;
      case 3: return <Award className="text-amber-600" size={20} />;
      default: return <span className="text-slate-400 font-bold">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 2: return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-500/30';
      case 3: return 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30';
      default: return 'bg-slate-800/50 border-slate-700/50';
    }
  };

  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Trophy size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Leaderboard</h3>
            <p className="text-sm text-slate-400">Compete with the community</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-slate-300"
          >
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="alltime">All Time</option>
          </select>
          
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-slate-300"
          >
            <option value="all">All Habits</option>
            <option value="study">Study</option>
            <option value="fitness">Fitness</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {mockUsers.slice(0, 8).map((user, index) => (
          <div 
            key={user.id}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.02] ${getRankBg(user.rank)} ${
              user.username === 'you' ? 'ring-2 ring-indigo-500/50' : ''
            }`}
          >
            <div className="flex items-center justify-center w-8">
              {getRankIcon(user.rank)}
            </div>
            
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
              {user.avatar}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{user.username}</span>
                {user.username === 'you' && (
                  <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-full">You</span>
                )}
              </div>
              <div className="text-sm text-slate-400">
                {user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-6)}
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-1 text-orange-400 mb-1">
                <Flame size={16} />
                <span className="font-bold text-white">{user.totalStreak}</span>
              </div>
              <div className="text-xs text-slate-400">{user.weeklyPoints} pts</div>
            </div>
            
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-amber-400">{user.badges}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Users size={16} />
          <span>2,847 active users this week</span>
        </div>
        <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
          View Full Rankings
        </button>
      </div>
    </div>
  );
}