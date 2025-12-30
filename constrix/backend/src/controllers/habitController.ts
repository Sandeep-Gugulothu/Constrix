import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Habit from '../models/Habit';
import Checkin from '../models/Checkin';
import Milestone from '../models/Milestone';
import { StreakService } from '../services/streakService';

export class HabitController {
  static async getHabits(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const habits = await Habit.find({ userId }).sort({ createdAt: -1 });
      
      res.json({ habits: habits.map(h => ({
        id: h._id,
        userId: h.userId,
        type: h.habitType,
        name: h.habitType === 'study' ? 'Study' : 'Fitness',
        description: h.habitType === 'study' ? 'Daily learning and skill development' : 'Physical exercise and health',
        targetFrequency: 1,
        isActive: true,
        createdAt: h.createdAt,
        updatedAt: h.updatedAt || h.createdAt
      })) });
    } catch (error) {
      console.error('Get habits error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to get habits' 
      });
    }
  }

  static async createHabit(req: Request, res: Response) {
    try {
      const { type, name, description } = req.body;
      const userId = req.user?.id;

      if (!['study', 'fitness'].includes(type)) {
        return res.status(400).json({ 
          error: 'Invalid habit type',
          message: 'Habit type must be study or fitness' 
        });
      }

      const existing = await Habit.findOne({ userId, habitType: type });
      if (existing) {
        return res.status(409).json({ 
          error: 'Habit already exists',
          message: 'You already have a habit of this type' 
        });
      }

      const habit = new Habit({ userId, habitType: type });
      await habit.save();

      res.status(201).json({ 
        habit: {
          id: habit._id,
          userId: habit.userId,
          type: habit.habitType,
          name: name || (habit.habitType === 'study' ? 'Study' : 'Fitness'),
          description: description || (habit.habitType === 'study' ? 'Daily learning and skill development' : 'Physical exercise and health'),
          targetFrequency: 1,
          isActive: true,
          createdAt: habit.createdAt,
          updatedAt: habit.createdAt
        }
      });
    } catch (error) {
      console.error('Create habit error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to create habit' 
      });
    }
  }

  static async getHabit(req: Request, res: Response) {
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

      const [checkins, streak] = await Promise.all([
        Checkin.find({ habitId: id }).sort({ checkinDate: -1 }).limit(30),
        StreakService.calculateStreak(id)
      ]);

      res.json({
        habit: {
          id: habit._id,
          userId: habit.userId,
          type: habit.habitType,
          name: habit.habitType === 'study' ? 'Study' : 'Fitness',
          description: habit.habitType === 'study' ? 'Daily learning and skill development' : 'Physical exercise and health',
          targetFrequency: 1,
          isActive: true,
          createdAt: habit.createdAt,
          updatedAt: habit.updatedAt || habit.createdAt
        },
        checkins: checkins.map(c => ({
          id: c._id,
          habitId: c.habitId,
          userId: userId,
          checkinDate: c.checkinDate.toISOString().split('T')[0],
          completedAt: c.createdAt,
          proofData: c.proofData
        })),
        streak: {
          id: `${habit._id}_streak`,
          habitId: habit._id,
          userId: userId,
          currentStreak: habit.currentStreak,
          longestStreak: habit.longestStreak,
          lastCheckinDate: habit.lastCheckin?.toISOString().split('T')[0] || null,
          isActive: habit.currentStreak > 0
        }
      });
    } catch (error) {
      console.error('Get habit error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to get habit details' 
      });
    }
  }

  static async checkinHabit(req: Request, res: Response) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const { id } = req.params;
      const { proofData } = req.body;
      const userId = req.user?.id;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const habit = await Habit.findOne({ _id: id, userId }).session(session);
      if (!habit) {
        await session.abortTransaction();
        return res.status(404).json({ 
          error: 'Habit not found',
          message: 'Habit not found or access denied' 
        });
      }

      const existingCheckin = await Checkin.findOne({ 
        habitId: id, 
        checkinDate: today 
      }).session(session);
      
      if (existingCheckin) {
        await session.abortTransaction();
        return res.status(409).json({ 
          error: 'Already checked in',
          message: 'You have already checked in today' 
        });
      }

      const checkin = new Checkin({ 
        habitId: id, 
        checkinDate: today,
        proofData 
      });
      await checkin.save({ session });

      // Simple streak calculation
      const checkins = await Checkin.find({ habitId: id })
        .sort({ checkinDate: -1 })
        .session(session);
      
      let currentStreak = 1;
      const todayStr = today.toISOString().split('T')[0];
      
      for (let i = 1; i < checkins.length; i++) {
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        const expectedDateStr = expectedDate.toISOString().split('T')[0];
        const checkinDateStr = checkins[i].checkinDate.toISOString().split('T')[0];
        
        if (checkinDateStr === expectedDateStr) {
          currentStreak++;
        } else {
          break;
        }
      }
      
      const longestStreak = Math.max(habit.longestStreak || 0, currentStreak);
      
      await Habit.findByIdAndUpdate(
        id,
        {
          currentStreak,
          longestStreak,
          lastCheckin: today
        },
        { session }
      );

      // Check for milestones
      const MILESTONE_DAYS = [7, 14, 30, 60, 100, 365];
      let milestone = null;
      
      if (MILESTONE_DAYS.includes(currentStreak)) {
        try {
          milestone = new Milestone({ habitId: id, milestoneDays: currentStreak });
          await milestone.save({ session });
        } catch (err: any) {
          if (err.code !== 11000) throw err;
        }
      }

      await session.commitTransaction();
      
      res.json({ 
        success: true,
        checkin: {
          id: checkin._id,
          habitId: checkin.habitId,
          userId: userId,
          checkinDate: checkin.checkinDate.toISOString().split('T')[0],
          completedAt: checkin.createdAt,
          proofData: checkin.proofData
        },
        streak: {
          currentStreak,
          longestStreak,
          lastCheckinDate: today.toISOString().split('T')[0]
        },
        milestone: milestone ? {
          id: milestone._id,
          days: milestone.milestoneDays,
          achieved: true
        } : undefined
      });
    } catch (error) {
      await session.abortTransaction();
      console.error('Checkin error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to record check-in' 
      });
    } finally {
      session.endSession();
    }
  }

  static async deleteHabit(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const habit = await Habit.findOneAndDelete({ _id: id, userId });
      if (!habit) {
        return res.status(404).json({ 
          error: 'Habit not found',
          message: 'Habit not found or access denied' 
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Delete habit error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to delete habit' 
      });
    }
  }
}