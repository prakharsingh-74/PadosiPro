import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SubTask {
  id: string;
  name: string;
  services?: string[];
}

interface Category {
  id: string;
  name: string;
  desc: string;
  icon: string;
  subTasks: SubTask[];
  isSoon?: boolean;
}

import { ActivityIndicator } from 'react-native';
import { TaskAPI } from '../api/task.api';

export default function TaskSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Expand the category passed from home screen, otherwise default to null initially
  const [expandedCategory, setExpandedCategory] = useState<string | null>((params.categoryId as string) || null);
  const [selectedSubTask, setSelectedSubTask] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  React.useEffect(() => {
    TaskAPI.getCatalog().then(data => {
      const mapped: Category[] = data.map((c: any) => ({
        id: c.id,
        name: c.name,
        desc: c.description,
        icon: c.icon_name,
        isSoon: c.is_soon,
        subTasks: (c.tasks || []).map((t: any) => ({
          id: t.id,
          name: t.name,
          services: t.services
        }))
      }));
      setCategories(mapped);
      
      if (!params.categoryId && mapped.length > 0) {
        setExpandedCategory(mapped[0].id);
      } else if (params.categoryId) {
        const exists = mapped.find(c => c.id === params.categoryId);
        if (!exists && mapped.length > 0) setExpandedCategory(mapped[0].id);
      }
      
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [params.categoryId]);

  const handleContinue = () => {
    router.push({ pathname: '/task-timing', params: { taskId: selectedSubTask } });
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
        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#137333" />
            <Text style={{ marginTop: 10, color: '#5C736C' }}>Loading services...</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {categories.map((cat) => {
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
                      {cat.subTasks.map((sub, idx) => {
                        const isSubSelected = selectedSubTask === sub.id;
                        return (
                          <TouchableOpacity 
                            key={idx} 
                            style={[styles.subtaskPill, isSubSelected && styles.subtaskPillSelected]}
                            onPress={() => {
                              setSelectedSubTask(isSubSelected ? null : sub.id);
                              setSelectedService(null);
                            }}
                          >
                            <Text style={[styles.subtaskText, isSubSelected && styles.subtaskTextSelected]}>
                              {sub.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Render specific services for the selected sub-task if available */}
                    {cat.subTasks.find(s => s.id === selectedSubTask)?.services && (
                      <View style={{ marginTop: 20 }}>
                        <Text style={styles.subtasksTitle}>CHOOSE A SERVICE</Text>
                        <View style={styles.servicesGrid}>
                          {cat.subTasks.find(s => s.id === selectedSubTask)!.services!.map((service, sIdx) => {
                            const isServiceSelected = selectedService === service;
                            return (
                              <TouchableOpacity 
                                key={sIdx} 
                                style={[styles.servicePill, isServiceSelected && styles.servicePillSelected]}
                                onPress={() => setSelectedService(isServiceSelected ? null : service)}
                              >
                                <Text style={[styles.serviceText, isServiceSelected && styles.serviceTextSelected]}>{service}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        )}
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
    paddingLeft: 74, 
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
  subtaskPillSelected: {
    backgroundColor: '#133330',
    borderColor: '#133330'
  },
  subtaskText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0E2925'
  },
  subtaskTextSelected: {
    color: '#FFFFFF'
  },
  servicesGrid: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8
  },
  servicePill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  servicePillSelected: {
    backgroundColor: '#133330',
    borderColor: '#133330'
  },
  serviceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0E2925'
  },
  serviceTextSelected: {
    color: '#FFFFFF'
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
