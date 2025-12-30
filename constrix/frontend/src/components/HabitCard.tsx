import React from 'react';
import { Flame } from 'lucide-react';
import { Habit } from '@/hooks/useApi';
import { getHabitConfig, getHabitStreak, getHabitProgress } from '@/lib/habitUtils';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onComplete: (habitId: string, habitName: string) => void;
  onClick?: (habitId: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  isCompleted, 
  onComplete, 
  onClick 
}) => {
  const config = getHabitConfig(habit.habitType);
  const IconComponent = config.icon;
  const streak = getHabitStreak(habit);
  const streakProgress = getHabitProgress(habit);

  return (
    <div 
      className="flex flex-col items-center cursor-pointer group"
      onClick={() => onClick?.(habit._id)}
    >
      <div className="relative mb-4">
        <div className="w-24 h-24 rounded-2xl bg-slate-800/80 border-2 border-slate-700/50 flex items-center justify-center group-hover:border-indigo-500/50 transition-all duration-300 shadow-lg shadow-black/20">
          <IconComponent size={36} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
        </div>
        
        {/* Progress Ring */}
        <svg className="absolute inset-0 w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="44"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-slate-700/50"
          />
          <circle
            cx="48"
            cy="48"
            r="44"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - streakProgress / 100)}`}
            className={isCompleted ? "text-emerald-400" : "text-orange-400"}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Completion Indicator */}
        {isCompleted && (
          <div className="absolute -top-1 -right-1">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-center">
        <h4 className="text-white font-semibold text-sm mb-2 group-hover:text-indigo-400 transition-colors">
          {config.name}
        </h4>
        <p className="text-slate-400 text-xs mb-3 flex items-center justify-center gap-1">
          <Flame size={12} className="text-orange-400" />
          {streak} day streak
        </p>
        {!isCompleted && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onComplete(habit._id, config.name);
            }}
            className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-xs font-medium hover:bg-indigo-400 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:scale-105"
          >
            Complete
          </button>
        )}
      </div>
    </div>
  );
};