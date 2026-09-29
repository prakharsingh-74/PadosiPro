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

const CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Errands & Daily Tasks',
    desc: 'Bills, banks, documents, government work',
    icon: 'check-square',
    subTasks: ['Pickups & Deliveries', 'Payments & Renewals', 'Documents & Government', 'Shopping']
  },
  {
    id: 'cat-2',
    name: 'Home Services',
    desc: 'AC, plumbing, electrical, cleaning, repairs',
    icon: 'home',
    subTasks: ['Cleaning', 'Repairs', 'Appliances & Utilities', 'Property & Society']
  },
  {
    id: 'cat-3',
    name: 'Travel & Tourism',
    desc: 'Flights, hotels, visas, transfers, itineraries',
    icon: 'map-pin',
    subTasks: ['Book Travel', 'On-Trip Support', 'Documents & Visa', 'Local Transport']
  },
  {
    id: 'cat-4',
    name: 'Health & Medical',
    desc: 'Doctor visits, pharmacy, labs, physio',
    icon: 'heart',
    subTasks: ['Appointments & Tests', 'Records & Reports', 'Hospital & Emergency', 'Insurance & Claims']
  },
  {
    id: 'cat-5',
    name: 'Senior Care',
    desc: 'Check-ins, medicines, vitals, companionship',
    icon: 'users',
    subTasks: ['Daily Care', 'Medical Support', 'Safety & Mobility', 'Family Coordination']
  },
  {
    id: 'cat-6',
    name: 'Events & Management',
    desc: 'Weddings, décor, catering, photography',
    icon: 'calendar',
    subTasks: ['Party Planning', 'Vendor Management', 'Decor & Setup', 'Catering']
  },
  {
    id: 'cat-7',
    name: 'Workforce Management',
    desc: 'Maids, cooks, drivers, nannies, payroll',
    icon: 'briefcase',
    subTasks: ['Hiring & Payroll', 'Background Checks', 'Replacements']
  },
  {
    id: 'cat-8',
    name: 'Digital & Tech Help',
    desc: 'WiFi, CCTV, smart locks, device repair',
    icon: 'wifi',
    subTasks: ['Network Setup', 'Device Troubleshooting', 'Smart Home Setup']
  },
  {
    id: 'cat-9',
    name: 'Relocation Services',
    desc: 'Packers, movers, handover, paperwork',
    icon: 'truck',
    subTasks: ['Packing & Moving', 'End-of-lease Cleaning', 'New Home Setup']
  },
  {
    id: 'cat-10',
    name: 'NutriFix',
    desc: 'Groceries, food delivery, diet plans, meal prep',
    icon: 'shopping-bag',
    subTasks: [],
    isSoon: true
  }
];

export default function TaskSelectionScreen() {
  const router = useRouter();

  // Match the screenshot: Home Services expanded by default
  const [expandedCategory, setExpandedCategory] = useState<string | null>('cat-2');

  const handleContinue = () => {
    // Return back to Home or wherever appropriate
    router.replace('/home');
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
        <Text style={styles.title}>What do you need help with?</Text>
        <Text style={styles.subtitle}>
          Pick a category, then choose a service. You can add details next.
        </Text>

        {/* Categories List */}
        <View style={styles.listContainer}>
          {CATEGORIES.map((cat) => {
            const isSelected = expandedCategory === cat.id;

            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setExpandedCategory(isSelected ? null : cat.id)}
                activeOpacity={0.8}
              >
                {/* Gold left border indicator for selected state */}
                {isSelected && <View style={styles.selectedIndicator} />}

                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
                    <Feather name={cat.icon as any} size={18} color={isSelected ? "#FFFFFF" : "#133330"} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.cardTitleRow}>
                      <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>{cat.name}</Text>
                      {(cat as any).isSoon && (
                        <View style={styles.soonBadge}>
                          <Text style={styles.soonText}>Soon</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.cardDesc}>{cat.desc}</Text>
                  </View>
                </View>

                {/* Expanded Sub-tasks section */}
                {isSelected && cat.subTasks && cat.subTasks.length > 0 && (
                  <View style={styles.expandedContent}>
                    <Text style={styles.subtasksTitle}>WHAT KIND OF HELP?</Text>
                    <View style={styles.subtasksGrid}>
                      {cat.subTasks.map((sub, idx) => (
                        <TouchableOpacity key={idx} style={styles.subtaskPill}>
                          <Text style={styles.subtaskText}>{sub}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
          <Text style={styles.continueButtonText}>Continue</Text>
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
    paddingBottom: 100 // Extra padding for floating bottom bar
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden'
  },
  cardSelected: {
    backgroundColor: '#EEF6F3',
    borderColor: '#5C736C' // Or '#133330', looking at screenshot it is dark but not pitch black
  },
  selectedIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#D4AF37' // Gold color
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E6F2ED',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconBoxSelected: {
    backgroundColor: '#133330'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0E2925',
    marginBottom: 4
  },
  cardTitleSelected: {
    fontWeight: '700'
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  soonBadge: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FDE68A',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12
  },
  soonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706'
  },
  cardDesc: {
    fontSize: 14,
    color: '#5C736C',
    lineHeight: 20
  },
  expandedContent: {
    paddingLeft: 74, // Align with text (16 padding + 42 icon + 16 gap)
    paddingRight: 16,
    paddingBottom: 20,
    paddingTop: 4
  },
  subtasksTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#738C84',
    letterSpacing: 0.5,
    marginBottom: 12
  },
  subtasksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  subtaskPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  subtaskText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0E2925'
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5
  },
  continueButton: {
    backgroundColor: '#133330', // Dark teal button
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center'
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF'
  }
});
