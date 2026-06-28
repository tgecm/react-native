import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useToastStore, ToastType } from '../../store/toastStore';
import { fontSize, spacing, borderRadius, shadows } from '../../utils/theme';

const TOAST_COLORS: Record<ToastType, { bg: string; text: string }> = {
  success: { bg: '#D1FAE5', text: '#065F46' },
  error: { bg: '#FEE2E2', text: '#991B1B' },
  warning: { bg: '#FEF3C7', text: '#92400E' },
  info: { bg: '#DBEAFE', text: '#1E40AF' },
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} message={toast.message} type={toast.type} />
      ))}
    </View>
  );
};

const ToastItem: React.FC<{ message: string; type: ToastType }> = ({ message, type }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(3000),
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [opacity]);

  const colors_type = TOAST_COLORS[type] || TOAST_COLORS.info;

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: colors_type.bg, opacity },
      ]}
    >
      <Text style={[styles.text, { color: colors_type.text }]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 9999,
  },
  toast: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.md,
  },
  text: {
    fontSize: fontSize.md,
    fontWeight: '500',
  },
});
