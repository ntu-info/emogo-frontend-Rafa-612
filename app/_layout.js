import { Stack } from "expo-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useEffect } from "react";
import { initDatabase } from "@/utils/database";
import * as Notifications from 'expo-notifications';

export default function RootLayout() {
  useEffect(() => {
    initDatabase().catch(console.error);

    // 監聽通知接收
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notification received!', notification);
    });

    // 監聽通知點擊
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification tapped!', response);
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}
