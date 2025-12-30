import { Request, Response } from 'express';
import Habit from '../models/Habit';
import Checkin from '../models/Checkin';
import Milestone from '../models/Milestone';

export class AnalyticsController {
  static async getUserAnalytics(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { period = '30d' } = req.query;

      // Get user's habits
      const habits = await Habit.find({ userId });
      const habitIds = habits.map(h => h._id);

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '6m':
          startDate.setMonth(endDate.getMonth() - 6);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

      // Get checkins in period
      const checkins = await Checkin.find({
        habitId: { $in: habitIds },
        checkinDate: { $gte: startDate, $lte: endDate }
      }).populate('habitId');

      // Get milestones
      const milestones = await Milestone.find({
        habitId: { $in: habitIds }
      }).populate('habitId');

      // Calculate analytics
      const totalCheckins = checkins.length;
      const activeStreaks = habits.filter(h => h.currentStreak > 0).length;
      const totalHabits = habits.length;
      const completionRate = totalHabits > 0 ? Math.round((activeStreaks / totalHabits) * 100) : 0;
      
      // Group checkins by date for activity heatmap
      const activityMap: Record<string, number> = {};
      checkins.forEach(checkin => {
        const date = checkin.checkinDate.toISOString().split('T')[0];
        activityMap[date] = (activityMap[date] || 0) + 1;
      });

      // Calculate streak distribution
      const streakDistribution = habits.reduce((acc, habit) => {
        const streak = habit.currentStreak;
        if (streak === 0) acc.none++;
        else if (streak < 7) acc.short++;
        else if (streak < 30) acc.medium++;
        else acc.long++;
        return acc;
      }, { none: 0, short: 0, medium: 0, long: 0 });

      // Calculate VERY tokens earned
      const veryTokensEarned = milestones.reduce((total, milestone) => {
        return total + getRewardAmount(milestone.milestoneDays);
      }, 0);

      res.json({
        analytics: {
          period,
          totalCheckins,
          activeStreaks,
          totalHabits,
          completionRate,
          veryTokensEarned,
          activityMap,
          streakDistribution,
          milestones: milestones.map(m => ({
            id: m._id,
            habitType: (m.habitId as any).habitType,
            days: m.milestoneDays,
            achievedAt: m.achievedAt,
            synced: m.blockchainSynced
          }))
        }
      });
    } catch (error) {
      console.error('Get user analytics error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to get user analytics' 
      });
    }
  }
}

function getRewardAmount(days: number): number {
  const rewards: Record<number, number> = {
    7: 100,
    14: 180,
    30: 300,
    60: 480,
    100: 700,
    365: 2000
  };
  return rewards[days] || 0;
}