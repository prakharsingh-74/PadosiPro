import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { profileSchema } from '../validators/profile.validator';

const router = Router();

router.post('/', authenticateToken, validateBody(profileSchema), ProfileController.saveProfile);
router.get('/', authenticateToken, ProfileController.getProfile);

export default router;
