import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';

export const profileApi = {
  /**
   * Save or update the user's profile
   */
  saveProfile: async (profileData: {
    full_name: string;
    address: string;
    society?: string;
    flat?: string;
    gate_notes?: string;
    location_name?: string;
  }) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) throw new Error('No authentication token found. Please log in again.');

      const response = await axios.post(
        `${API_BASE_URL}/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Profile save error:', error.response?.data || error.message);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to save profile.');
      }
      throw new Error('Network error saving profile.');
    }
  }
};
