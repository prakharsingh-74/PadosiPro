import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const TIMING_OPTIONS = [
  {
    id: 'timing-1',
    title: 'Standard',
    desc: 'Within a few days is fine',
    icon: 'calendar',
  },
  {
    id: 'timing-2',
    title: 'Same day',
    desc: 'Today if possible',
    icon: 'sun',
  },
  {
    id: 'timing-3',
    title: 'Express',
    desc: 'As soon as you can',
    icon: 'zap',
  },
  {
    id: 'timing-4',
    title: 'Scheduled',
    desc: 'I have a specific time',
    icon: 'clock',
  }
];

export default function TaskTimingScreen() {
  const router = useRouter();
  const [selectedTiming, setSelectedTiming] = useState<string | null>(null);

  const handleNext = () => {
    // Navigate to next screen passing the timing and category info if needed
    router.push('/task-details');
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Title & Subtitle */}
        <Text style={styles.title}>When do you need this?</Text>
        <Text style={styles.subtitle}>
          Pick what feels closest. You can always add detail next.
        </Text>

        {/* Options List */}
        <View style={styles.listContainer}>
          {TIMING_OPTIONS.map((option) => {
            const isSelected = selectedTiming === option.id;

            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelectedTiming(option.id)}
                activeOpacity={0.8}
              >
                {/* Gold left border indicator for selected state */}
                {isSelected && <View style={styles.selectedIndicator} />}

                <View style={styles.iconBox}>
                  <Feather name={option.icon as any} size={20} color={isSelected ? "#133330" : "#5C736C"} />
                </View>
                
                <View style={styles.textContent}>
                  <Text style={styles.cardTitle}>{option.title}</Text>
                  <Text style={styles.cardDesc}>{option.desc}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.nextButton, !selectedTiming && styles.nextButtonDisabled]} 
          onPress={handleNext} 
          activeOpacity={0.8}
          disabled={!selectedTiming}
        >
          <Text style={[styles.nextButtonText, !selectedTiming && styles.nextButtonTextDisabled]}>Next</Text>
        </TouchableOpacity>
      </View>

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
  listContainer: {
    gap: 12
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 16,
    overflow: 'hidden'
  },
  cardSelected: {
    backgroundColor: '#EEF6F3',
    borderColor: '#5C736C'
  },
  selectedIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#D4AF37' // Gold color
  },
  iconBox: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    gap: 4
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0E2925'
  },
  cardDesc: {
    fontSize: 14,
    color: '#738C84'
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
  nextButton: {
    backgroundColor: '#133330', // Dark green when active
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextButtonDisabled: {
    backgroundColor: '#A9BDB6', 
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  nextButtonTextDisabled: {
    color: '#FFFFFF'
  }
});
