export enum HabitType {
  STUDY = 'study',
  FITNESS = 'fitness'
}

export interface Habit {
  id: string;
  userId: string;
  habitType: HabitType;
  currentStreak: number;
  longestStreak: number;
  lastCheckin: string | null;
  createdAt: string;
}

export interface Checkin {
  id: string;
  habitId: string;
  checkinDate: string;
  proofData?: Record<string, any>;
  createdAt: string;
}

export interface Milestone {
  id: string;
  habitId: string;
  milestoneDays: number;
  achievedAt: string;
  blockchainSynced: boolean;
  txHash?: string;
}