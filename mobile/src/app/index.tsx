import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { PadosiLogo } from '../components/PadosiLogo';
import { useRouter } from 'expo-router';

export default function WelcomeRegisterScreen() {
  const router = useRouter();

  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Errors state
  const [mobileError, setMobileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  // Inline Validation
  const validate = () => {
    let isValid = true;

    // Mobile Validation (10 digits starting with 6-9)
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (!cleanMobile) {
      setMobileError('Mobile number is required');
      isValid = false;
    } else if (cleanMobile.length !== 10 || !/^[6-9]/.test(cleanMobile)) {
      setMobileError('Please enter a valid 10-digit Indian mobile number');
      isValid = false;
    } else {
      setMobileError('');
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Password Validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Confirm Password Validation
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const handleGetOtp = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // In production, calls Express backend POST /api/auth/register
      // For instant review/demo, navigate directly to verify OTP screen
      setTimeout(() => {
        setLoading(false);
        router.push({
          pathname: '/verify-otp',
          params: { email: email.trim(), mobileNumber: mobileNumber.trim() }
        });
      }, 800);
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Error', err.message || 'Failed to send OTP code');
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
            <Text style={[styles.label, { marginTop: 16 }]}>Email</Text>
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

            {/* Password Input */}
            <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
            <View style={[styles.inputContainer, passwordError ? styles.inputErrorBorder : null]}>
              <Feather name="lock" size={18} color={Colors.iconColor} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.placeholderText}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={18}
                  color={Colors.iconColor}
                />
              </TouchableOpacity>
            </View>
            {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

            {/* Confirm Password Input */}
            <Text style={[styles.label, { marginTop: 16 }]}>Confirm password</Text>
            <View style={[styles.inputContainer, confirmPasswordError ? styles.inputErrorBorder : null]}>
              <Feather name="lock" size={18} color={Colors.iconColor} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.placeholderText}
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmPasswordError) setConfirmPasswordError('');
                }}
              />
            </View>
            {!!confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}
          </View>

          {/* Action Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleGetOtp}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Get OTP</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLinkContainer}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginLinkText}>
                Already have an account? <Text style={styles.loginLinkBold}>Log in</Text>
              </Text>
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
    marginTop: 'auto',
    gap: 16
  },
  primaryButton: {
    backgroundColor: Colors.primaryButtonBg,
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primaryButtonBg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2
  },
  buttonDisabled: {
    opacity: 0.7
  },
  primaryButtonText: {
    color: Colors.primaryButtonText,
    fontSize: 16,
    fontWeight: '700'
  },
  loginLinkContainer: {
    alignItems: 'center',
    paddingVertical: 8
  },
  loginLinkText: {
    fontSize: 14,
    color: Colors.subtext
  },
  loginLinkBold: {
    fontWeight: '700',
    color: Colors.title
  }
});
