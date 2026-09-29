import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TaskConfirmationScreen() {
  const router = useRouter();

  const handleBackToHome = () => {
    // Navigate back to home root, wiping the stack if needed
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Checkmark Icon */}
        <View style={styles.iconCircle}>
          <Feather name="check" size={24} color="#137333" />
        </View>

        {/* Text */}
        <Text style={styles.title}>We're on it</Text>
        <Text style={styles.subtitle}>
          Pilot LM has your request and will handle the rest.{'\n'}
          You'll see updates on your home screen.
        </Text>

        {/* Button */}
        <TouchableOpacity 
          style={styles.homeButton} 
          onPress={handleBackToHome} 
          activeOpacity={0.8}
        >
          <Text style={styles.homeButtonText}>Back to home</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6' // matches the pale background
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: -50 // visually center it a bit higher
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F2ED', // pale green background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0E2925',
    marginBottom: 16,
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 15,
    color: '#5C736C',
    lineHeight: 24,
    marginBottom: 40
  },
  homeButton: {
    backgroundColor: '#134D3D', // Darker green based on screenshot
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  homeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF'
  }
});
