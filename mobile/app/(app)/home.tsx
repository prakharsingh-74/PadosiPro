import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userName = params.name || 'sdfsdfss'; // from screenshot

  const navigateToAccount = () => {
    router.push({
      pathname: '/account',
      params: params // pass along the profile details to account screen
    });
  };

  const handleChat = () => {
    const phoneNumber = '919000000001';
    const message = 'Hi Pilot LM, I have a question.';
    const url = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch((err) => console.error("Couldn't open WhatsApp", err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good afternoon, {userName}</Text>
          <TouchableOpacity onPress={navigateToAccount}>
            <Feather name="user" size={24} color="#0E2925" />
          </TouchableOpacity>
        </View>

        {/* Title & Search */}
        <Text style={styles.title}>What do you need help with?</Text>
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color="#94A3B8" />
          <TextInput 
            style={styles.searchInput}
            placeholder="AC leaking, cook for weekends..."
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Categories Section */}
        <Text style={styles.sectionHeader}>POPULAR WITH FAMILIES LIKE YOURS</Text>
        <View style={styles.categoriesGrid}>
          <CategoryPill icon="check-square" label="Errands & Daily Tasks" onPress={() => router.push({ pathname: '/task-selection', params: { categoryId: 'cat-1' }})} />
          <CategoryPill icon="home" label="Home Services" onPress={() => router.push({ pathname: '/task-selection', params: { categoryId: 'cat-2' }})} />
          <CategoryPill icon="map-pin" label="Travel & Tourism" onPress={() => router.push({ pathname: '/task-selection', params: { categoryId: 'cat-3' }})} />
          <CategoryPill icon="heart" label="Health & Medical" onPress={() => router.push({ pathname: '/task-selection', params: { categoryId: 'cat-4' }})} />
          <CategoryPill icon="users" label="Senior Care" onPress={() => router.push({ pathname: '/task-selection', params: { categoryId: 'cat-5' }})} />
          <CategoryPill icon="calendar" label="Events & Management" onPress={() => router.push({ pathname: '/task-selection', params: { categoryId: 'cat-6' }})} />
        </View>
        <TouchableOpacity onPress={() => router.push('/task-selection')}>
          <Text style={styles.browseLink}>Browse everything we do <Feather name="arrow-right" size={14} /></Text>
        </TouchableOpacity>

        {/* How it works */}
        <Text style={[styles.sectionHeader, { marginTop: 32, marginBottom: 16 }]}>HOW PADOSIPRO WORKS</Text>
        <View style={styles.howItWorksList}>
          <HowItWorksItem 
            icon="message-square" 
            title="Tell us what you need" 
            desc="In your own words. No forms to hunt through." 
          />
          <HowItWorksItem 
            icon="user" 
            title="Your Lifestyle Manager takes it on" 
            desc="One person who knows your family and follows it through." 
          />
          <HowItWorksItem 
            icon="check-circle" 
            title="You see it done" 
            desc="Updates as things actually happen, with proof when it matters." 
          />
        </View>
      </ScrollView>

      {/* Bottom Floating Card */}
      <View style={styles.bottomCardContainer}>
        <View style={styles.bottomCard}>
          <View>
            <Text style={styles.lmLabel}>Your Lifestyle Manager</Text>
            <Text style={styles.lmName}>Pilot LM</Text>
          </View>
          <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
            <Feather name="message-circle" size={16} color="#0E2925" />
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Components
const CategoryPill = ({ icon, label, onPress }: { icon: any, label: string, onPress?: () => void }) => (
  <TouchableOpacity style={styles.pillContainer} onPress={onPress}>
    <Feather name={icon} size={14} color="#137333" />
    <Text style={styles.pillText}>{label}</Text>
  </TouchableOpacity>
);

const HowItWorksItem = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <View style={styles.howItWorksItem}>
    <View style={styles.iconCircle}>
      <Feather name={icon} size={18} color="#133330" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.howItWorksTitle}>{title}</Text>
      <Text style={styles.howItWorksDesc}>{desc}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6' // Light off-white similar to profile setup
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100 // space for bottom card
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0E2925'
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0E2925',
    marginBottom: 16
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 32
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#0E2925'
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#738C84',
    marginBottom: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16
  },
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0E2925'
  },
  browseLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#137333', // Dark green link
    marginBottom: 16
  },
  howItWorksList: {
    gap: 20
  },
  howItWorksItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F2ED',
    justifyContent: 'center',
    alignItems: 'center'
  },
  howItWorksTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0E2925',
    marginBottom: 4
  },
  howItWorksDesc: {
    fontSize: 13,
    color: '#5C736C',
    lineHeight: 18
  },
  bottomCardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 24,
    backgroundColor: '#FAF9F6' // matches background
  },
  bottomCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3
  },
  lmLabel: {
    fontSize: 12,
    color: '#738C84',
    marginBottom: 2
  },
  lmName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0E2925'
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0E2925'
  }
});
