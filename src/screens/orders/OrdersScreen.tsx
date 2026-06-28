import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getOrders, updateOrderStatus } from '../../services/api/orders';
import { useSelectedBot } from '../../hooks/useSelectedBot';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { ListSkeleton } from '../../components/shared/LoadingSkeleton';
import { colors, fontSize, spacing, borderRadius, shadows, commonStyles } from '../../utils/theme';
import { formatDateTime, formatCurrency } from '../../utils';
import { useToastStore } from '../../store';
import { Order, OrderStatus } from '../../types';

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'completed', 'cancelled'];

export const OrdersScreen: React.FC = () => {
  const { selectedBotId } = useSelectedBot();
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ visible: boolean; orderId: number; status: OrderStatus }>({
    visible: false,
    orderId: 0,
    status: 'confirmed',
  });
  const addToast = useToastStore((s) => s.addToast);

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['orders', selectedBotId, statusFilter],
    queryFn: () => getOrders({ bot_id: selectedBotId, status: statusFilter !== 'all' ? statusFilter : undefined }),
    enabled: !!selectedBotId,
    refetchInterval: 15000,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleStatusUpdate = async () => {
    try {
      await updateOrderStatus(confirmDialog.orderId, { status: confirmDialog.status });
      addToast('Order status updated', 'success');
      refetch();
    } catch {
      addToast('Failed to update order status', 'error');
    }
    setConfirmDialog({ visible: false, orderId: 0, status: 'confirmed' });
  };

  const filteredOrders = orders?.filter((o: Order) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.id.toString().includes(q) ||
      o.customer_name?.toLowerCase().includes(q) ||
      o.customer_phone?.includes(q)
    );
  });

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text style={styles.orderDate}>{formatDateTime(item.created_at)}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      {item.customer_name && (
        <Text style={styles.customerName}>{item.customer_name}</Text>
      )}
      {item.customer_phone && (
        <Text style={styles.customerPhone}>{item.customer_phone}</Text>
      )}

      <View style={styles.itemsList}>
        {(item.items || []).slice(0, 3).map((oi: any, idx: number) => (
          <Text key={idx} style={styles.itemText}>
            {oi.quantity}x {oi.name}
          </Text>
        ))}
        {(item.items || []).length > 3 && (
          <Text style={styles.moreItems}>+{item.items.length - 3} more items</Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalAmount}>{formatCurrency(item.total_amount)}</Text>
        <View style={styles.actionButtons}>
          {item.status === 'pending' && (
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => setConfirmDialog({ visible: true, orderId: item.id, status: 'confirmed' })}
            >
              <Text style={styles.smallButtonText}>Confirm</Text>
            </TouchableOpacity>
          )}
          {item.status === 'confirmed' && (
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => setConfirmDialog({ visible: true, orderId: item.id, status: 'preparing' })}
            >
              <Text style={styles.smallButtonText}>Prepare</Text>
            </TouchableOpacity>
          )}
          {item.status === 'preparing' && (
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => setConfirmDialog({ visible: true, orderId: item.id, status: 'ready' })}
            >
              <Text style={styles.smallButtonText}>Ready</Text>
            </TouchableOpacity>
          )}
          {item.status === 'ready' && (
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => setConfirmDialog({ visible: true, orderId: item.id, status: 'delivered' })}
            >
              <Text style={styles.smallButtonText}>Deliver</Text>
            </TouchableOpacity>
          )}
          {(item.status === 'delivered' || item.status === 'ready') && (
            <TouchableOpacity
              style={[styles.smallButton, styles.cancelButton]}
              onPress={() => setConfirmDialog({ visible: true, orderId: item.id, status: 'cancelled' })}
            >
              <Text style={[styles.smallButtonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={commonStyles.screenContainer}>
        <ListSkeleton count={8} />
      </View>
    );
  }

  return (
    <View style={commonStyles.screenContainer}>
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search orders..."
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        horizontal
        data={STATUS_FILTERS}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filter, statusFilter === item && styles.activeFilter]}
            onPress={() => setStatusFilter(item)}
          >
            <Text style={[styles.filterText, statusFilter === item && styles.activeFilterText]}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrder}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="package-variant-closed" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />

      <ConfirmDialog
        visible={confirmDialog.visible}
        title="Update Order Status"
        message={`Change order #${confirmDialog.orderId} status to "${confirmDialog.status}"?`}
        confirmText="Update"
        type="info"
        onConfirm={handleStatusUpdate}
        onCancel={() => setConfirmDialog({ visible: false, orderId: 0, status: 'confirmed' })}
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
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  filter: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
    marginRight: spacing.sm,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeFilterText: {
    color: colors.textInverse,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    ...shadows.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  orderId: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  orderDate: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginTop: 2,
  },
  customerName: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  customerPhone: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  itemsList: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  itemText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  moreItems: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  totalAmount: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  smallButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  smallButtonText: {
    color: colors.textInverse,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: colors.error + '20',
  },
  cancelButtonText: {
    color: colors.error,
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
