import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Colors } from '../constants/colors';
import { PadosiLogo } from '../components/PadosiLogo';
import { authApi } from '../api/auth.api';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { email, mobileNumber } = useLocalSearchParams<{ email: string; mobileNumber: string }>();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 30-Second Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (text: string, index: number) => {
    if (errorMsg) setErrorMsg('');
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
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
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the OTP code.');
      return;
    }

    setLoading(true);
    try {
      if (email) {
        await authApi.verifyOtp(email, fullOtp);
      }
      setLoading(false);

      // Navigate to profile setup screen
      router.replace({
        pathname: '/profile-setup',
        params: { email, mobileNumber }
      });
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Invalid verification code.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <PadosiLogo />

        <Text style={styles.title}>Verify Email</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{' '}
          <Text style={styles.emailHighlight}>{email || 'your email'}</Text>. Code expires in 10 minutes.
        </Text>

        {/* 6-Digit OTP Inputs */}
        <View style={styles.otpRow}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null, errorMsg ? styles.otpBoxError : null]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, idx)}
            />
          ))}
        </View>

        {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

        {/* Resend Cooldown Section */}
        <View style={styles.resendSection}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendActiveText}>Resend OTP Code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend code in <Text style={styles.timerBold}>{timer}s</Text>
            </Text>
          )}
        </View>

        {/* Verify Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Verify & Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40
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
    fontWeight: '700',
    color: Colors.title
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBackground,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.inputText
  },
  otpBoxFilled: {
    borderColor: Colors.borderFocus
  },
  otpBoxError: {
    borderColor: Colors.borderError
  },
  errorText: {
    fontSize: 13,
    color: Colors.errorText,
    marginBottom: 16,
    textAlign: 'center'
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: 32
  },
  timerText: {
    fontSize: 14,
    color: Colors.subtext
  },
  timerBold: {
    fontWeight: '700',
    color: Colors.title
  },
  resendActiveText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryButtonBg
  },
  buttonContainer: {
    marginTop: 'auto'
  },
  primaryButton: {
    backgroundColor: Colors.darkButtonBg,
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
