import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import taskRoutes from './task.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/tasks', taskRoutes);

export default router;
