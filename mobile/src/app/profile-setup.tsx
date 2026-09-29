import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { PadosiLogo } from '../components/PadosiLogo';
import { useRouter } from 'expo-router';

export default function ProfileSetupScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [businessName, setBusinessName] = useState('');

  const [nameError, setNameError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = () => {
    let valid = true;

    if (!name.trim()) {
      setNameError('Full name is required');
      valid = false;
    } else {
      setNameError('');
    }

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10) {
      setMobileError('Please enter a valid 10-digit Indian mobile number');
      valid = false;
    } else {
      setMobileError('');
    }

    if (!address.trim()) {
      setAddressError('Address is required');
      valid = false;
    } else {
      setAddressError('');
    }

    if (!valid) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Proceed to Task Selection
      router.replace('/task-selection');
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <PadosiLogo />

          <Text style={styles.title}>Tell us about you</Text>
          <Text style={styles.subtitle}>
            Set up your profile so your Lifestyle Manager can serve your household best.
          </Text>

          <View style={styles.formGroup}>
            {/* Full Name */}
            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputContainer, nameError ? styles.inputErrorBorder : null]}>
              <Feather name="user" size={18} color={Colors.iconColor} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Rahul Sharma"
                placeholderTextColor={Colors.placeholderText}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (nameError) setNameError('');
                }}
              />
            </View>
            {!!nameError && <Text style={styles.errorText}>{nameError}</Text>}

            {/* Mobile Number */}
            <Text style={[styles.label, { marginTop: 16 }]}>Mobile number</Text>
            <View style={[styles.inputContainer, mobileError ? styles.inputErrorBorder : null]}>
              <Feather name="phone" size={18} color={Colors.iconColor} style={styles.inputIcon} />
              <Text style={styles.prefixText}>+91</Text>
              <TextInput
                style={styles.input}
                placeholder="98765 43210"
                placeholderTextColor={Colors.placeholderText}
                keyboardType="number-pad"
                maxLength={10}
                value={mobileNumber}
                onChangeText={(text) => {
                  setMobileNumber(text);
                  if (mobileError) setMobileError('');
                }}
              />
            </View>
            {!!mobileError && <Text style={styles.errorText}>{mobileError}</Text>}

            {/* Address */}
            <Text style={[styles.label, { marginTop: 16 }]}>Delivery / Service Address</Text>
            <View style={[styles.inputContainer, { height: 72, alignItems: 'flex-start', paddingTop: 12 }, addressError ? styles.inputErrorBorder : null]}>
              <Feather name="map-pin" size={18} color={Colors.iconColor} style={[styles.inputIcon, { marginTop: 2 }]} />
              <TextInput
                style={[styles.input, { textAlignVertical: 'top' }]}
                placeholder="Flat 402, Green Valley Apartments, Indiranagar, Bengaluru"
                placeholderTextColor={Colors.placeholderText}
                multiline
                numberOfLines={2}
                value={address}
                onChangeText={(text) => {
                  setAddress(text);
                  if (addressError) setAddressError('');
                }}
              />
            </View>
            {!!addressError && <Text style={styles.errorText}>{addressError}</Text>}

            {/* Business Name (Optional) */}
            <Text style={[styles.label, { marginTop: 16 }]}>
              Business Name <Text style={styles.optionalText}>(Optional)</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Feather name="briefcase" size={18} color={Colors.iconColor} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Sharma Enterprises or Home Office"
                placeholderTextColor={Colors.placeholderText}
                value={businessName}
                onChangeText={setBusinessName}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleSaveProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Save & Pick Tasks</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    flexGrow: 1
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.title,
    marginBottom: 8,
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.subtext,
    marginBottom: 28
  },
  formGroup: {
    marginBottom: 32
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.labelText,
    marginBottom: 8
  },
  optionalText: {
    fontWeight: '400',
    color: '#94A3B8'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52
  },
  inputErrorBorder: {
    borderColor: Colors.borderError
  },
  inputIcon: {
    marginRight: 10
  },
  prefixText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.inputText,
    marginRight: 8
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.inputText,
    paddingVertical: 0
  },
  errorText: {
    fontSize: 12,
    color: Colors.errorText,
    marginTop: 6,
    marginLeft: 4
  },
  buttonContainer: {
    marginTop: 'auto'
  },
  primaryButton: {
    backgroundColor: Colors.primaryButtonBg,
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.7
  },
  primaryButtonText: {
    color: Colors.primaryButtonText,
    fontSize: 16,
    fontWeight: '700'
  }
});
