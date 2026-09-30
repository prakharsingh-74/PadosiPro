import axios from 'axios';
import { API_BASE_URL } from './config';

export const authApi = {
  /**
   * Request OTP code for email & mobile number
   */
  requestOtp: async (email: string, mobileNumber: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        mobile_number: mobileNumber
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to request OTP code.');
      }
      throw new Error('Network error. Please check your backend connection.');
    }
  },

  /**
   * Verify 6-digit OTP code
   */
  verifyOtp: async (email: string, otp: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        email,
        otp
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to verify OTP code.');
      }
      throw new Error('Network error. Please check your backend connection.');
    }
  },

  /**
   * Resend OTP code
   */
  resendOtp: async (email: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/resend-otp`, {
        email
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to resend OTP code.');
      }
      throw new Error('Network error. Please check your backend connection.');
    }
  }
};
