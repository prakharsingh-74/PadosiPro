import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { PadosiLogo } from '../components/PadosiLogo';
import { authApi } from '../api/auth.api';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();

  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');

  const [mobileError, setMobileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if fields are filled out correctly
  const cleanMobile = mobileNumber.replace(/\D/g, '');
  const isMobileValid = cleanMobile.length === 10 && /^[6-9]/.test(cleanMobile);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email.trim());

  const isFormFilled = isMobileValid && isEmailValid;

  // Inline Validation on submit
  const validate = () => {
    let isValid = true;

    if (!cleanMobile) {
      setMobileError('Mobile number is required');
      isValid = false;
    } else if (!isMobileValid) {
      setMobileError('Please enter a valid 10-digit mobile number');
      isValid = false;
    } else {
      setMobileError('');
    }

    if (!email.trim()) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!isEmailValid) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  };

  const handleGetOtp = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // Send API request to Express Backend -> Triggers Real OTP Email!
      await authApi.requestOtp(email.trim(), mobileNumber.trim());
      setLoading(false);

      // Navigate to OTP verification screen
      router.push({
        pathname: '/verify-otp',
        params: { email: email.trim(), mobileNumber: mobileNumber.trim() }
      });
    } catch (err: any) {
      setLoading(false);
      // Fallback navigation in dev environment if backend is offline or network fails
      Alert.alert(
        'Backend Notice',
        err.message || 'Connecting to backend service...',
        [
          {
            text: 'Continue to OTP Verification',
            onPress: () => {
              router.push({
                pathname: '/verify-otp',
                params: { email: email.trim(), mobileNumber: mobileNumber.trim() }
              });
            }
          }
        ]
      );
    }
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
          {/* Logo & Brand Header */}
          <PadosiLogo />

          {/* Heading Section */}
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>
            Enter your mobile number and email. We'll send the OTP to your email.
          </Text>

          {/* Form Fields */}
          <View style={styles.formGroup}>
            {/* Mobile Number Input */}
            <Text style={styles.label}>Mobile number</Text>
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

            {/* Email Input */}
            <Text style={[styles.label, { marginTop: 20 }]}>Email</Text>
            <View style={[styles.inputContainer, emailError ? styles.inputErrorBorder : null]}>
              <Feather name="mail" size={18} color={Colors.iconColor} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={Colors.placeholderText}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                }}
              />
            </View>
            {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
          </View>

          {/* Action Button at Bottom */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                isFormFilled ? styles.enabledDarkButton : styles.disabledButton
              ]}
              onPress={handleGetOtp}
              activeOpacity={0.8}
              disabled={!isFormFilled || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Get OTP</Text>
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
    marginBottom: 32
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
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center'
  },
  disabledButton: {
    backgroundColor: Colors.disabledButtonBg,
    opacity: 0.8
  },
  enabledDarkButton: {
    backgroundColor: Colors.darkButtonBg,
    elevation: 3,
    shadowColor: Colors.darkButtonBg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  primaryButtonText: {
    color: Colors.primaryButtonText,
    fontSize: 16,
    fontWeight: '700'
  }
});
