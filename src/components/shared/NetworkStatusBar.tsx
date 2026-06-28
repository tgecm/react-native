import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { colors, fontSize, spacing } from '../../utils/theme';

export const NetworkStatusBar: React.FC = () => {
  const { isConnected } = useNetworkStatus();

  if (isConnected) return null;

  return (
    <View style={styles.bar}>
      <Text style={styles.text}>No internet connection — using cached data</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.warning,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  text: {
    color: colors.textInverse,
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
});
