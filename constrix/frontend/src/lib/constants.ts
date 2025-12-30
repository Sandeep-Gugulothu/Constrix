import { HabitType } from '../types/shared';

export const HABIT_CONFIGS = {
  [HabitType.STUDY]: {
    name: 'Study',
    icon: '📚',
    description: 'Daily learning and skill development',
    color: '#3B82F6'
  },
  [HabitType.FITNESS]: {
    name: 'Fitness',
    icon: '💪',
    description: 'Physical exercise and health',
    color: '#10B981'
  }
};

export const MILESTONE_REWARDS = {
  7: 100,   // 100 VERY for 7-day streak
  14: 180,  // 180 VERY for 14-day streak
  30: 300,  // 300 VERY for 30-day streak
  60: 480,  // 480 VERY for 60-day streak
  100: 700, // 700 VERY for 100-day streak
  365: 2000 // 2000 VERY for 365-day streak
};

export const MILESTONE_DAYS = Object.keys(MILESTONE_REWARDS).map(Number);