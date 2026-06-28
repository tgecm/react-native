import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getBroadcasts, getGiveaways, createBroadcast } from '../../services/api/broadcasts';
import { useSelectedBot } from '../../hooks/useSelectedBot';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { colors, fontSize, spacing, borderRadius, shadows, commonStyles } from '../../utils/theme';
import { formatDateTime } from '../../utils/date';
import { useToastStore } from '../../store';

type Tab = 'broadcasts' | 'giveaways';

export const BroadcastScreen: React.FC = () => {
  const { selectedBotId } = useSelectedBot();
  const [activeTab, setActiveTab] = useState<Tab>('broadcasts');
  const [showCreate, setShowCreate] = useState(false);
  const [message, setMessage] = useState('');
  const addToast = useToastStore((s) => s.addToast);

  const { data: broadcasts, refetch: refetchBroadcasts } = useQuery({
    queryKey: ['broadcasts', selectedBotId],
    queryFn: () => getBroadcasts({ bot_id: selectedBotId }),
    enabled: !!selectedBotId,
  });

  const { data: giveaways } = useQuery({
    queryKey: ['giveaways', selectedBotId],
    queryFn: () => getGiveaways({ bot_id: selectedBotId }),
    enabled: !!selectedBotId,
  });

  const handleCreateBroadcast = async () => {
    if (!message.trim()) return;
    try {
      await createBroadcast({ bot_id: selectedBotId, message: message.trim() });
      setMessage('');
      setShowCreate(false);
      addToast('Broadcast sent', 'success');
      refetchBroadcasts();
    } catch {
      addToast('Failed to send broadcast', 'error');
    }
  };

  const renderBroadcast = ({ item }: any) => (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <StatusBadge status={item.status} />
        <Text style={styles.dateText}>{formatDateTime(item.created_at)}</Text>
      </View>
      <Text style={styles.messagePreview} numberOfLines={3}>{item.message}</Text>
      <Text style={styles.statsText}>
        Sent: {item.sent_count || 0} / Total: {item.total_count || 0}
      </Text>
    </View>
  );

  const renderGiveaway = ({ item }: any) => (
    <View style={styles.item}>
      <Text style={styles.giveawayTitle}>{item.title}</Text>
      <Text style={styles.giveawayPrize}>Prize: {item.prize}</Text>
      <View style={styles.itemFooter}>
        <StatusBadge status={item.status} />
        <Text style={styles.statsText}>Winners: {item.winner_count || 0}</Text>
      </View>
    </View>
  );

  return (
    <View style={commonStyles.screenContainer}>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'broadcasts' && styles.activeTab]}
          onPress={() => setActiveTab('broadcasts')}
        >
          <Text style={[styles.tabText, activeTab === 'broadcasts' && styles.activeTabText]}>
            Broadcasts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'giveaways' && styles.activeTab]}
          onPress={() => setActiveTab('giveaways')}
        >
          <Text style={[styles.tabText, activeTab === 'giveaways' && styles.activeTabText]}>
            Giveaways
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'broadcasts' && (
        <>
          {showCreate ? (
            <View style={styles.createContainer}>
              <TextInput
                style={styles.createInput}
                placeholder="Type your broadcast message..."
                placeholderTextColor={colors.textTertiary}
                value={message}
                onChangeText={setMessage}
                multiline
              />
              <View style={styles.createButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => { setShowCreate(false); setMessage(''); }}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendBtn} onPress={handleCreateBroadcast}>
                  <Text style={styles.sendBtnText}>Send Broadcast</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.createButton} onPress={() => setShowCreate(true)}>
              <Icon name="plus" size={20} color={colors.textInverse} />
              <Text style={styles.createButtonText}>New Broadcast</Text>
            </TouchableOpacity>
          )}
          <FlatList
            data={broadcasts}
            keyExtractor={(item: any) => item.id.toString()}
            renderItem={renderBroadcast}
            contentContainerStyle={styles.list}
          />
        </>
      )}

      {activeTab === 'giveaways' && (
        <FlatList
          data={giveaways}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={renderGiveaway}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    margin: spacing.lg,
    borderRadius: borderRadius.md,
    padding: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md - 2,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.textInverse,
    fontWeight: '600',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  createButtonText: {
    color: colors.textInverse,
    fontSize: fontSize.md,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  createContainer: {
    margin: spacing.lg,
  },
  createInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  createButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  cancelBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.border,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sendBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
  },
  sendBtnText: {
    color: colors.textInverse,
    fontWeight: '600',
  },
  list: {
    paddingBottom: spacing.xxl,
  },
  item: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    ...shadows.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  messagePreview: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  dateText: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
  },
  statsText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  giveawayTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  giveawayPrize: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
});
