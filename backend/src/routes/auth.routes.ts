import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validate.middleware';
import {
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema
} from '../validators/auth.validator';

const router = Router();

router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/verify-otp', validateBody(verifyOtpSchema), AuthController.verifyOtp);
router.post('/resend-otp', validateBody(resendOtpSchema), AuthController.resendOtp);
router.post('/login', validateBody(loginSchema), AuthController.login);

export default router;
