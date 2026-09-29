import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { PadosiLogo } from '../components/PadosiLogo';
import { useRouter } from 'expo-router';

// Seed task categories matching backend
const SEED_CATALOG = [
  {
    id: 'cat-1',
    name: 'Home & Maintenance',
    icon: 'home',
    tasks: [
      { id: 't-1', name: 'Deep Home Cleaning', description: 'Full house deep cleaning including kitchen & bathrooms.' },
      { id: 't-2', name: 'AC Servicing & Repair', description: 'Periodic maintenance, filter cleaning, and gas refilling.' },
      { id: 't-3', name: 'Plumbing & Leaks', description: 'Fixing leaky faucets, pipe replacements, and drain unblocking.' },
      { id: 't-4', name: 'Electrical Repairs', description: 'Wiring fixes, light fixture installs, and switchboard maintenance.' },
      { id: 't-5', name: 'Carpenter Work', description: 'Furniture assembly, door lock repair, and custom woodwork.' },
      { id: 't-6', name: 'Pest Control', description: 'Eco-friendly pest treatment for cockroaches and termites.' }
    ]
  },
  {
    id: 'cat-2',
    name: 'Errands & Shopping',
    icon: 'shopping-bag',
    tasks: [
      { id: 't-7', name: 'Fresh Organic Grocery Pick-up', description: 'Sourcing fresh vegetables and organic staples from local markets.' },
      { id: 't-8', name: 'Laundry & Dry Cleaning', description: 'Doorstep pickup, professional washing, ironing, and delivery.' },
      { id: 't-9', name: 'Pharmacy & Medicine Delivery', description: 'Prescription pickup and timely delivery of healthcare supplies.' },
      { id: 't-10', name: 'Courier & Package Drops', description: 'Sending packages via local courier services or intercity shipping.' },
      { id: 't-11', name: 'Gourmet Specialty Sourcing', description: 'Finding rare ingredients, artisan breads, and premium items.' }
    ]
  },
  {
    id: 'cat-3',
    name: 'Events & Hosting',
    icon: 'smile',
    tasks: [
      { id: 't-12', name: 'Party Catering Coordination', description: 'Selecting menus, booking chefs, and managing buffet setups.' },
      { id: 't-13', name: 'Floral & Balloon Decor', description: 'Custom theme decor for birthdays, anniversaries, and dinners.' },
      { id: 't-14', name: 'Bartender & Server Booking', description: 'Hiring professional mixologists and waitstaff for private gatherings.' },
      { id: 't-15', name: 'Sound & Lighting Setup', description: 'Renting audio systems, microphones, and ambient lights.' },
      { id: 't-16', name: 'Post-Party Cleanup', description: 'Complete cleanup after your home event so you can rest easy.' }
    ]
  },
  {
    id: 'cat-4',
    name: 'Administrative & Pet Care',
    icon: 'file-text',
    tasks: [
      { id: 't-17', name: 'Utility Bill Management', description: 'Automated tracking and payment of electricity, water, and broadband.' },
      { id: 't-18', name: 'Dog Walking & Sitting', description: 'Daily walks, feeding, and home sitting by verified pet lovers.' },
      { id: 't-19', name: 'Vet Appointment & Transit', description: 'Taking your pet to the vet clinic and handling vaccination logs.' },
      { id: 't-20', name: 'Document Printing & Attestation', description: 'Printing, scanning, notary seals, and courier drops.' },
      { id: 't-21', name: 'Car Wash & Detailing', description: 'Doorstep interior vacuuming, exterior wash, and polish.' }
    ]
  }
];

export default function TaskSelectionScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Toggle selection
  const toggleTask = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  // Confirm selection & Save
  const handleConfirmSelection = () => {
    if (selectedTaskIds.length === 0) {
      Alert.alert('Select Tasks', 'Please select at least one task you want managed.');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      // Navigate to Home screen listing selected tasks
      router.replace({
        pathname: '/home',
        params: { selectedCount: selectedTaskIds.length }
      });
    }, 600);
  };

  // Filter tasks by search query
  const filteredCatalog = SEED_CATALOG.map((cat) => ({
    ...cat,
    tasks: cat.tasks.filter(
      (t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter((cat) => cat.tasks.length > 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <PadosiLogo showLabel={false} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerTitle}>Task Catalogue</Text>
          <Text style={styles.headerSubtitle}>Pick the tasks you want handled</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{selectedTaskIds.length} Picked</Text>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color={Colors.iconColor} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services (e.g. cleaning, grocery, pets)..."
          placeholderTextColor={Colors.placeholderText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {!!searchQuery && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={18} color={Colors.iconColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* Task Catalogue List grouped by Category */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredCatalog.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="search" size={40} color={Colors.placeholderText} />
            <Text style={styles.emptyTitle}>No tasks found</Text>
            <Text style={styles.emptySub}>Try searching for something else like "AC" or "Cleaning"</Text>
          </View>
        ) : (
          filteredCatalog.map((cat) => (
            <View key={cat.id} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Feather name={cat.icon as any} size={18} color={Colors.primaryButtonBg} />
                <Text style={styles.categoryName}>{cat.name}</Text>
              </View>

              {cat.tasks.map((task) => {
                const isSelected = selectedTaskIds.includes(task.id);
                return (
                  <TouchableOpacity
                    key={task.id}
                    style={[styles.taskCard, isSelected && styles.taskCardSelected]}
                    onPress={() => toggleTask(task.id)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.taskName, isSelected && styles.taskNameSelected]}>
                        {task.name}
                      </Text>
                      <Text style={styles.taskDesc}>{task.description}</Text>
                    </View>

                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>

      {/* Confirm Selection Sticky Bar */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, selectedTaskIds.length === 0 && styles.buttonDisabled]}
          onPress={handleConfirmSelection}
          disabled={saving || selectedTaskIds.length === 0}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>
              Confirm Selection ({selectedTaskIds.length})
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.title
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.subtext
  },
  badge: {
    backgroundColor: '#E6EFFB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryButtonBg
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 24,
    marginBottom: 16,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.inputText
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100
  },
  categorySection: {
    marginBottom: 24
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.title
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10
  },
  taskCardSelected: {
    borderColor: Colors.primaryButtonBg,
    backgroundColor: '#F2F7F4'
  },
  taskName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.inputText,
    marginBottom: 4
  },
  taskNameSelected: {
    color: Colors.title
  },
  taskDesc: {
    fontSize: 13,
    color: Colors.subtext,
    lineHeight: 18
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12
  },
  checkboxSelected: {
    backgroundColor: Colors.primaryButtonBg,
    borderColor: Colors.primaryButtonBg
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.title,
    marginTop: 12
  },
  emptySub: {
    fontSize: 14,
    color: Colors.subtext,
    marginTop: 4
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: Colors.border
  },
  primaryButton: {
    backgroundColor: Colors.primaryButtonBg,
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonDisabled: {
    backgroundColor: Colors.disabledButtonBg
  },
  primaryButtonText: {
    color: Colors.primaryButtonText,
    fontSize: 16,
    fontWeight: '700'
  }
});
