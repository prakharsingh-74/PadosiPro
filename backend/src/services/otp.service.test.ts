import { OtpService } from './otp.service';
import { supabase } from '../config/database';
import * as cryptoUtils from '../utils/crypto';
import * as mailer from '../config/mailer';

// Mock dependencies
jest.mock('../config/database', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

jest.mock('../utils/crypto', () => ({
  generateOtp: jest.fn(),
  hashOtp: jest.fn(),
}));

jest.mock('../config/mailer', () => ({
  sendOtpEmail: jest.fn(),
}));

describe('OtpService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAndSendOtp', () => {
    it('should generate OTP and enforce cooldown limits', async () => {
      // Mock the latest OTP query (return an OTP generated 10 seconds ago to trigger cooldown)
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: {
          id: 'otp123',
          last_sent_at: new Date(Date.now() - 10000).toISOString(), // 10 seconds ago
        },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
        limit: mockLimit,
        single: mockSingle,
      });

      const result = await OtpService.createAndSendOtp('user123', 'test@example.com');
      
      expect(result.success).toBe(false);
      expect(result.cooldownSeconds).toBeGreaterThan(0);
      expect(result.message).toContain('Please wait');
    });

    it('should generate a new OTP if cooldown passed', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: {
          id: 'otp123',
          last_sent_at: new Date(Date.now() - 40000).toISOString(), // 40 seconds ago (cooldown is 30s)
        },
      });

      const mockUpdate = jest.fn().mockReturnThis();
      const mockDelete = jest.fn().mockReturnThis();
      const mockInsert = jest.fn().mockResolvedValue({ error: null });

      (supabase.from as jest.Mock).mockImplementation((table) => ({
        delete: mockDelete,
        update: mockUpdate,
        insert: mockInsert,
        eq: mockEq,
        order: mockOrder,
        limit: mockLimit,
        single: mockSingle,
      }));

      (cryptoUtils.generateOtp as jest.Mock).mockReturnValue('123456');
      (cryptoUtils.hashOtp as jest.Mock).mockReturnValue('hashed_123456');

      const result = await OtpService.createAndSendOtp('user123', 'test@example.com');

      expect(result.success).toBe(true);
      expect(mailer.sendOtpEmail).toHaveBeenCalledWith('test@example.com', '123456');
    });
  });

  describe('verifyOtp', () => {
    it('should reject when maximum attempts reached (5)', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: {
          id: 'otp123',
          attempts_count: 5, // Max attempts reached
          is_used: false,
        },
      });

      const mockUpdate = jest.fn().mockReturnThis();

      (supabase.from as jest.Mock).mockImplementation(() => ({
        delete: mockDelete,
        update: mockUpdate,
        eq: mockEq,
        order: mockOrder,
        limit: mockLimit,
        single: mockSingle,
      }));

      const result = await OtpService.verifyOtp('test@example.com', '123456');
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('Maximum wrong verification attempts');
    });

    it('should reject when OTP is expired (10 minutes)', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: {
          id: 'otp123',
          attempts_count: 0,
          expires_at: new Date(Date.now() - 60000).toISOString(), // 1 minute in the past
          is_used: false,
        },
      });

      const mockUpdate = jest.fn().mockReturnThis();

      (supabase.from as jest.Mock).mockImplementation(() => ({
        select: mockSelect,
        delete: mockDelete,
        eq: mockEq,
        order: mockOrder,
        limit: mockLimit,
        single: mockSingle,
      }));

      const result = await OtpService.verifyOtp('test@example.com', '123456');
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('expired');
    });

    it('should successfully verify a correct OTP', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: {
          id: 'otp123',
          attempts_count: 0,
          expires_at: new Date(Date.now() + 600000).toISOString(), // 10 minutes in the future
          otp_hash: 'valid_hash',
          is_used: false,
        },
      });

      const mockUpdate = jest.fn().mockReturnThis();

      (supabase.from as jest.Mock).mockImplementation(() => ({
        select: mockSelect,
        update: mockUpdate,
        eq: mockEq,
        order: mockOrder,
        limit: mockLimit,
        single: mockSingle,
      }));

      (cryptoUtils.hashOtp as jest.Mock).mockReturnValue('valid_hash');

      const result = await OtpService.verifyOtp('test@example.com', '123456');
      
      expect(result.success).toBe(true);
      expect(result.message).toContain('successfully');
    });
  });
});
