import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';

export default function ProfileSetupScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [society, setSociety] = useState('');
  const [flat, setFlat] = useState('');
  const [gateNotes, setGateNotes] = useState('');
  
  const [locationName, setLocationName] = useState('Select location');
  const [loading, setLoading] = useState(false);

  const isFormFilled = name.trim().length > 0;

  const promptForLocation = () => {
    Alert.alert(
      "Detect Location",
      "Would you like us to automatically detect your current location to help your Lifestyle Manager?",
      [
        { text: "No, skip", style: "cancel" },
        { 
          text: "Yes, auto-detect", 
          onPress: async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission denied', 'Could not access location.');
              return;
            }
            try {
              let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
              if (!loc) {
                Alert.alert('Location Error', 'Could not get your current position. Make sure GPS is enabled on your emulator.');
                return;
              }
              
              let geocode = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude
              });

              if (geocode && geocode.length > 0) {
                const place = geocode[0];
                const detectedCity = place.city || place.subregion || place.region || 'Detected Location';
                setLocationName(detectedCity);
                
                const fullAddress = [place.name, place.street, place.subregion].filter(Boolean).join(', ');
                if (fullAddress) setAddress(fullAddress);
              } else {
                Alert.alert('Geocoding Failed', 'We got your coordinates, but could not find the city name.');
              }
            } catch (error: any) {
              Alert.alert('GPS Error', error.message || 'Something went wrong fetching your location.');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    promptForLocation();
  }, []);

  const handleSaveProfile = async () => {
    if (!isFormFilled) return;

    setLoading(true);
    try {

      const { profileApi } = require('../lib/profile.api');
      
      await profileApi.saveProfile({
        full_name: name,
        address: address,
        society: society,
        flat: flat,
        gate_notes: gateNotes,
        location_name: locationName
      });

      setLoading(false);
      router.replace({
        pathname: '/(app)/home'
      });
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Save Failed', error.message || 'Could not save your profile details.');
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
          <TouchableOpacity style={styles.locationHeader} onPress={promptForLocation} activeOpacity={0.7}>
            <Feather name="map-pin" size={14} color="#D4AF37" />
            <Text style={styles.locationText}>{locationName}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>A few details</Text>
          <Text style={styles.subtitle}>
            So your Lifestyle Manager can coordinate visits and deliveries smoothly.
          </Text>

          <View style={styles.formGroup}>
            {/* Full Name */}
            <Text style={styles.label}>Full name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="As you would like us to use"
                placeholderTextColor={Colors.placeholderText}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Address & area */}
            <Text style={[styles.label, { marginTop: 24 }]}>Address & area</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Road, area, landmark"
                placeholderTextColor={Colors.placeholderText}
                multiline
                numberOfLines={3}
                value={address}
                onChangeText={setAddress}
              />
            </View>

            {/* Society / building (optional) */}
            <Text style={[styles.label, { marginTop: 24 }]}>Society / building (optional)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name as on the gate"
                placeholderTextColor={Colors.placeholderText}
                value={society}
                onChangeText={setSociety}
              />
            </View>

            {/* Flat / unit (optional) */}
            <Text style={[styles.label, { marginTop: 24 }]}>Flat / unit (optional)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="e.g. Tower B, 1204"
                placeholderTextColor={Colors.placeholderText}
                value={flat}
                onChangeText={setFlat}
              />
            </View>

            {/* Gate or entry notes (optional) */}
            <Text style={[styles.label, { marginTop: 24 }]}>Gate or entry notes (optional)</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Anything the team should know at entry"
                placeholderTextColor={Colors.placeholderText}
                multiline
                numberOfLines={3}
                value={gateNotes}
                onChangeText={setGateNotes}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Text style={styles.hintText}>Enter your full name to continue.</Text>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                isFormFilled ? styles.enabledDarkButton : styles.disabledButton
              ]}
              onPress={handleSaveProfile}
              disabled={!isFormFilled || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <Text style={styles.primaryButtonText}>Saving...</Text>
              ) : (
                <Text style={styles.primaryButtonText}>Continue</Text>
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
    backgroundColor: '#FAF9F6'
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    flexGrow: 1
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  locationText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D4AF37',
    textTransform: 'capitalize',
    marginLeft: 6
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0E2925',
    marginBottom: 12,
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5C736C',
    marginBottom: 32
  },
  formGroup: {
    marginBottom: 32
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#738C84',
    marginBottom: 8
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    justifyContent: 'center'
  },
  textAreaContainer: {
    height: 84,
    alignItems: 'flex-start',
    paddingTop: 12
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0E2925',
    paddingVertical: 0
  },
  textArea: {
    textAlignVertical: 'top'
  },
  buttonContainer: {
    marginTop: 'auto',
    alignItems: 'center'
  },
  hintText: {
    fontSize: 12,
    color: '#5C736C',
    marginBottom: 16
  },
  primaryButton: {
    borderRadius: 12,
    height: 54,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  disabledButton: {
    backgroundColor: '#91B3A7', 
    opacity: 0.8
  },
  enabledDarkButton: {
    backgroundColor: '#133330',
    elevation: 3,
    shadowColor: '#133330',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  }
});
