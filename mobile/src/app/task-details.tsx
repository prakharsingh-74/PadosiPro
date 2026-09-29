import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TaskDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryName = (params.categoryName as string) || 'Errands & Daily Tasks';
  const [details, setDetails] = useState('');

  const handleSubmit = () => {
    // Show confirmation screen
    router.push('/task-confirmation');
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={20} color="#137333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Category Badge */}
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{categoryName}</Text>
          </View>

          {/* Title & Subtitle */}
          <Text style={styles.title}>Tell us a little more</Text>
          <Text style={styles.subtitle}>
            One or two lines is enough. We'll take it from there.
          </Text>

          {/* Text Area */}
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={6}
            placeholder="e.g. AC in the guest room is leaking onto the floor"
            placeholderTextColor="#94A3B8"
            value={details}
            onChangeText={setDetails}
            textAlignVertical="top"
          />

        </ScrollView>

        {/* Floating Bottom Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={[styles.submitButton, details.trim().length > 0 && styles.submitButtonActive]} 
            onPress={handleSubmit} 
            activeOpacity={0.8}
            disabled={details.trim().length === 0}
          >
            <Text style={styles.submitButtonText}>Leave it with us</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6'
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -4
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#137333',
    marginLeft: 2
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100
  },
  badgeContainer: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FDE68A',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 24
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706'
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0E2925',
    marginBottom: 12,
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 15,
    color: '#5C736C',
    lineHeight: 22,
    marginBottom: 24
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4AF37', // Gold border matching screenshot
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#0E2925',
    minHeight: 120
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FAF9F6',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#E2E8F0'
  },
  submitButton: {
    backgroundColor: '#A9BDB6', // muted disabled green
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitButtonActive: {
    backgroundColor: '#133330', // dark green when active
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF'
  }
});
