import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { validateBody } from './middlewares/validate.middleware';
import { authenticateToken } from './middlewares/auth.middleware';
import { errorHandler } from './middlewares/error.middleware';
import {
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema
} from './validators/auth.validator';
import { profileSchema } from './validators/profile.validator';
import { AuthController } from './controllers/auth.controller';
import { ProfileController } from './controllers/profile.controller';
import { TaskController } from './controllers/task.controller';

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'PadosiPro Backend API', time: new Date().toISOString() });
});

// Authentication Routes
app.post('/api/auth/register', validateBody(registerSchema), AuthController.register);
app.post('/api/auth/verify-otp', validateBody(verifyOtpSchema), AuthController.verifyOtp);
app.post('/api/auth/resend-otp', validateBody(resendOtpSchema), AuthController.resendOtp);
app.post('/api/auth/login', validateBody(loginSchema), AuthController.login);

// Profile Routes (Protected)
app.post('/api/profile', authenticateToken, validateBody(profileSchema), ProfileController.saveProfile);
app.get('/api/profile', authenticateToken, ProfileController.getProfile);

// Task Routes
app.get('/api/tasks/catalog', TaskController.getCatalog);
app.post('/api/tasks/select', authenticateToken, TaskController.saveUserTasks);
app.get('/api/tasks/my-tasks', authenticateToken, TaskController.getUserTasks);

// Global Error Handler
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT || 4000, () => {
    console.log(`🚀 PadosiPro Backend Server running on http://localhost:${process.env.PORT || 4000}`);
  });
}

export default app;
