import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { PadosiLogo } from '../components/PadosiLogo';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    let valid = true;
    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // If returning user, navigate to Home directly; if first time, navigate to task selection
      router.replace('/task-selection');
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <PadosiLogo />

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to manage your household lifestyle services.</Text>

        {/* Email Input */}
        <Text style={styles.label}>Email</Text>
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

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Log in</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerLinkContainer}
            onPress={() => router.push('/')}
          >
            <Text style={styles.registerLinkText}>
              Don't have an account? <Text style={styles.registerLinkBold}>Sign up</Text>
            </Text>
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
    marginBottom: 28
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
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.7
  },
  primaryButtonText: {
    color: Colors.primaryButtonText,
    fontSize: 16,
    fontWeight: '700'
  },
  registerLinkContainer: {
    alignItems: 'center',
    paddingVertical: 8
  },
  registerLinkText: {
    fontSize: 14,
    color: Colors.subtext
  },
  registerLinkBold: {
    fontWeight: '700',
    color: Colors.title
  }
});
