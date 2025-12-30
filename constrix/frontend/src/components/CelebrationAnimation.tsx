'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Star, Flame, Zap, Crown, Sparkles } from 'lucide-react';

interface CelebrationProps {
  type: 'milestone' | 'badge' | 'levelup' | 'streak' | 'challenge';
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
  color?: string;
  onComplete: () => void;
  duration?: number;
}

export default function CelebrationAnimation({ 
  type, 
  title, 
  subtitle, 
  icon, 
  color = 'emerald',
  onComplete, 
  duration = 3000 
}: CelebrationProps) {
  const [stage, setStage] = useState<'enter' | 'celebrate' | 'exit'>('enter');
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 1000
    }));
    setParticles(newParticles);

    // Animation sequence
    const timer1 = setTimeout(() => setStage('celebrate'), 200);
    const timer2 = setTimeout(() => setStage('exit'), duration - 500);
    const timer3 = setTimeout(onComplete, duration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [duration, onComplete]);

  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'milestone': return Trophy;
      case 'badge': return Star;
      case 'levelup': return Crown;
      case 'streak': return Flame;
      case 'challenge': return Zap;
      default: return Trophy;
    }
  };

  const getColors = () => {
    const colorMap = {
      emerald: {
        bg: 'from-emerald-400 to-emerald-600',
        glow: 'shadow-emerald-500/50',
        particle: 'bg-emerald-400'
      },
      blue: {
        bg: 'from-blue-400 to-blue-600',
        glow: 'shadow-blue-500/50',
        particle: 'bg-blue-400'
      },
      purple: {
        bg: 'from-purple-400 to-purple-600',
        glow: 'shadow-purple-500/50',
        particle: 'bg-purple-400'
      },
      yellow: {
        bg: 'from-yellow-400 to-orange-500',
        glow: 'shadow-yellow-500/50',
        particle: 'bg-yellow-400'
      },
      red: {
        bg: 'from-red-400 to-red-600',
        glow: 'shadow-red-500/50',
        particle: 'bg-red-400'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.emerald;
  };

  const Icon = getIcon();
  const colors = getColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute w-2 h-2 ${colors.particle} rounded-full animate-bounce opacity-80`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}ms`,
            animationDuration: '2s'
          }}
        />
      ))}

      {/* Main celebration content */}
      <div className={`text-center transform transition-all duration-500 ${
        stage === 'enter' ? 'scale-50 opacity-0' :
        stage === 'celebrate' ? 'scale-100 opacity-100' :
        'scale-110 opacity-0'
      }`}>
        
        {/* Icon with glow effect */}
        <div className={`relative mx-auto mb-6 ${
          stage === 'celebrate' ? 'animate-pulse' : ''
        }`}>
          <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-2xl ${colors.glow}`}>
            <Icon size={64} className="text-white" />
          </div>
          
          {/* Sparkle effects */}
          <div className="absolute -top-2 -right-2">
            <Sparkles size={24} className="text-yellow-400 animate-spin" />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <Sparkles size={20} className="text-yellow-400 animate-spin" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-white animate-bounce">
            {title}
          </h2>
          
          {subtitle && (
            <p className="text-xl text-slate-300 animate-fade-in">
              {subtitle}
            </p>
          )}

          {/* Achievement type badge */}
          <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${colors.bg} text-white font-medium text-sm`}>
            {type.charAt(0).toUpperCase() + type.slice(1)} Unlocked!
          </div>
        </div>

        {/* Animated rings */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 rounded-full border-4 border-white/20 animate-ping ${
            stage === 'celebrate' ? 'opacity-100' : 'opacity-0'
          }`} />
          <div className={`absolute inset-4 rounded-full border-2 border-white/10 animate-ping ${
            stage === 'celebrate' ? 'opacity-100' : 'opacity-0'
          }`} style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      {/* Fireworks effect */}
      {stage === 'celebrate' && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 ${colors.particle} rounded-full animate-ping`}
              style={{
                left: `${20 + (i * 10)}%`,
                top: `${20 + (i % 3) * 20}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Streak celebration component
interface StreakCelebrationProps {
  streakDays: number;
  habitName: string;
  onComplete: () => void;
}

export function StreakCelebration({ streakDays, habitName, onComplete }: StreakCelebrationProps) {
  const getMilestoneData = (days: number) => {
    if (days >= 100) return { color: 'yellow', title: '🔥 LEGENDARY STREAK! 🔥', subtitle: `${days} days of ${habitName}!` };
    if (days >= 30) return { color: 'purple', title: '🎉 MONTHLY MASTER! 🎉', subtitle: `${days} days strong!` };
    if (days >= 14) return { color: 'blue', title: '💪 TWO WEEKS! 💪', subtitle: `Fortnight of ${habitName}!` };
    if (days >= 7) return { color: 'emerald', title: '🚀 WEEK WARRIOR! 🚀', subtitle: `7 days of consistency!` };
    return { color: 'emerald', title: '✨ STREAK STARTED! ✨', subtitle: `Day ${days} of ${habitName}!` };
  };

  const milestoneData = getMilestoneData(streakDays);

  return (
    <CelebrationAnimation
      type="streak"
      title={milestoneData.title}
      subtitle={milestoneData.subtitle}
      color={milestoneData.color}
      icon={Flame}
      onComplete={onComplete}
      duration={4000}
    />
  );
}

// Level up celebration component
interface LevelUpCelebrationProps {
  newLevel: number;
  levelTitle: string;
  reward: string;
  onComplete: () => void;
}

export function LevelUpCelebration({ newLevel, levelTitle, reward, onComplete }: LevelUpCelebrationProps) {
  return (
    <CelebrationAnimation
      type="levelup"
      title={`LEVEL ${newLevel}!`}
      subtitle={`You are now a ${levelTitle}! Reward: ${reward}`}
      color="yellow"
      icon={Crown}
      onComplete={onComplete}
      duration={5000}
    />
  );
}

// Badge earned celebration component
interface BadgeEarnedCelebrationProps {
  badgeName: string;
  badgeDescription: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  onComplete: () => void;
}

export function BadgeEarnedCelebration({ badgeName, badgeDescription, rarity, onComplete }: BadgeEarnedCelebrationProps) {
  const rarityColors = {
    common: 'emerald',
    rare: 'blue',
    epic: 'purple',
    legendary: 'yellow'
  };

  return (
    <CelebrationAnimation
      type="badge"
      title={`${badgeName} EARNED!`}
      subtitle={badgeDescription}
      color={rarityColors[rarity]}
      icon={Star}
      onComplete={onComplete}
      duration={4000}
    />
  );
}