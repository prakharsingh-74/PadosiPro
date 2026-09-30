import axios from 'axios';
import { API_BASE_URL } from './config';

export const TaskAPI = {
  getCatalog: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/catalog`);
      return response.data.catalog;
    } catch (error: any) {
      console.error('TaskAPI.getCatalog Error:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to fetch catalog');
      }
      throw new Error('Network error fetching catalog.');
    }
  },
  
  saveUserTask: async (taskId: string, timing: string, notes: string) => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) throw new Error('No authentication token found. Please log in again.');

      const response = await axios.post(`${API_BASE_URL}/tasks/select`, 
        { task_id: taskId, timing, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      console.error('TaskAPI.saveUserTask Error:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to save task');
      }
      throw new Error('Network error saving task.');
    }
  }
};
