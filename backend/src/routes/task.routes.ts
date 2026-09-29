import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/catalog', TaskController.getCatalog);
router.post('/select', authenticateToken, TaskController.saveUserTasks);
router.get('/my-tasks', authenticateToken, TaskController.getUserTasks);

export default router;
