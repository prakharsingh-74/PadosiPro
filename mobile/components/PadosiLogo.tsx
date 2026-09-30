import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '../constants/colors';

interface PadosiLogoProps {
  showLabel?: boolean;
}

export const PadosiLogo: React.FC<PadosiLogoProps> = ({ showLabel = true }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/padosipro-logo.svg')} 
        style={styles.logoImage} 
        contentFit="contain"
      />
      {showLabel && <Text style={styles.label}>PadosiPro</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginBottom: 20
  },
  logoImage: {
    width: 58,
    height: 58,
    marginBottom: 8
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.brandText,
    letterSpacing: -0.2
  }
});
