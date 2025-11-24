import * as Notifications from 'expo-notifications';

// 配置通知處理器 - 允許前台顯示通知（用於測試）
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
};

export const scheduleDailyNotifications = async () => {
  try {
    // 取消所有現有通知
    await Notifications.cancelAllScheduledNotificationsAsync();

    // 排程每日通知
    const times = [
      { hour: 9, minute: 0 },
      { hour: 12, minute: 0 },
      { hour: 18, minute: 0 },
    ];

    for (const time of times) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎭 Time to record your emotions',
          body: 'Take a moment to check in with yourself',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: time.hour,
          minute: time.minute,
        },
      });
    }

    console.log('Daily notifications scheduled successfully');
  } catch (error) {
    console.error('Error scheduling notifications:', error);
    throw error;
  }
};

export const cancelAllScheduledNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All scheduled notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
    throw error;
  }
};
