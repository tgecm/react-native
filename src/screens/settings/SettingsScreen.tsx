import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BotSwitcher } from '../../components/shared/BotSwitcher';
import { useSelectedBot } from '../../hooks/useSelectedBot';
import { useAuthStore } from '../../store';
import { colors, fontSize, spacing, borderRadius, shadows, commonStyles } from '../../utils/theme';

export const SettingsScreen: React.FC = () => {
  const { selectedBot } = useSelectedBot();
  const user = useAuthStore((s) => s.user);
  const [showBotSwitcher, setShowBotSwitcher] = useState(false);

  return (
    <ScrollView style={commonStyles.screenContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bot</Text>
        <TouchableOpacity style={styles.settingItem} onPress={() => setShowBotSwitcher(true)}>
          <Icon name="robot" size={22} color={colors.primary} />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Selected Bot</Text>
            <Text style={styles.settingValue}>
              {selectedBot ? selectedBot.name : 'None selected'}
            </Text>
          </View>
          <Icon name="chevron-right" size={22} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingItem}>
          <Icon name="account" size={22} color={colors.textSecondary} />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Name</Text>
            <Text style={styles.settingValue}>{user?.name || 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.settingItem}>
          <Icon name="email" size={22} color={colors.textSecondary} />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Email</Text>
            <Text style={styles.settingValue}>{user?.email || 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.settingItem}>
          <Icon name="crown" size={22} color={colors.warning} />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Plan</Text>
            <Text style={styles.settingValue}>
              {user?.plan || 'Free'} {user?.plan_status ? `(${user.plan_status})` : ''}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        <View style={styles.settingItem}>
          <Icon name="information" size={22} color={colors.textSecondary} />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
        </View>
      </View>

      <BotSwitcher visible={showBotSwitcher} onClose={() => setShowBotSwitcher(false)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xs,
    ...shadows.sm,
  },
  settingContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  settingLabel: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
