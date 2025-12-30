'use client';

import React from 'react';
import { Flame, Trophy, Zap, Crown, Star, Target, Calendar, Award } from 'lucide-react';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'streak' | 'milestone' | 'social' | 'special';
  requirement: string;
  earned: boolean;
  earnedDate?: Date;
  progress?: number;
  maxProgress?: number;
}

const badges: Badge[] = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Complete your first habit check-in',
    icon: Target,
    rarity: 'common',
    category: 'milestone',
    requirement: '1 check-in',
    earned: true,
    earnedDate: new Date('2024-12-15')
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: Flame,
    rarity: 'common',
    category: 'streak',
    requirement: '7-day streak',
    earned: true,
    earnedDate: new Date('2024-12-18')
  },
  {
    id: 'fortnight_focus',
    name: 'Fortnight Focus',
    description: 'Achieve a 14-day streak',
    icon: Zap,
    rarity: 'rare',
    category: 'streak',
    requirement: '14-day streak',
    earned: false,
    progress: 12,
    maxProgress: 14
  },
  {
    id: 'monthly_master',
    name: 'Monthly Master',
    description: 'Complete 30 consecutive days',
    icon: Calendar,
    rarity: 'epic',
    category: 'streak',
    requirement: '30-day streak',
    earned: false,
    progress: 12,
    maxProgress: 30
  },
  {
    id: 'century_club',
    name: 'Century Club',
    description: 'Reach the legendary 100-day streak',
    icon: Crown,
    rarity: 'legendary',
    category: 'streak',
    requirement: '100-day streak',
    earned: false,
    progress: 12,
    maxProgress: 100
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete 10 tasks before 8 AM',
    icon: Star,
    rarity: 'rare',
    category: 'special',
    requirement: '10 early completions',
    earned: true,
    earnedDate: new Date('2024-12-20')
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Share 5 achievements with friends',
    icon: Award,
    rarity: 'rare',
    category: 'social',
    requirement: '5 shares',
    earned: false,
    progress: 2,
    maxProgress: 5
  },
  {
    id: 'challenge_champion',
    name: 'Challenge Champion',
    description: 'Win your first community challenge',
    icon: Trophy,
    rarity: 'epic',
    category: 'social',
    requirement: 'Win 1 challenge',
    earned: false,
    progress: 0,
    maxProgress: 1
  }
];

interface BadgeDisplayProps {
  badges: Badge[];
  showAll?: boolean;
}

export default function BadgeDisplay({ badges: propBadges, showAll = false }: BadgeDisplayProps) {
  const displayBadges = propBadges || badges;
  const earnedBadges = displayBadges.filter(badge => badge.earned);
  const inProgressBadges = displayBadges.filter(badge => !badge.earned && badge.progress !== undefined);
  const lockedBadges = displayBadges.filter(badge => !badge.earned && badge.progress === undefined);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-slate-500 to-slate-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-orange-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-slate-500/50';
      case 'rare': return 'border-blue-500/50';
      case 'epic': return 'border-purple-500/50';
      case 'legendary': return 'border-yellow-500/50';
      default: return 'border-slate-500/50';
    }
  };

  const BadgeCard = ({ badge }: { badge: Badge }) => {
    const Icon = badge.icon;
    const isEarned = badge.earned;
    const hasProgress = badge.progress !== undefined && badge.maxProgress !== undefined;
    const progressPercent = hasProgress ? (badge.progress! / badge.maxProgress!) * 100 : 0;

    return (
      <div className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 ${
        isEarned 
          ? `bg-gradient-to-br ${getRarityColor(badge.rarity)} ${getRarityBorder(badge.rarity)} shadow-lg`
          : 'bg-slate-800/50 border-slate-700/50 opacity-60'
      }`}>
        {/* Rarity Indicator */}
        <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          badge.rarity === 'legendary' ? 'bg-yellow-500 text-black' :
          badge.rarity === 'epic' ? 'bg-purple-500 text-white' :
          badge.rarity === 'rare' ? 'bg-blue-500 text-white' :
          'bg-slate-500 text-white'
        }`}>
          {badge.rarity === 'legendary' ? '★' : 
           badge.rarity === 'epic' ? '◆' :
           badge.rarity === 'rare' ? '●' : '○'}
        </div>

        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
            isEarned ? 'bg-white/20' : 'bg-slate-700'
          }`}>
            <Icon size={28} className={isEarned ? 'text-white' : 'text-slate-500'} />
          </div>
          
          <h4 className={`font-bold text-sm mb-1 ${isEarned ? 'text-white' : 'text-slate-400'}`}>
            {badge.name}
          </h4>
          
          <p className={`text-xs mb-2 ${isEarned ? 'text-white/80' : 'text-slate-500'}`}>
            {badge.description}
          </p>
          
          <div className={`text-xs ${isEarned ? 'text-white/60' : 'text-slate-600'}`}>
            {badge.requirement}
          </div>

          {/* Progress Bar for In-Progress Badges */}
          {hasProgress && !isEarned && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Progress</span>
                <span>{badge.progress}/{badge.maxProgress}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Earned Date */}
          {isEarned && badge.earnedDate && (
            <div className="text-xs text-white/60 mt-2">
              Earned {badge.earnedDate.toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Trophy size={20} className="text-yellow-400" />
            Earned Badges ({earnedBadges.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {earnedBadges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}

      {/* In Progress Badges */}
      {inProgressBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap size={20} className="text-blue-400" />
            In Progress ({inProgressBadges.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {inProgressBadges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {showAll && lockedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Award size={20} className="text-slate-400" />
            Locked ({lockedBadges.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {lockedBadges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { badges };