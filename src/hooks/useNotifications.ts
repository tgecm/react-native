import { useEffect, useRef } from 'react';
import messaging from '@react-native-firebase/messaging';
import { registerDeviceToken } from '../services/api/notifications';

export const useNotifications = () => {
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    const setupFCM = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const fcmToken = await messaging().getToken();
          tokenRef.current = fcmToken;
          try {
            await registerDeviceToken(fcmToken);
          } catch {
            // Token registration may fail, not critical
          }
        }
      } catch {
        // Permission request may fail
      }
    };

    setupFCM();

    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message:', remoteMessage);
    });

    const unsubscribeOnTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
      tokenRef.current = newToken;
      try {
        await registerDeviceToken(newToken);
      } catch {
        // Silently handle
      }
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnTokenRefresh();
    };
  }, []);
};

export const getFCMToken = async (): Promise<string | null> => {
  try {
    return await messaging().getToken();
  } catch {
    return null;
  }
};
