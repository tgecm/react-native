import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../../store';
import { colors, fontSize, spacing, borderRadius, shadows, commonStyles } from '../../utils/theme';

const PLANS = [
  {
    name: 'Basic',
    price: 'Free',
    features: ['Basic bot features', 'Up to 100 products'],
    color: colors.textSecondary,
  },
  {
    name: 'Standard',
    price: 'Paid',
    features: ['E-commerce website', 'AI agent (own API)', 'Staff accounts', 'No watermark'],
    color: colors.info,
  },
  {
    name: 'Pro',
    price: 'Paid',
    features: ['Custom domain', 'QR menu', 'Shop banner', 'AI agent included', 'Multi-platform'],
    color: colors.primary,
  },
  {
    name: 'Business',
    price: 'Paid',
    features: ['Up to 3 custom domains', 'Email notifications', 'All Pro features', 'Priority support'],
    color: colors.warning,
  },
];

export const SubscriptionScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const currentPlan = user?.plan?.toLowerCase() || 'free';

  return (
    <ScrollView style={commonStyles.screenContainer} contentContainerStyle={styles.content}>
      <Text style={styles.currentPlanText}>
        Current Plan: <Text style={styles.currentPlanName}>{user?.plan || 'Free'}</Text>
      </Text>

      {PLANS.map((plan, index) => {
        const isCurrentPlan = plan.name.toLowerCase() === currentPlan;
        return (
          <View
            key={index}
            style={[
              styles.planCard,
              isCurrentPlan && styles.currentPlanCard,
            ]}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              {isCurrentPlan && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Current</Text>
                </View>
              )}
            </View>
            <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
            <View style={styles.features}>
              {plan.features.map((feature, idx) => (
                <View key={idx} style={styles.featureRow}>
                  <Icon name="check-circle" size={18} color={colors.success} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            {!isCurrentPlan && (
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  currentPlanText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  currentPlanName: {
    fontWeight: '700',
    color: colors.primary,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  currentPlanCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  currentBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  currentBadgeText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  planPrice: {
    fontSize: fontSize.display,
    fontWeight: '700',
    marginVertical: spacing.md,
  },
  features: {
    marginBottom: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: colors.textInverse,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
