'use client';

import React from 'react';
import { Star, Zap, Crown, TrendingUp } from 'lucide-react';

interface LevelSystemProps {
  currentXP: number;
  currentLevel: number;
  showDetailed?: boolean;
}

const levelThresholds = [
  { level: 1, xp: 0, title: 'Beginner', color: 'slate', reward: 'Welcome Badge' },
  { level: 2, xp: 100, title: 'Novice', color: 'blue', reward: '50 $VERY' },
  { level: 3, xp: 250, title: 'Apprentice', color: 'green', reward: 'Streak Multiplier x1.2' },
  { level: 4, xp: 500, title: 'Practitioner', color: 'purple', reward: '100 $VERY' },
  { level: 5, xp: 1000, title: 'Expert', color: 'orange', reward: 'Custom Avatar' },
  { level: 6, xp: 1750, title: 'Master', color: 'red', reward: '250 $VERY' },
  { level: 7, xp: 2750, title: 'Grandmaster', color: 'yellow', reward: 'Exclusive NFT' },
  { level: 8, xp: 4000, title: 'Legend', color: 'pink', reward: '500 $VERY' },
  { level: 9, xp: 6000, title: 'Mythic', color: 'indigo', reward: 'VIP Status' },
  { level: 10, xp: 10000, title: 'Transcendent', color: 'yellow', reward: 'Hall of Fame' },
];

export default function LevelSystem({ currentXP, currentLevel, showDetailed = false }: LevelSystemProps) {
  const currentLevelData = levelThresholds.find(l => l.level === currentLevel) || levelThresholds[0];
  const nextLevelData = levelThresholds.find(l => l.level === currentLevel + 1);
  
  const xpInCurrentLevel = currentXP - currentLevelData.xp;
  const xpNeededForNext = nextLevelData ? nextLevelData.xp - currentLevelData.xp : 0;
  const progressPercent = nextLevelData ? (xpInCurrentLevel / xpNeededForNext) * 100 : 100;

  const getLevelColor = (color: string) => {
    const colors = {
      slate: 'from-slate-500 to-slate-600',
      blue: 'from-blue-500 to-blue-600',
      green: 'from-emerald-500 to-emerald-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
      yellow: 'from-yellow-500 to-orange-500',
      pink: 'from-pink-500 to-pink-600',
      indigo: 'from-indigo-500 to-indigo-600',
    };
    return colors[color as keyof typeof colors] || colors.slate;
  };

  const getLevelIcon = (level: number) => {
    if (level >= 8) return Crown;
    if (level >= 5) return Star;
    if (level >= 3) return Zap;
    return TrendingUp;
  };

  const LevelIcon = getLevelIcon(currentLevel);

  if (!showDetailed) {
    return (
      <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getLevelColor(currentLevelData.color)} flex items-center justify-center shadow-lg`}>
            <LevelIcon size={24} className="text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-white">Level {currentLevel}</span>
              <span className={`text-sm px-2 py-1 rounded-full bg-gradient-to-r ${getLevelColor(currentLevelData.color)} text-white`}>
                {currentLevelData.title}
              </span>
            </div>
            
            <div className="text-sm text-slate-400 mb-2">
              {currentXP.toLocaleString()} XP
              {nextLevelData && (
                <span> • {(nextLevelData.xp - currentXP).toLocaleString()} XP to next level</span>
              )}
            </div>
            
            {nextLevelData && (
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r ${getLevelColor(currentLevelData.color)} h-2 rounded-full transition-all duration-1000`}
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Level Display */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
        <div className="text-center mb-6">
          <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${getLevelColor(currentLevelData.color)} flex items-center justify-center shadow-2xl mb-4`}>
            <LevelIcon size={36} className="text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Level {currentLevel}</h2>
          <p className={`text-lg px-4 py-2 rounded-full bg-gradient-to-r ${getLevelColor(currentLevelData.color)} text-white inline-block`}>
            {currentLevelData.title}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{currentXP.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Total XP</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {nextLevelData ? (nextLevelData.xp - currentXP).toLocaleString() : '∞'}
            </div>
            <div className="text-sm text-slate-400">XP to Next</div>
          </div>
        </div>

        {nextLevelData && (
          <div>
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Progress to Level {nextLevelData.level}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3">
              <div 
                className={`bg-gradient-to-r ${getLevelColor(currentLevelData.color)} h-3 rounded-full transition-all duration-1000`}
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            <div className="text-center mt-3">
              <span className="text-sm text-slate-400">Next: </span>
              <span className={`text-sm font-medium bg-gradient-to-r ${getLevelColor(nextLevelData.color)} bg-clip-text text-transparent`}>
                {nextLevelData.title}
              </span>
              <span className="text-sm text-slate-400"> • Reward: {nextLevelData.reward}</span>
            </div>
          </div>
        )}
      </div>

      {/* Level Progression Chart */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Level Progression</h3>
        <div className="space-y-3">
          {levelThresholds.slice(0, 8).map((level, index) => {
            const isCurrentLevel = level.level === currentLevel;
            const isCompleted = currentLevel > level.level;
            const isNext = level.level === currentLevel + 1;
            
            return (
              <div 
                key={level.level}
                className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                  isCurrentLevel ? `bg-gradient-to-r ${getLevelColor(level.color)}/20 border border-${level.color}-500/30` :
                  isCompleted ? 'bg-slate-800/50' :
                  isNext ? 'bg-slate-800/30 border border-slate-600' :
                  'bg-slate-800/20 opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted || isCurrentLevel 
                    ? `bg-gradient-to-br ${getLevelColor(level.color)}` 
                    : 'bg-slate-700'
                }`}>
                  <span className="text-white font-bold text-sm">{level.level}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${
                      isCurrentLevel ? 'text-white' :
                      isCompleted ? 'text-slate-300' :
                      'text-slate-500'
                    }`}>
                      {level.title}
                    </span>
                    {isCurrentLevel && (
                      <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className={`text-sm ${
                    isCurrentLevel ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {level.xp.toLocaleString()} XP • {level.reward}
                  </div>
                </div>
                
                {isCompleted && (
                  <div className="text-emerald-400">
                    <Star size={16} className="fill-current" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* XP Sources */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">How to Earn XP</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-300">Daily Check-in</span>
              <span className="text-emerald-400 font-medium">+10 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">7-day Streak</span>
              <span className="text-emerald-400 font-medium">+50 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">30-day Streak</span>
              <span className="text-emerald-400 font-medium">+200 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Challenge Win</span>
              <span className="text-emerald-400 font-medium">+100 XP</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-300">Share Achievement</span>
              <span className="text-emerald-400 font-medium">+5 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Help Friend</span>
              <span className="text-emerald-400 font-medium">+15 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Perfect Week</span>
              <span className="text-emerald-400 font-medium">+75 XP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Badge Earned</span>
              <span className="text-emerald-400 font-medium">+25 XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}