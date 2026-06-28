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
import { getCustomCommands, createCustomCommand, deleteCustomCommand } from '../../services/api/commands';
import { useSelectedBot } from '../../hooks/useSelectedBot';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { ListSkeleton } from '../../components/shared/LoadingSkeleton';
import { colors, fontSize, spacing, borderRadius, shadows, commonStyles } from '../../utils/theme';
import { useToastStore } from '../../store';

export const CommandsScreen: React.FC = () => {
  const { selectedBotId } = useSelectedBot();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [response, setResponse] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const addToast = useToastStore((s) => s.addToast);

  const { data: commands, isLoading, refetch } = useQuery({
    queryKey: ['commands', selectedBotId],
    queryFn: () => getCustomCommands({ bot_id: selectedBotId }),
    enabled: !!selectedBotId,
  });

  const handleCreate = async () => {
    if (!name.trim() || !response.trim()) return;
    try {
      await createCustomCommand({ bot_id: selectedBotId, name: name.trim(), response: response.trim() });
      setName('');
      setResponse('');
      setShowCreate(false);
      addToast('Command created', 'success');
      refetch();
    } catch {
      addToast('Failed to create command', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCustomCommand(deleteTarget);
      addToast('Command deleted', 'success');
      refetch();
    } catch {
      addToast('Failed to delete command', 'error');
    }
    setDeleteTarget(null);
  };

  const renderCommand = ({ item }: any) => (
    <View style={styles.commandCard}>
      <View style={styles.commandHeader}>
        <Text style={styles.commandName}>/{item.name}</Text>
        <TouchableOpacity onPress={() => setDeleteTarget(item.id)}>
          <Icon name="delete-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
      <Text style={styles.commandResponse} numberOfLines={2}>{item.response}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={commonStyles.screenContainer}>
        <ListSkeleton count={5} />
      </View>
    );
  }

  return (
    <View style={commonStyles.screenContainer}>
      {showCreate ? (
        <View style={styles.createContainer}>
          <TextInput
            style={styles.input}
            placeholder="/command-name"
            placeholderTextColor={colors.textTertiary}
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, styles.responseInput]}
            placeholder="Command response..."
            placeholderTextColor={colors.textTertiary}
            value={response}
            onChangeText={setResponse}
            multiline
          />
          <View style={styles.createButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCreate(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
              <Text style={styles.createBtnText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={() => setShowCreate(true)}>
          <Icon name="plus" size={20} color={colors.textInverse} />
          <Text style={styles.addButtonText}>Add Command</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={commands}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderCommand}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="code-tags" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyText}>No custom commands</Text>
          </View>
        }
      />

      <ConfirmDialog
        visible={deleteTarget !== null}
        title="Delete Command"
        message="Are you sure?"
        confirmText="Delete"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    margin: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    color: colors.textInverse,
    fontSize: fontSize.md,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  createContainer: {
    margin: spacing.lg,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  responseInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  createButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  cancelBtn: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.border,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  createBtn: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
  },
  createBtnText: {
    color: colors.textInverse,
    fontWeight: '600',
  },
  list: {
    paddingBottom: spacing.xxl,
  },
  commandCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    ...shadows.sm,
  },
  commandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commandName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  commandResponse: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginTop: spacing.xs,
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
