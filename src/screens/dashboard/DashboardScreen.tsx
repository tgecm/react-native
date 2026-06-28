import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getStats, getOrdersByDay } from '../../services/api/stats';
import { useSelectedBot } from '../../hooks/useSelectedBot';
import { StatCard } from '../../components/shared/StatCard';
import { CardSkeleton } from '../../components/shared/LoadingSkeleton';
import { colors, fontSize, spacing, borderRadius, shadows, commonStyles } from '../../utils/theme';
import { formatCurrency, formatNumber } from '../../utils/format';

const screenWidth = Dimensions.get('window').width;

export const DashboardScreen: React.FC = () => {
  const { selectedBotId } = useSelectedBot();
  const [refreshing, setRefreshing] = useState(false);

  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['dashboard-stats', selectedBotId],
    queryFn: () => getStats({ bot_id: selectedBotId }),
    enabled: !!selectedBotId,
    refetchInterval: 30000,
  });

  const { data: ordersByDay } = useQuery({
    queryKey: ['orders-by-day', selectedBotId],
    queryFn: () => getOrdersByDay({ bot_id: selectedBotId, days: 7 }),
    enabled: !!selectedBotId,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading) {
    return (
      <View style={commonStyles.screenContainer}>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </View>
    );
  }

  return (
    <ScrollView
      style={commonStyles.screenContainer}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statRow}>
          <View style={styles.statHalf}>
            <StatCard
              title="Total Orders"
              value={formatNumber(stats?.total_orders || 0)}
              icon={<Icon name="package-variant-closed" size={20} color={colors.primary} />}
              color={colors.primary}
            />
          </View>
          <View style={styles.statHalf}>
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats?.total_revenue || 0)}
              icon={<Icon name="currency-usd" size={20} color={colors.success} />}
              color={colors.success}
            />
          </View>
        </View>
        <View style={styles.statRow}>
          <View style={styles.statHalf}>
            <StatCard
              title="Products"
              value={formatNumber(stats?.total_products || 0)}
              icon={<Icon name="shopping" size={20} color={colors.info} />}
              color={colors.info}
            />
          </View>
          <View style={styles.statHalf}>
            <StatCard
              title="Customers"
              value={formatNumber(stats?.total_customers || 0)}
              icon={<Icon name="account-group" size={20} color={colors.warning} />}
              color={colors.warning}
            />
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Today</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statRow}>
          <View style={styles.statHalf}>
            <StatCard
              title="Today Orders"
              value={formatNumber(stats?.today_orders || 0)}
              color={colors.primary}
            />
          </View>
          <View style={styles.statHalf}>
            <StatCard
              title="Today Revenue"
              value={formatCurrency(stats?.today_revenue || 0)}
              color={colors.success}
            />
          </View>
        </View>
        <View style={styles.statRow}>
          <View style={styles.statHalf}>
            <StatCard
              title="Pending Orders"
              value={formatNumber(stats?.pending_orders || 0)}
              color={colors.warning}
            />
          </View>
        </View>
      </View>

      {ordersByDay && ordersByDay.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Last 7 Days Orders</Text>
          <View style={styles.chartCard}>
            <OrdersBarChart data={ordersByDay} />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const OrdersBarChart: React.FC<{ data: any[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map((d: any) => d.count || 0), 1);
  const barWidth = Math.max((screenWidth - 80) / data.length - 8, 20);

  return (
    <View style={styles.chartContainer}>
      <View style={styles.barsContainer}>
        {data.map((item: any, index: number) => {
          const height = ((item.count || 0) / maxValue) * 120;
          const date = item.date ? item.date.substring(5, 10) : '';
          return (
            <View key={index} style={styles.barColumn}>
              <Text style={styles.barValue}>{item.count || 0}</Text>
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.max(height, 4),
                    width: barWidth,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
              <Text style={styles.barLabel}>{date}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  statsGrid: {
    paddingHorizontal: spacing.sm,
  },
  statRow: {
    flexDirection: 'row',
  },
  statHalf: {
    flex: 1,
    paddingHorizontal: spacing.xs,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  chartContainer: {
    marginTop: spacing.sm,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 160,
  },
  barColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    borderRadius: borderRadius.sm,
    minWidth: 16,
  },
  barValue: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  barLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: 4,
  },
});
