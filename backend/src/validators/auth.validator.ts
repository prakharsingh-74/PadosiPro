import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  mobile_number: z.string().optional(),
  password: z.string().optional()
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP code must be exactly 6 digits').regex(/^\d{6}$/, 'OTP code must contain digits only')
});

export const resendOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});
