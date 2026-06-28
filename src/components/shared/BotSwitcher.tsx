import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { useBotStore } from '../../store';
import { Bot } from '../../types';
import { colors, fontSize, spacing, borderRadius, shadows } from '../../utils/theme';

interface BotSwitcherProps {
  visible: boolean;
  onClose: () => void;
}

export const BotSwitcher: React.FC<BotSwitcherProps> = ({ visible, onClose }) => {
  const { bots, selectedBotId, setSelectedBot } = useBotStore();

  const handleSelect = (bot: Bot) => {
    setSelectedBot(bot.id);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Select Bot</Text>
          <FlatList
            data={bots}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.item,
                  item.id === selectedBotId && styles.selectedItem,
                ]}
                onPress={() => handleSelect(item)}
              >
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, item.id === selectedBotId && styles.selectedText]}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemUsername}>@{item.username}</Text>
                </View>
                {item.id === selectedBotId && <View style={styles.checkmark} />}
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xxl,
    maxHeight: '60%',
    ...shadows.lg,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  selectedItem: {
    backgroundColor: colors.primaryLight + '20',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  selectedText: {
    color: colors.primary,
  },
  itemUsername: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  checkmark: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  closeButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: borderRadius.md,
  },
  closeText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
