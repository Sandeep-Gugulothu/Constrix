import { Router } from 'express';
import { HabitController } from '../controllers/habitController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', HabitController.getHabits);
router.post('/', HabitController.createHabit);
router.get('/:id', HabitController.getHabit);
router.delete('/:id', HabitController.deleteHabit);
router.post('/:id/checkin', HabitController.checkinHabit);

export default router;