import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface Habit {
  _id: string;
  habitType: 'study' | 'fitness';
  currentStreak: number;
  longestStreak: number;
  lastCheckin: string | null;
  createdAt: string;
}

export interface CheckinResponse {
  success: boolean;
  habit: Habit;
  milestone?: {
    days: number;
    achieved: boolean;
  };
}

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await api.get('/habits');
      setHabits(response.data.habits);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch habits');
    } finally {
      setLoading(false);
    }
  };

  const createHabit = async (habitType: 'study' | 'fitness') => {
    try {
      const response = await api.post('/habits', { type: habitType });
      setHabits(prev => [...prev, response.data.habit]);
      return response.data.habit;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to create habit');
    }
  };

  const checkinHabit = async (habitId: string): Promise<CheckinResponse> => {
    try {
      const response = await api.post(`/habits/${habitId}/checkin`);
      
      // Refresh habits after checkin since backend doesn't return updated habit
      await fetchHabits();
      
      return {
        success: true,
        habit: {} as Habit,
        milestone: response.data.milestone ? {
          days: response.data.milestone.days,
          achieved: true
        } : undefined
      };
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.response?.data?.error || 'Failed to check in');
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return {
    habits,
    loading,
    error,
    fetchHabits,
    createHabit,
    checkinHabit,
    setHabits,
  };
};

export const useBlockchain = () => {
  const [syncing, setSyncing] = useState(false);

  const syncMilestones = async () => {
    try {
      setSyncing(true);
      const response = await api.post('/blockchain/sync');
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to sync milestones');
    } finally {
      setSyncing(false);
    }
  };

  const getUserBadges = async () => {
    try {
      const response = await api.get('/blockchain/badges');
      return response.data.badges || [];
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to get badges');
    }
  };

  return {
    syncing,
    syncMilestones,
    getUserBadges,
  };
};