import { Router } from 'express';
import { BlockchainService } from '../services/blockchainService';
import { auth } from '../middleware/auth';
import Milestone from '../models/Milestone';
import Habit from '../models/Habit';

const router = Router();
const blockchainService = new BlockchainService();

/**
 * Sync pending milestones to blockchain
 */
router.post('/sync', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    // Get all unsynced milestones for this user
    const userHabits = await Habit.find({ userId }).select('_id');
    const habitIds = userHabits.map(h => h._id);
    
    const pendingMilestones = await Milestone.find({
      habitId: { $in: habitIds },
      blockchainSynced: false
    }).populate('habitId');

    if (pendingMilestones.length === 0) {
      return res.json({ 
        message: 'No pending milestones to sync',
        synced: 0 
      });
    }

    const syncResults = [];
    
    for (const milestone of pendingMilestones) {
      try {
        const habit = milestone.habitId as any;
        const result = await blockchainService.recordMilestone(
          req.user!.walletAddress,
          habit.habitType,
          milestone.milestoneDays
        );

        if (result.success) {
          // Update milestone as synced
          milestone.blockchainSynced = true;
          milestone.txHash = result.txHash;
          await milestone.save();
          
          syncResults.push({
            milestoneDays: milestone.milestoneDays,
            habitType: habit.habitType,
            success: true,
            txHash: result.txHash
          });
        } else {
          syncResults.push({
            milestoneDays: milestone.milestoneDays,
            habitType: habit.habitType,
            success: false,
            error: 'Blockchain transaction failed'
          });
        }
      } catch (error: any) {
        syncResults.push({
          milestoneDays: milestone.milestoneDays,
          habitType: (milestone.habitId as any).habitType,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = syncResults.filter(r => r.success).length;
    
    res.json({
      message: `Synced ${successCount}/${pendingMilestones.length} milestones`,
      synced: successCount,
      results: syncResults
    });
  } catch (error) {
    console.error('Milestone sync error:', error);
    res.status(500).json({ error: 'Failed to sync milestones' });
  }
});

/**
 * Get user's blockchain streak data
 */
router.get('/streak/:habitType', auth, async (req, res) => {
  try {
    const { habitType } = req.params;
    
    if (!['study', 'fitness'].includes(habitType)) {
      return res.status(400).json({ error: 'Invalid habit type' });
    }

    const streak = await blockchainService.getUserStreak(
      req.user!.walletAddress,
      habitType as 'study' | 'fitness'
    );

    res.json(streak);
  } catch (error) {
    console.error('Get blockchain streak error:', error);
    res.status(500).json({ error: 'Failed to get blockchain streak' });
  }
});

/**
 * Get user's NFT badges
 */
router.get('/badges', auth, async (req, res) => {
  try {
    const badges = await blockchainService.getUserBadges(
      req.user!.walletAddress
    );

    res.json({ badges });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ error: 'Failed to get badges' });
  }
});

/**
 * Get contract health status (admin only)
 */
router.get('/health', async (req, res) => {
  try {
    const health = await blockchainService.getContractHealth();
    res.json(health);
  } catch (error) {
    console.error('Contract health check error:', error);
    res.status(500).json({ error: 'Failed to check contract health' });
  }
});

/**
 * Manual milestone recording (admin only)
 */
router.post('/record-milestone', auth, async (req, res) => {
  try {
    const { userAddress, habitType, days } = req.body;
    
    // Validate input
    if (!userAddress || !habitType || !days) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['study', 'fitness'].includes(habitType)) {
      return res.status(400).json({ error: 'Invalid habit type' });
    }

    const result = await blockchainService.recordMilestone(
      userAddress,
      habitType,
      days
    );

    if (result.success) {
      res.json({
        message: 'Milestone recorded successfully',
        txHash: result.txHash
      });
    } else {
      res.status(500).json({ error: 'Failed to record milestone on blockchain' });
    }
  } catch (error) {
    console.error('Manual milestone recording error:', error);
    res.status(500).json({ error: 'Failed to record milestone' });
  }
});

export default router;