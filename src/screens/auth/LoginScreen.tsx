import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { login, verifyLoginCode, staffVerifyLoginCode, getMe, staffLogin } from '../../services/api/auth';
import { getBots } from '../../services/api/bots';
import { useAuthStore, useBotStore } from '../../store';
import { colors, fontSize, spacing, borderRadius, shadows } from '../../utils/theme';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginToken, setLoginToken] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'credentials' | 'verify' | 'loading'>('credentials');
  const [isStaff, setIsStaff] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const authStore = useAuthStore();
  const botStore = useBotStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setStep('loading');
    try {
      const data = isStaff
        ? await staffLogin(email, password)
        : await login(email, password);

      if (data.login_token) {
        setLoginToken(data.login_token);
        setStep('verify');
        return;
      }

      await completeLogin(data);
    } catch (error: any) {
      setStep('credentials');
      const message = error?.response?.data?.detail || error?.message || 'Login failed';
      Alert.alert('Login Failed', message);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setStep('loading');
    try {
      const data = isStaff
        ? await staffVerifyLoginCode(loginToken, code)
        : await verifyLoginCode(loginToken, code);
      await completeLogin(data);
    } catch (error: any) {
      setStep('verify');
      const message = error?.response?.data?.detail || 'Verification failed';
      Alert.alert('Verification Failed', message);
    }
  };

  const completeLogin = async (data: any) => {
    const token = data.token || data.access_token;
    if (!token) {
      setStep('credentials');
      Alert.alert('Error', 'No token received');
      return;
    }

    try {
      if (isStaff) {
        // Staff: user data comes from response, no /me endpoint
        const user = data.staff || { email: '', name: '' };
        authStore.login(token, user, true);
        if (data.staff?.bot_id) {
          botStore.setSelectedBot(data.staff.bot_id);
        }
      } else {
        // Regular user: set token first, then fetch full profile
        authStore.login(token, {} as any, false);
        const user = await getMe();
        authStore.login(token, user, false);
      }

      // Load bots
      try {
        const bots = await getBots();
        botStore.setBots(bots);
        if (bots.length > 0 && !botStore.selectedBotId) {
          botStore.setSelectedBot(bots[0].id);
        }
      } catch {
        // Bots loading is non-critical
      }
    } catch {
      setStep('credentials');
      Alert.alert('Error', 'Failed to load user data');
    }
  };

  if (step === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Signing in...</Text>
      </View>
    );
  }

  if (step === 'verify') {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Icon name="shield-check" size={48} color={colors.primary} />
            <Text style={styles.title}>Verify Login</Text>
            <Text style={styles.subtitle}>
              A verification code was sent to your Telegram. Enter it below.
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Enter verification code"
              placeholderTextColor={colors.textTertiary}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              autoFocus
            />

            <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => {
                setStep('credentials');
                setCode('');
              }}
            >
              <Text style={styles.linkText}>Back to login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Icon name="store" size={56} color={colors.primary} />
          <Text style={styles.appName}>TeleShop Admin</Text>
          <Text style={styles.subtitle}>Sign in to manage your shop</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleButton, !isStaff && styles.activeToggle]}
              onPress={() => setIsStaff(false)}
            >
              <Text style={[styles.toggleText, !isStaff && styles.activeToggleText]}>
                Admin
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, isStaff && styles.activeToggle]}
              onPress={() => setIsStaff(true)}
            >
              <Text style={[styles.toggleText, isStaff && styles.activeToggleText]}>
                Staff
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder={isStaff ? 'Username' : 'Email'}
            placeholderTextColor={colors.textTertiary}
            value={email}
            onChangeText={setEmail}
            keyboardType={isStaff ? 'default' : 'email-address'}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor={colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.lg,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  appName: {
    fontSize: fontSize.display,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    ...shadows.md,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.border,
    borderRadius: borderRadius.md,
    padding: 2,
    marginBottom: spacing.lg,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md - 2,
  },
  activeToggle: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  toggleText: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeToggleText: {
    color: colors.primary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  passwordInput: {
    flex: 1,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  eyeButton: {
    padding: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  linkText: {
    fontSize: fontSize.md,
    color: colors.textLink,
    fontWeight: '500',
  },
});
