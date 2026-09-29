import { supabase } from '../config/database';
import { hashPassword, comparePassword, generateToken } from '../utils/crypto';
import { OtpService } from './otp.service';

export class AuthService {
  /**
   * Register new user with email & password (or mobile)
   */
  static async register(email: string, password?: string, mobileNumber?: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const userPassword = password || 'PadosiPro@2026';

    const { data: existingUser } = await supabase
      .from('users')
      .select('id, is_verified')
      .eq('email', normalizedEmail)
      .single();

    if (existingUser) {
      if (existingUser.is_verified) {
        throw { statusCode: 400, message: 'An account with this email address already exists. Please log in.' };
      } else {
        const otpResult = await OtpService.createAndSendOtp(existingUser.id, normalizedEmail);
        return {
          unverified: true,
          message: 'A verification code has been sent to your email address.',
          email: normalizedEmail,
          cooldownSeconds: otpResult.cooldownSeconds
        };
      }
    }

    const passwordHash = await hashPassword(userPassword);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          email: normalizedEmail,
          password_hash: passwordHash,
          is_verified: false
        }
      ])
      .select('id, email')
      .single();

    if (error || !newUser) {
      console.error('Error creating user:', error);
      throw { statusCode: 500, message: 'Failed to create user account.' };
    }

    if (mobileNumber) {
      await supabase.from('profiles').insert([
        {
          user_id: newUser.id,
          name: 'Padosi User',
          mobile_number: mobileNumber,
          address: 'Pending address setup'
        }
      ]);
    }

    const otpResult = await OtpService.createAndSendOtp(newUser.id, newUser.email);

    return {
      unverified: true,
      message: 'Verification code sent to your email address.',
      email: newUser.email,
      cooldownSeconds: otpResult.cooldownSeconds
    };
  }

  /**
   * Login user (verified users only)
   */
  static async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (error || !user) {
      throw { statusCode: 401, message: 'Invalid email or password.' };
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw { statusCode: 401, message: 'Invalid email or password.' };
    }

    if (!user.is_verified) {
      const otpResult = await OtpService.createAndSendOtp(user.id, user.email);
      return {
        is_verified: false,
        message: 'Your email is not verified. A verification code has been sent to your email.',
        email: user.email,
        cooldownSeconds: otpResult.cooldownSeconds
      };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    const token = generateToken(user.id, user.email);

    return {
      is_verified: true,
      token,
      hasProfile: !!profile,
      user: { id: user.id, email: user.email }
    };
  }
}
