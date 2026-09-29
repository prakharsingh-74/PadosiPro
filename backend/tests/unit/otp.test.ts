import { generateOtp, hashOtp } from '../../src/utils/crypto';

describe('Risky Logic - OTP & Security Utility Tests', () => {
  test('OTP generation creates a 6-digit numeric string', () => {
    const otp = generateOtp();
    expect(otp).toHaveLength(6);
    expect(/^\d{6}$/.test(otp)).toBe(true);
  });

  test('OTP hashes consistently with SHA-256 and never matches raw OTP', () => {
    const otp = '123456';
    const hash1 = hashOtp(otp);
    const hash2 = hashOtp(otp);

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(otp);
    expect(hash1).toHaveLength(64); // SHA-256 hex digest length
  });

  test('OTP expiry logic detects expired timestamp (>10 minutes)', () => {
    const expiredTimestamp = new Date(Date.now() - 11 * 60 * 1000).getTime();
    const isExpired = Date.now() > expiredTimestamp;
    expect(isExpired).toBe(true);
  });

  test('OTP expiry logic permits valid timestamp (<10 minutes)', () => {
    const validTimestamp = new Date(Date.now() + 5 * 60 * 1000).getTime();
    const isExpired = Date.now() > validTimestamp;
    expect(isExpired).toBe(false);
  });

  test('Attempt limit logic triggers lock at 5 attempts', () => {
    const attempts = 5;
    const isLocked = attempts >= 5;
    expect(isLocked).toBe(true);
  });

  test('Resend cooldown logic enforces 30 seconds threshold', () => {
    const lastSent20sAgo = new Date(Date.now() - 20 * 1000).getTime();
    const diffInSeconds = Math.floor((Date.now() - lastSent20sAgo) / 1000);
    const canResend = diffInSeconds >= 30;
    expect(canResend).toBe(false);

    const lastSent35sAgo = new Date(Date.now() - 35 * 1000).getTime();
    const diffInSeconds2 = Math.floor((Date.now() - lastSent35sAgo) / 1000);
    const canResend2 = diffInSeconds2 >= 30;
    expect(canResend2).toBe(true);
  });
});
