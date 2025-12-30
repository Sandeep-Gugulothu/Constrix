import { Request, Response } from 'express';
import Milestone from '../models/Milestone';
import Habit from '../models/Habit';

export class RewardController {
  static async getUserRewards(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      
      // Get user's habits
      const habits = await Habit.find({ userId });
      const habitIds = habits.map(h => h._id);
      
      // Get milestones for user's habits
      const milestones = await Milestone.find({ 
        habitId: { $in: habitIds } 
      }).populate('habitId');

      const rewards = milestones.map(milestone => ({
        id: milestone._id,
        habitType: (milestone.habitId as any).habitType,
        milestoneDays: milestone.milestoneDays,
        achievedAt: milestone.achievedAt,
        blockchainSynced: milestone.blockchainSynced,
        txHash: milestone.txHash,
        veryTokens: getRewardAmount(milestone.milestoneDays)
      }));

      res.json({ rewards });
    } catch (error) {
      console.error('Get user rewards error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to get user rewards' 
      });
    }
  }

  static async claimReward(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const milestone = await Milestone.findById(id).populate('habitId');
      if (!milestone) {
        return res.status(404).json({ 
          error: 'Reward not found',
          message: 'Reward not found' 
        });
      }

      // Check if user owns this milestone
      const habit = await Habit.findOne({ _id: milestone.habitId, userId });
      if (!habit) {
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'You do not own this reward' 
        });
      }

      if (milestone.blockchainSynced) {
        return res.status(409).json({ 
          error: 'Already claimed',
          message: 'This reward has already been claimed' 
        });
      }

      // TODO: Implement blockchain sync logic here
      // For now, just mark as synced
      milestone.blockchainSynced = true;
      milestone.txHash = 'mock-tx-hash-' + Date.now();
      await milestone.save();

      res.json({ 
        success: true,
        reward: {
          id: milestone._id,
          veryTokens: getRewardAmount(milestone.milestoneDays),
          txHash: milestone.txHash
        }
      });
    } catch (error) {
      console.error('Claim reward error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to claim reward' 
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