import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface PadosiLogoProps {
  showLabel?: boolean;
}

export const PadosiLogo: React.FC<PadosiLogoProps> = ({ showLabel = true }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Ionicons name="home" size={26} color={Colors.logoSymbol} />
      </View>
      {showLabel && <Text style={styles.label}>PadosiPro</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginBottom: 20
  },
  logoBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.logoBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.brandText,
    letterSpacing: -0.2
  }
});
