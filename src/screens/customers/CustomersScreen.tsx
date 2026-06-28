import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getUsers } from '../../services/api/customers';
import { useSelectedBot } from '../../hooks/useSelectedBot';
import { ListSkeleton } from '../../components/shared/LoadingSkeleton';
import { colors, fontSize, spacing, borderRadius, shadows, commonStyles } from '../../utils/theme';
import { formatCurrency } from '../../utils/format';
import { Customer } from '../../types';

export const CustomersScreen: React.FC = () => {
  const { selectedBotId } = useSelectedBot();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { data: customers, isLoading, refetch } = useQuery({
    queryKey: ['customers', selectedBotId],
    queryFn: () => getUsers({ bot_id: selectedBotId }),
    enabled: !!selectedBotId,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const filteredCustomers = customers?.filter((c: Customer) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.username?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    );
  });

  const renderCustomer = ({ item }: { item: Customer }) => (
    <View style={styles.customerCard}>
      <View style={styles.avatar}>
        <Icon name="account" size={24} color={colors.primary} />
      </View>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.name || 'Unknown'}</Text>
        {item.username && (
          <Text style={styles.customerUsername}>@{item.username}</Text>
        )}
        {item.phone && (
          <Text style={styles.customerPhone}>{item.phone}</Text>
        )}
        <View style={styles.statsRow}>
          <Text style={styles.statText}>
            Orders: {item.order_count || 0}
          </Text>
          <Text style={styles.statText}>
            Spent: {formatCurrency(item.total_spent || 0)}
          </Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={commonStyles.screenContainer}>
        <ListSkeleton count={10} />
      </View>
    );
  }

  return (
    <View style={commonStyles.screenContainer}>
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search customers..."
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCustomer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="account-off" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyText}>No customers found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: spacing.lg,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  customerCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    flexDirection: 'row',
    ...shadows.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  customerUsername: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  customerPhone: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.xs,
    gap: spacing.lg,
  },
  statText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
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
