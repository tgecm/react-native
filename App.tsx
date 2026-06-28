/**
 * TeleShop Admin - React Native Android App
 * Admin panel for Telegram e-commerce bots
 */
import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ToastMessage from 'react-native-toast-message';
import { AppNavigator } from './src/navigation';
import { ErrorBoundary } from './src/components/shared/ErrorBoundary';
import { NetworkStatusBar } from './src/components/shared/NetworkStatusBar';
import { ToastContainer } from './src/components/shared/ToastContainer';
import { initStorage } from './src/store/storage';
import { colors } from './src/utils/theme';
import { StyleSheet } from 'react-native';

// Suppress known harmless warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  },
});

function App() {
  useEffect(() => {
    initStorage();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <StatusBar
              barStyle="light-content"
              backgroundColor={colors.primary}
            />
            <NetworkStatusBar />
            <AppNavigator />
            <ToastContainer />
            <ToastMessage />
          </ErrorBoundary>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
