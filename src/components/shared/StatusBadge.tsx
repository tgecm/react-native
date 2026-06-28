import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fontSize, spacing, borderRadius } from '../../utils/theme';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FEF3C7', text: '#92400E' },
  confirmed: { bg: '#DBEAFE', text: '#1E40AF' },
  preparing: { bg: '#EDE9FE', text: '#5B21B6' },
  ready: { bg: '#D1FAE5', text: '#065F46' },
  delivered: { bg: '#D1FAE5', text: '#065F46' },
  completed: { bg: '#F3F4F6', text: '#374151' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B' },
  active: { bg: '#D1FAE5', text: '#065F46' },
  inactive: { bg: '#F3F4F6', text: '#6B7280' },
  success: { bg: '#D1FAE5', text: '#065F46' },
  error: { bg: '#FEE2E2', text: '#991B1B' },
  warning: { bg: '#FEF3C7', text: '#92400E' },
  info: { bg: '#DBEAFE', text: '#1E40AF' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const lowerStatus = status?.toLowerCase() || '';
  const colorConfig = STATUS_COLORS[lowerStatus] || { bg: '#F3F4F6', text: '#6B7280' };
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colorConfig.bg },
        isSmall ? styles.badgeSm : styles.badgeMd,
      ]}
    >
      <Text style={[styles.text, { color: colorConfig.text }, isSmall ? styles.textSm : styles.textMd]}>
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeMd: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  text: {
    fontWeight: '500',
  },
  textSm: {
    fontSize: fontSize.xs,
  },
  textMd: {
    fontSize: fontSize.sm,
  },
});
