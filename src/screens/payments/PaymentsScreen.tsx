import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getPaymentMethods } from '../../services/api/payments';
import { useSelectedBot } from '../../hooks/useSelectedBot';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { ListSkeleton } from '../../components/shared/LoadingSkeleton';
import { colors, fontSize, spacing, borderRadius, shadows, commonStyles } from '../../utils/theme';
import { PaymentMethod } from '../../types';

export const PaymentsScreen: React.FC = () => {
  const { selectedBotId } = useSelectedBot();

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments', selectedBotId],
    queryFn: () => getPaymentMethods({ bot_id: selectedBotId }),
    enabled: !!selectedBotId,
  });

  if (isLoading) {
    return (
      <View style={commonStyles.screenContainer}>
        <ListSkeleton count={5} />
      </View>
    );
  }

  const renderPayment = ({ item }: { item: PaymentMethod }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.paymentType}>
          <Icon
            name={item.type === 'bank' ? 'bank' : 'wallet'}
            size={24}
            color={colors.primary}
          />
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentName}>{item.name}</Text>
            <Text style={styles.paymentTypeText}>{item.type}</Text>
          </View>
        </View>
        <StatusBadge status={item.status} />
      </View>
      {item.details && (
        <Text style={styles.details} numberOfLines={2}>
          {item.details}
        </Text>
      )}
    </View>
  );

  return (
    <View style={commonStyles.screenContainer}>
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPayment}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="wallet-off" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyText}>No payment methods</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentInfo: {
    marginLeft: spacing.md,
  },
  paymentName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  paymentTypeText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  details: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textTertiary,
    marginTop: spacing.md,
  },
});
