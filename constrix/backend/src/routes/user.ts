import { Router } from 'express';
import { StreakController } from '../controllers/streakController';
import { RewardController } from '../controllers/rewardController';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Streaks
router.get('/me/streaks', authenticateToken, StreakController.getUserStreaks);
router.get('/habits/:id/streak', authenticateToken, StreakController.getHabitStreak);

// Rewards
router.get('/me/rewards', authenticateToken, RewardController.getUserRewards);
router.post('/rewards/:id/claim', authenticateToken, RewardController.claimReward);

// Analytics
router.get('/me/analytics', authenticateToken, AnalyticsController.getUserAnalytics);

export default router;