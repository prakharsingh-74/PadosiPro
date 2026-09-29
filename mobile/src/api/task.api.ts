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
  
  // Note: saveUserTasks requires a token from AsyncStorage which can be passed as an argument later
  saveUserTasks: async (taskIds: string[], token: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks/select`, 
        { task_ids: taskIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      console.error('TaskAPI.saveUserTasks Error:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Failed to save tasks');
      }
      throw new Error('Network error saving tasks.');
    }
  }
};
