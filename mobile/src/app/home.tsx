import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { PadosiLogo } from '../components/PadosiLogo';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of PadosiPro?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          router.replace('/login');
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Header */}
      <View style={styles.header}>
        <PadosiLogo showLabel={true} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={18} color={Colors.errorText} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Manager Banner */}
        <View style={styles.managerCard}>
          <View style={styles.avatarBox}>
            <Ionicons name="person" size={24} color={Colors.primaryButtonBg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.managerTitle}>Lifestyle Manager Assigned</Text>
            <Text style={styles.managerSub}>Ananya will be managing your selected household tasks.</Text>
          </View>
        </View>

        {/* Selected Tasks Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Selected Tasks</Text>
          <TouchableOpacity onPress={() => router.push('/task-selection')}>
            <Text style={styles.editLink}>Edit Tasks</Text>
          </TouchableOpacity>
        </View>

        {/* List of active tasks */}
        <View style={styles.taskCard}>
          <View style={styles.taskIconBox}>
            <Feather name="sparkles" size={20} color={Colors.primaryButtonBg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.taskName}>Deep Home Cleaning</Text>
            <Text style={styles.taskCat}>Home & Maintenance</Text>
          </View>
          <View style={styles.statusChip}>
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>

        <View style={styles.taskCard}>
          <View style={styles.taskIconBox}>
            <Feather name="shopping-bag" size={20} color={Colors.primaryButtonBg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.taskName}>Fresh Organic Grocery Pick-up</Text>
            <Text style={styles.taskCat}>Errands & Shopping</Text>
          </View>
          <View style={styles.statusChip}>
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>

        <View style={styles.taskCard}>
          <View style={styles.taskIconBox}>
            <Feather name="file-text" size={20} color={Colors.primaryButtonBg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.taskName}>Utility Bill Management</Text>
            <Text style={styles.taskCat}>Administrative & Pet Care</Text>
          </View>
          <View style={styles.statusChip}>
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FEE2E2'
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.errorText
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40
  },
  managerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F0F7F4',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D4E5DE',
    marginBottom: 28
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center'
  },
  managerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.title,
    marginBottom: 2
  },
  managerSub: {
    fontSize: 13,
    color: Colors.subtext,
    lineHeight: 18
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.title
  },
  editLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryButtonBg
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12
  },
  taskIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F2F7F4',
    justifyContent: 'center',
    alignItems: 'center'
  },
  taskName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.inputText,
    marginBottom: 2
  },
  taskCat: {
    fontSize: 12,
    color: Colors.subtext
  },
  statusChip: {
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#137333'
  }
});
