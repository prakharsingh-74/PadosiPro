import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract params with fallbacks from screenshot
  const name = params.name || 'sdfsdfss';
  const address = params.address || 'fsdfsdf';
  const society = params.society || 'sdfsdfsd';
  const flat = params.flat || 'sdfsdf';
  const gateNotes = params.gateNotes || 'df';
  const mobileNumber = '+91 5194914198'; // Fallback from screenshot

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => router.replace('/login')
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={20} color="#137333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Account</Text>

        {/* Card 1: Signed in as */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Signed in as</Text>
          <Text style={styles.cardValue}>{mobileNumber}</Text>
        </View>

        {/* Card 2: Your LM */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Your LM</Text>
          <Text style={styles.lmName}>Pilot LM</Text>
          <Text style={styles.lmDetailsText}>Mumbai</Text>
          <Text style={styles.lmDetailsText}>{name}</Text>
          <View style={{ marginTop: 12 }}>
            <Text style={styles.addressLine}>{address}</Text>
            {!!society && <Text style={styles.addressLine}>Society: {society}</Text>}
            {!!flat && <Text style={styles.addressLine}>Flat / unit: {flat}</Text>}
            {!!gateNotes && <Text style={styles.addressLine}>Gate / notes: {gateNotes}</Text>}
          </View>
        </View>

        {/* Card 3: Household */}
        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <Feather name="users" size={18} color="#133330" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardTitle}>Household</Text>
              <Text style={styles.cardDesc}>Family members your LM should know about</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#94A3B8" />
          </View>
        </TouchableOpacity>

        {/* Card 4: Wallet */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Wallet</Text>
          <Text style={styles.cardTitle}>Coming soon</Text>
          <Text style={[styles.cardDesc, { marginTop: 4 }]}>
            Wallet top-up isn't turned on yet. Your Lifestyle Manager can still handle requests and send you the bill directly in the meantime.
          </Text>
        </View>

        {/* Card 5: Sign out */}
        <TouchableOpacity style={styles.signOutCard} onPress={handleSignOut} activeOpacity={0.7}>
          <Feather name="log-out" size={16} color="#D32F2F" />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6' // matches background
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: -4
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#137333',
    marginLeft: 2
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0E2925',
    marginBottom: 24,
    letterSpacing: -0.5
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#738C84',
    marginBottom: 8
  },
  cardValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0E2925'
  },
  lmName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0E2925',
    marginBottom: 8
  },
  lmDetailsText: {
    fontSize: 14,
    color: '#5C736C',
    marginBottom: 4
  },
  addressLine: {
    fontSize: 13,
    color: '#738C84',
    lineHeight: 20
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F2ED',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0E2925',
    marginBottom: 2
  },
  cardDesc: {
    fontSize: 14,
    color: '#5C736C',
    lineHeight: 20
  },
  signOutCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5', // Light red border
    marginTop: 8,
    gap: 8
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D32F2F' // Red text
  }
});
