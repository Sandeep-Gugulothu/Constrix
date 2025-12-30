import { Request, Response } from 'express';
import { StreakService } from '../services/streakService';
import Habit from '../models/Habit';

export class StreakController {
  static async getUserStreaks(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const habits = await Habit.find({ userId });
      
      const streaks = await Promise.all(
        habits.map(async (habit) => {
          const streakData = await StreakService.calculateStreak(habit._id.toString());
          return {
            habitId: habit._id,
            habitType: habit.habitType,
            ...streakData
          };
        })
      );

      res.json({ streaks });
    } catch (error) {
      console.error('Get user streaks error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to get user streaks' 
      });
    }
  }

  static async getHabitStreak(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const habit = await Habit.findOne({ _id: id, userId });
      if (!habit) {
        return res.status(404).json({ 
          error: 'Habit not found',
          message: 'Habit not found or access denied' 
        });
      }

      const streakData = await StreakService.calculateStreak(id);
      res.json({ streak: streakData });
    } catch (error) {
      console.error('Get habit streak error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to get habit streak' 
      });
    }
  }
}