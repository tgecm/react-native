import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fontSize, spacing, shadows, commonStyles } from '../../utils/theme';

const THEMES = [
  { name: 'Default', color: '#4F46E5' },
  { name: 'Midnight', color: '#1E293B' },
  { name: 'Emerald', color: '#059669' },
  { name: 'Rose', color: '#E11D48' },
  { name: 'Slate', color: '#475569' },
];

export const CustomizationScreen: React.FC = () => {
  return (
    <ScrollView style={commonStyles.screenContainer} contentContainerStyle={styles.content}>
      <Text style={styles.sectionLabel}>Preset Themes</Text>
      <View style={styles.themeGrid}>
        {THEMES.map((theme, index) => (
          <TouchableOpacity key={index} style={styles.themeItem}>
            <View style={[styles.themeCircle, { backgroundColor: theme.color }]}>
              <Icon name="palette" size={20} color={colors.textInverse} />
            </View>
            <Text style={styles.themeName}>{theme.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.comingSoon}>
        <Icon name="tools" size={40} color={colors.textTertiary} />
        <Text style={styles.comingSoonTitle}>Advanced Customization</Text>
        <Text style={styles.comingSoonText}>
          Full theme customization including colors, fonts, and layout options will be available soon.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
  },
  sectionLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  themeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xxl,
  },
  themeItem: {
    alignItems: 'center',
  },
  themeCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...shadows.md,
  },
  themeName: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  comingSoon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  comingSoonTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  comingSoonText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xxl,
  },
});
