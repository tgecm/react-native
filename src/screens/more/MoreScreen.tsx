import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore, useToastStore } from '../../store';
import { colors, fontSize, spacing, borderRadius, shadows } from '../../utils/theme';

interface MenuItem {
  icon: string;
  label: string;
  screen: string;
  color: string;
}

const MENU_ITEMS: MenuItem[] = [
  { icon: 'forum', label: 'Chats', screen: 'Chats', color: '#3B82F6' },
  { icon: 'bullhorn', label: 'Broadcast', screen: 'Broadcast', color: '#8B5CF6' },
  { icon: 'wallet', label: 'Payments', screen: 'Payments', color: '#10B981' },
  { icon: 'tune', label: 'Settings', screen: 'Settings', color: '#6B7280' },
  { icon: 'crown', label: 'Subscription', screen: 'Subscription', color: '#F59E0B' },
  { icon: 'palette', label: 'Customization', screen: 'Customization', color: '#EC4899' },
  { icon: 'code-tags', label: 'Commands', screen: 'Commands', color: '#14B8A6' },
];

export const MoreScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.addToast);

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'success');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Icon name="account" size={32} color={colors.primary} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || user?.email || 'Admin'}</Text>
          <Text style={styles.profileEmail}>{user?.email || ''}</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
              <Icon name={item.icon} size={22} color={item.color} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Icon name="chevron-right" size={22} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      {user?.is_superadmin && (
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Superadmin')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#EF444420' }]}>
              <Icon name="shield-account" size={22} color="#EF4444" />
            </View>
            <Text style={styles.menuLabel}>Superadmin</Text>
            <Icon name="chevron-right" size={22} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color={colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  profileEmail: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuSection: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xxl,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  logoutText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.md,
    color: colors.error,
    fontWeight: '600',
  },
});
