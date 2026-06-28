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
import { getProducts, getCategories, deleteProduct } from '../../services/api/products';
import { useSelectedBot } from '../../hooks/useSelectedBot';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { ListSkeleton } from '../../components/shared/LoadingSkeleton';
import { colors, fontSize, spacing, borderRadius, shadows, commonStyles } from '../../utils/theme';
import { formatCurrency } from '../../utils/format';
import { useToastStore } from '../../store';
import { Product } from '../../types';

export const ProductsScreen: React.FC = () => {
  const { selectedBotId } = useSelectedBot();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const addToast = useToastStore((s) => s.addToast);

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['products', selectedBotId],
    queryFn: () => getProducts({ bot_id: selectedBotId }),
    enabled: !!selectedBotId,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories', selectedBotId],
    queryFn: () => getCategories({ bot_id: selectedBotId }),
    enabled: !!selectedBotId,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget);
      addToast('Product deleted', 'success');
      refetch();
    } catch {
      addToast('Failed to delete product', 'error');
    }
    setDeleteTarget(null);
  };

  const categoryMap = new Map<number, string>(
    (categories || []).map((c: any) => [c.id, c.name]),
  );

  const filteredProducts = products?.filter((p: Product) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const categoryName = p.category_id ? categoryMap.get(p.category_id) || '' : '';
    return (
      p.name.toLowerCase().includes(q) ||
      categoryName.toLowerCase().includes(q)
    );
  });

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <StatusBadge status={item.status || 'active'} size="sm" />
        </View>
        <Text style={styles.productCategory}>
          {categoryMap.get(item.category_id || 0) || 'No category'}
        </Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
          {item.stock !== undefined && (
            <Text style={styles.productStock}>Stock: {item.stock}</Text>
          )}
        </View>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => addToast('Edit product - coming soon', 'info')}
        >
          <Icon name="pencil" size={18} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setDeleteTarget(item.id)}
        >
          <Icon name="delete" size={18} color={colors.error} />
        </TouchableOpacity>
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
        <Icon name="magnify" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="shopping-off" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />

      <ConfirmDialog
        visible={deleteTarget !== null}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
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
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    flexDirection: 'row',
    ...shadows.sm,
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  productName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  productCategory: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  productStock: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  productActions: {
    justifyContent: 'center',
    gap: spacing.sm,
    marginLeft: spacing.md,
  },
  actionButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.borderLight,
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
