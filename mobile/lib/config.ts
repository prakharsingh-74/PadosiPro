import { Platform } from 'react-native';

// In Expo development:
// Android Emulator uses 10.0.2.2 to connect to local machine host
// iOS Simulator / Web uses localhost
// Real device uses local IP address (e.g., http://192.168.x.x:4000)
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000/api';
  }
  return 'http://localhost:4000/api';
};

export const API_BASE_URL = getBaseUrl();
