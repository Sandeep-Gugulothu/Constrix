import { Router } from 'express';
import authRoutes from './auth';
import habitRoutes from './habits';
import userRoutes from './user';
// import blockchainRoutes from './blockchain';

const router = Router();

router.use('/auth', authRoutes);
router.use('/habits', habitRoutes);
router.use('/', userRoutes);
// router.use('/blockchain', blockchainRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;