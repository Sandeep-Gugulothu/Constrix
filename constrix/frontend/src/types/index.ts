export interface User {
  id: string;
  walletAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id?: string;
  _id?: string;
  userId: string;
  name?: string;
  description?: string;
  category?: string;
  habitType?: 'study' | 'fitness';
  type?: 'study' | 'fitness';
  currentStreak: number;
  longestStreak: number;
  totalCompletions?: number;
  isActive?: boolean;
  lastCheckin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  completedAt: string;
  verificationHash?: string;
}