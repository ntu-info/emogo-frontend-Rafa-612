import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { initDatabase } from '@/utils/database';
import {
  requestNotificationPermissions,
  scheduleDailyNotifications,
} from '@/utils/notifications';
import { requestLocationPermissions } from '@/utils/location';

export function useAppInitialization() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    initializeApp();

    // 監聽通知
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
      }
    );

    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification response:', response);
        // TODO: 導航到記錄頁面
      }
    );

    // 監聽 App 狀態
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground');
      }
      appState.current = nextAppState;
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
      subscription.remove();
    };
  }, []);

  const initializeApp = async () => {
    try {
      console.log('Initializing app...');

      // 初始化資料庫
      await initDatabase();
      console.log('✅ Database initialized');

      // 請求通知權限
      const notificationGranted = await requestNotificationPermissions();
      if (notificationGranted) {
        await scheduleDailyNotifications();
        console.log('✅ Notifications scheduled');
      }

      // 請求位置權限
      const locationGranted = await requestLocationPermissions();
      if (locationGranted) {
        console.log('✅ Location permissions granted');
      }

      console.log('🎉 App initialization complete');
    } catch (error) {
      console.error('❌ Error initializing app:', error);
    }
  };
}
