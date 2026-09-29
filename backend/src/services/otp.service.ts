import { supabase } from '../config/database';
import { generateOtp, hashOtp } from '../utils/crypto';
import { sendOtpEmail } from '../config/mailer';

export class OtpService {
  /**
   * Create and send a new 6-digit OTP to user email
   */
  static async createAndSendOtp(userId: string, email: string): Promise<{ success: boolean; message: string; cooldownSeconds?: number }> {
    // 1. Check Resend Cooldown (30 seconds)
    const { data: latestOtp } = await supabase
      .from('otps')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (latestOtp) {
      const lastSent = new Date(latestOtp.last_sent_at).getTime();
      const now = new Date().getTime();
      const diffInSeconds = Math.floor((now - lastSent) / 1000);

      if (diffInSeconds < 30) {
        const remaining = 30 - diffInSeconds;
        return {
          success: false,
          message: `Please wait ${remaining} seconds before requesting a new OTP code.`,
          cooldownSeconds: remaining
        };
      }
    }

    // 2. Generate raw 6-digit OTP and store SHA-256 hash
    const rawOtp = generateOtp();
    const otpHash = hashOtp(rawOtp);

    // 10 minutes expiry from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Mark previous unused OTPs for this user as used/invalid
    await supabase
      .from('otps')
      .update({ is_used: true })
      .eq('email', email)
      .eq('is_used', false);

    // 3. Save new OTP entry
    const { error } = await supabase
      .from('otps')
      .insert([
        {
          user_id: userId,
          email,
          otp_hash: otpHash,
          expires_at: expiresAt,
          attempts_count: 0,
          last_sent_at: new Date().toISOString(),
          is_used: false
        }
      ]);

    if (error) {
      console.error('Error inserting OTP into database:', error);
      throw new Error('Failed to generate verification code.');
    }

    // 4. Send Email via Mailer (Mailpit / SMTP)
    await sendOtpEmail(email, rawOtp);

    return {
      success: true,
      message: 'Verification code sent to your email address.'
    };
  }

  /**
   * Verify an OTP code against attempt limit (5 max), expiry (10 min), and hash
   */
  static async verifyOtp(email: string, rawOtp: string): Promise<{ success: boolean; message: string }> {
    // 1. Fetch latest unused OTP for email
    const { data: otpRecord, error } = await supabase
      .from('otps')
      .select('*')
      .eq('email', email)
      .eq('is_used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !otpRecord) {
      return {
        success: false,
        message: 'No active verification code found. Please request a new OTP.'
      };
    }

    // 2. Check maximum wrong attempts (5 attempts limit)
    if (otpRecord.attempts_count >= 5) {
      // Mark as used so they must request a new code
      await supabase
        .from('otps')
        .update({ is_used: true })
        .eq('id', otpRecord.id);

      return {
        success: false,
        message: 'Maximum wrong verification attempts (5) reached. Please request a new OTP.'
      };
    }

    // 3. Increment attempt count
    const newAttemptsCount = otpRecord.attempts_count + 1;
    await supabase
      .from('otps')
      .update({ attempts_count: newAttemptsCount })
      .eq('id', otpRecord.id);

    // 4. Check Expiry (10 minutes)
    const expiresAt = new Date(otpRecord.expires_at).getTime();
    if (Date.now() > expiresAt) {
      await supabase
        .from('otps')
        .update({ is_used: true })
        .eq('id', otpRecord.id);

      return {
        success: false,
        message: 'Verification code has expired (10 min limit). Please request a new OTP.'
      };
    }

    // 5. Verify Hash
    const inputHash = hashOtp(rawOtp);
    if (inputHash !== otpRecord.otp_hash) {
      const attemptsRemaining = 5 - newAttemptsCount;
      return {
        success: false,
        message: `Incorrect verification code. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? '' : 's'} remaining.`
      };
    }

    // 6. Mark OTP used & Mark User verified
    await supabase
      .from('otps')
      .update({ is_used: true })
      .eq('id', otpRecord.id);

    await supabase
      .from('users')
      .update({ is_verified: true, updated_at: new Date().toISOString() })
      .eq('email', email);

    return {
      success: true,
      message: 'Email address verified successfully!'
    };
  }
}
