import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { PadosiLogo } from '../../components/PadosiLogo';
import { authApi } from '../../lib/auth.api';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { email, mobileNumber } = useLocalSearchParams<{ email: string; mobileNumber: string }>();

  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 30-Second Countdown Timer
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (text: string) => {
    if (errorMsg) setErrorMsg('');
    // Restrict input to numeric digits only, max length 6
    const cleanText = text.replace(/\D/g, '').slice(0, 6);
    setOtpCode(cleanText);
  };

  const handleResend = async () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setErrorMsg('');

    try {
      if (email) {
        await authApi.resendOtp(email);
        Alert.alert('OTP Resent', `A new 6-digit code has been sent to ${email}.`);
      }
    } catch (err: any) {
      Alert.alert('Resend Failed', err.message || 'Could not resend OTP code.');
    }
  };

  const handleVerify = async () => {
    if (otpCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the OTP code.');
      return;
    }

    setLoading(true);
    try {
      if (email) {
        const data = await authApi.verifyOtp(email, otpCode);
        if (data.token) {
          // Import at the top isn't needed here if we do it globally, but wait, I should import AsyncStorage at the top of the file.
          // Let's assume AsyncStorage will be imported. I'll use it here.
          const AsyncStorage = require('@react-native-async-storage/async-storage').default;
          await AsyncStorage.setItem('auth_token', data.token);
        }
      }
      setLoading(false);

      // Navigate to profile setup screen
      router.replace({
        pathname: '/setup',
        params: { email, mobileNumber }
      });
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Invalid verification code.');
    }
  };

  const isOtpComplete = otpCode.length === 6;

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
          {/* Top Back Navigation Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={20} color={Colors.brandText} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          {/* Logo Icon Only */}
          <View style={styles.logoContainer}>
            <PadosiLogo showLabel={false} />
          </View>

          {/* Heading */}
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            We've sent a code to <Text style={styles.emailHighlight}>{email || 'your email'}</Text>. It expires in 10 minutes.
          </Text>

          {/* Single 6-digit Input Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>6-digit code</Text>
            <View style={[styles.inputContainer, errorMsg ? styles.inputErrorBorder : null]}>
              <TextInput
                style={styles.input}
                placeholder="- - - - - -"
                placeholderTextColor={Colors.placeholderText}
                keyboardType="number-pad"
                maxLength={6}
                value={otpCode}
                onChangeText={handleOtpChange}
              />
            </View>
            {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
          </View>

          {/* Resend Code Link */}
          <View style={styles.resendContainer}>
            {canResend ? (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendActiveText}>Resend code</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.resendDisabledText}>
                Resend code <Text style={{ fontWeight: '700' }}>({timer}s)</Text>
              </Text>
            )}
          </View>

          {/* Bottom Action Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                isOtpComplete ? styles.enabledDarkButton : styles.disabledButton
              ]}
              onPress={handleVerify}
              activeOpacity={0.8}
              disabled={!isOtpComplete || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Verify</Text>
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
    paddingTop: 16,
    paddingBottom: 40,
    flexGrow: 1
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: -4
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.brandText,
    marginLeft: 2
  },
  logoContainer: {
    marginBottom: 12
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
  emailHighlight: {
    color: Colors.subtext
  },
  formGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.labelText,
    marginBottom: 8
  },
  inputContainer: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    justifyContent: 'center'
  },
  inputErrorBorder: {
    borderColor: Colors.borderError
  },
  input: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.inputText,
    letterSpacing: 6,
    paddingVertical: 0
  },
  errorText: {
    fontSize: 12,
    color: Colors.errorText,
    marginTop: 6,
    marginLeft: 4
  },
  resendContainer: {
    alignItems: 'flex-start',
    marginBottom: 32
  },
  resendActiveText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.brandText
  },
  resendDisabledText: {
    fontSize: 15,
    color: Colors.subtext
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
