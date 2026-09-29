import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ProfileService } from '../services/profile.service';

export class ProfileController {
  static async saveProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const profile = await ProfileService.saveProfile(userId, req.body);
      res.status(200).json({
        success: true,
        message: 'Profile saved successfully!',
        profile
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const profile = await ProfileService.getProfile(userId);
      res.status(200).json({
        success: true,
        profile
      });
    } catch (error) {
      next(error);
    }
  }
}
