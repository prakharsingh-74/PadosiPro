import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { TaskService } from '../services/task.service';

export class TaskController {
  static async getCatalog(req: Request, res: Response, next: NextFunction) {
    try {
      const catalog = await TaskService.getCatalog();
      res.status(200).json({
        success: true,
        catalog
      });
    } catch (error) {
      next(error);
    }
  }

  static async saveUserTasks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { task_id, timing, notes } = req.body;
      const selectedTasks = await TaskService.saveUserTask(userId, task_id, timing, notes);
      res.status(200).json({
        success: true,
        message: 'Task saved successfully!',
        tasks: selectedTasks
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserTasks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const selectedTasks = await TaskService.getUserTasks(userId);
      res.status(200).json({
        success: true,
        tasks: selectedTasks
      });
    } catch (error) {
      next(error);
    }
  }
}
