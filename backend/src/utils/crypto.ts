import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


/**
 * Generate a cryptographically secure 6-digit numeric OTP code
 */
export const generateOtp = (): string => {
  const randomBuffer = crypto.randomBytes(4);
  const randomNumber = randomBuffer.readUInt32BE(0) % 1000000;
  return randomNumber.toString().padStart(6, '0');
};

/**
 * Hash string using SHA-256 (for OTP security - code is never saved plain in DB)
 */
export const hashOtp = (otp: string): string => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

/**
 * Hash user password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare password with stored bcrypt hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate JWT token for verified user
 */
export const generateToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): { userId: string; email: string } => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; email: string };
};
