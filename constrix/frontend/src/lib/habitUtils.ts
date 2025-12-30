import { BookOpen, Dumbbell, LucideIcon } from 'lucide-react';
import { Habit } from '@/hooks/useApi';

export interface HabitConfig {
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  glowColor: string;
}

export const HABIT_CONFIGS: Record<string, HabitConfig> = {
  study: { 
    name: 'Study', 
    icon: BookOpen, 
    color: 'emerald', 
    bgColor: 'bg-emerald-500', 
    glowColor: 'shadow-emerald-500/50' 
  },
  fitness: { 
    name: 'Fitness', 
    icon: Dumbbell, 
    color: 'red', 
    bgColor: 'bg-red-500', 
    glowColor: 'shadow-red-500/50' 
  }
};

export const getHabitConfig = (habitType: string): HabitConfig => {
  return HABIT_CONFIGS[habitType] || HABIT_CONFIGS.study;
};

export const isHabitCompletedToday = (habit: Habit): boolean => {
  if (!habit.lastCheckin) return false;
  const today = new Date().toDateString();
  const checkinDate = new Date(habit.lastCheckin).toDateString();
  return today === checkinDate;
};

export const getHabitDisplayName = (habit: Habit): string => {
  const config = getHabitConfig(habit.habitType);
  return config.name;
};

export const getHabitStreak = (habit: Habit): number => {
  return habit.currentStreak || 0;
};

export const getHabitProgress = (habit: Habit): number => {
  return (getHabitStreak(habit) / 30) * 100;
};