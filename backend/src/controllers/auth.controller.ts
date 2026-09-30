import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { OtpService } from '../services/otp.service';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.register(email, password);
      res.status(201).json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      const result = await OtpService.verifyOtp(email, otp);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message
        });
      }

      // Fetch user to generate JWT token upon successful verification
      const { supabase } = await import('../config/database');
      const { data: user } = await supabase.from('users').select('id, email').eq('email', email).single();
      
      let token = null;
      if (user) {
        const { generateToken } = await import('../utils/crypto');
        token = generateToken(user.id, user.email);
      }

      res.status(200).json({
        success: true,
        message: result.message,
        token
      });
    } catch (error) {
      next(error);
    }
  }

  static async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      // Get user ID by email
      const { supabase } = await import('../config/database');
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Account not found with this email address.'
        });
      }

      const result = await OtpService.createAndSendOtp(user.id, email);

      if (!result.success) {
        return res.status(429).json({
          success: false,
          message: result.message,
          cooldownSeconds: result.cooldownSeconds
        });
      }

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      if (!result.is_verified) {
        return res.status(403).json({
          success: false,
          unverified: true,
          message: result.message,
          email: result.email,
          cooldownSeconds: result.cooldownSeconds
        });
      }

      res.status(200).json({
        success: true,
        message: 'Login successful!',
        token: result.token,
        hasProfile: result.hasProfile,
        user: result.user
      });
    } catch (error) {
      next(error);
    }
  }
}
