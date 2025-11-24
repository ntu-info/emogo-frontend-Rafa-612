import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { getRecordCount } from '@/utils/database';
import { scheduleDailyNotifications } from '@/utils/notifications';
import { useTheme } from '@/contexts/ThemeContext';
import { TimePicker } from '@/components/TimePicker';

export default function SettingsScreen() {
  const { theme, toggleTheme, colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [recordCount, setRecordCount] = useState(0);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [editingTimeIndex, setEditingTimeIndex] = useState<number | null>(null);
  const [reminderTimes, setReminderTimes] = useState([
    { hour: 9, minute: 0 },
    { hour: 12, minute: 0 },
    { hour: 18, minute: 0 },
  ]);
  
  const isDarkMode = theme === 'dark';

  useFocusEffect(
    React.useCallback(() => {
      checkPermissions();
      loadStats();
    }, [])
  );

  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotificationsEnabled(status === 'granted');
  };

  const loadStats = async () => {
    const count = await getRecordCount();
    setRecordCount(count);
  };

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        // 使用自定義時間排程通知
        await scheduleCustomNotifications(reminderTimes);
        setNotificationsEnabled(true);
        const timeStrings = reminderTimes.map(t => formatTime(t.hour, t.minute)).join(', ');
        console.log(`Daily notifications enabled at ${timeStrings}`);
      } else {
        Alert.alert('Permission Denied', 'Please enable notifications in your device settings');
      }
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setNotificationsEnabled(false);
      console.log('Daily notifications disabled');
    }
  };

  const scheduleCustomNotifications = async (times: { hour: number; minute: number }[]) => {
    try {
      // 取消所有現有通知
      await Notifications.cancelAllScheduledNotificationsAsync();

      const now = new Date();
      console.log(`🕐 Current time: ${now.toLocaleString()}`);
      
      let scheduledCount = 0;
      
      // 為每個時間排程通知（未來7天）
      for (const time of times) {
        for (let day = 0; day < 7; day++) {
          const scheduledDate = new Date();
          scheduledDate.setDate(now.getDate() + day);
          scheduledDate.setHours(time.hour, time.minute, 0, 0);
          
          const timeDiff = scheduledDate.getTime() - now.getTime();
          const minutesUntil = Math.round(timeDiff / 1000 / 60);
          
          // 只排程未來的時間
          if (scheduledDate > now) {
            const id = await Notifications.scheduleNotificationAsync({
              content: {
                title: '🎭 Time to record your emotions',
                body: 'Take a moment to check in with yourself',
                sound: true,
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: scheduledDate,
              },
            });
            
            scheduledCount++;
            
            if (day === 0 || minutesUntil <= 5) {
              console.log(`✅ Scheduled (ID: ${id}): ${formatTime(time.hour, time.minute)} on ${scheduledDate.toLocaleString()} (in ${minutesUntil} minutes)`);
            }
          } else {
            if (day === 0) {
              console.log(`⏭️ Skipped (past time): ${formatTime(time.hour, time.minute)} on ${scheduledDate.toLocaleString()}`);
            }
          }
        }
      }
      
      console.log(`📊 Successfully scheduled ${scheduledCount} notifications`);

      // 驗證通知已排程
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      console.log(`📅 Total scheduled notifications: ${scheduled.length}`);
      
      if (scheduled.length > 0) {
        console.log('📋 Next 3 scheduled notifications:');
        scheduled.slice(0, 3).forEach((notif: any, idx: number) => {
          // DateTrigger 的格式：trigger.value 是 timestamp
          const triggerDate = notif.trigger?.value ? new Date(notif.trigger.value * 1000) : null;
          if (triggerDate && !isNaN(triggerDate.getTime())) {
            console.log(`  ${idx + 1}. ${triggerDate.toLocaleString()}`);
          } else {
            console.log(`  ${idx + 1}. ${JSON.stringify(notif.trigger)}`);
          }
        });
      }
    } catch (error) {
      console.error('Error scheduling custom notifications:', error);
      Alert.alert('Error', `Failed to schedule notifications: ${error}`);
    }
  };

  const handleTestNotification = async () => {
    try {
      // 臨時啟用前台通知
      const originalHandler = Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      // 立即通知測試
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎭 Immediate Test',
          body: 'This should appear now!',
        },
        trigger: null,
      });

      // 5秒後的通知測試
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏰ 5-Second Test',
          body: 'This appeared 5 seconds after you pressed the button!',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5,
        },
      });

      Alert.alert(
        'Tests Scheduled', 
        '1. Immediate notification sent\n2. Another in 5 seconds'
      );

      // 10秒後恢復靜默模式
      setTimeout(() => {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: false,
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowBanner: false,
            shouldShowList: false,
          }),
        });
      }, 10000);
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', `Failed: ${error}`);
    }
  };

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const handleTimeChange = (index: number, hour: number, minute: number) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = { hour, minute };
    setReminderTimes(newTimes);
  };

  const handleSaveTimes = async () => {
    setShowTimeModal(false);
    setEditingTimeIndex(null);
    
    // 如果通知已開啟，重新排程
    if (notificationsEnabled) {
      await scheduleCustomNotifications(reminderTimes);
      const timeStrings = reminderTimes.map(t => formatTime(t.hour, t.minute)).join(', ');
      console.log(`Notifications rescheduled at ${timeStrings}`);
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 32,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 48,
      fontWeight: '200',
      color: colors.text,
      marginBottom: 8,
      letterSpacing: 3,
      fontFamily: 'System',
    },
    headerSubtitle: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: '300',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      padding: 32,
      width: '85%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: '300',
      color: colors.text,
      marginBottom: 24,
      textAlign: 'center',
      letterSpacing: 1,
    },
    timeInputContainer: {
      marginBottom: 20,
    },
    timeLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 8,
      fontWeight: '300',
      letterSpacing: 0.5,
    },
    timeDisplay: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginBottom: 12,
    },
    timeDisplayText: {
      fontSize: 24,
      fontWeight: '300',
      letterSpacing: 2,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    modalButtonPrimary: {
      backgroundColor: colors.primary,
    },
    modalButtonSecondary: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalButtonTextPrimary: {
      color: isDarkMode ? '#000' : '#fff',
      fontSize: 15,
      fontWeight: '500',
    },
    modalButtonTextSecondary: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '400',
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.headerTitle}>Settings</Text>
          <Text style={dynamicStyles.headerSubtitle}>Preferences & Data</Text>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Appearance</Text>
          <View style={dynamicStyles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textTertiary }]}>
                  {isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: '#e5e5e5', true: colors.primary }}
                thumbColor="#ffffff"
                ios_backgroundColor="#e5e5e5"
              />
            </View>
          </View>
        </View>

        {/* Statistics Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Statistics</Text>
          <View style={dynamicStyles.card}>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: colors.text }]}>Total Records</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{recordCount}</Text>
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Notifications</Text>
          <View style={dynamicStyles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Daily Reminders</Text>
                <Text style={[styles.settingDescription, { color: colors.textTertiary }]}>
                  {reminderTimes.map(t => formatTime(t.hour, t.minute)).join(', ')}
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: '#e5e5e5', true: colors.primary }}
                thumbColor="#ffffff"
                ios_backgroundColor="#e5e5e5"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            onPress={() => setShowTimeModal(true)}
            activeOpacity={0.85}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              Customize Reminder Times
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            onPress={handleTestNotification}
            activeOpacity={0.85}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              Send Test Notification
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.text }]}>EmoGo · Version 1.0.0</Text>
          <Text style={[styles.footerSubtext, { color: colors.textTertiary }]}>
            Emotion Tracking App
          </Text>
        </View>
      </ScrollView>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimeModal(false)}
      >
        <View style={dynamicStyles.modalContainer}>
          <View style={dynamicStyles.modalContent}>
            <Text style={dynamicStyles.modalTitle}>Set Reminder Times</Text>
            
            {['Morning', 'Afternoon', 'Evening'].map((label, index) => (
              <View key={index} style={dynamicStyles.timeInputContainer}>
                <Text style={dynamicStyles.timeLabel}>{label}</Text>
                <TouchableOpacity
                  style={dynamicStyles.timeDisplay}
                  onPress={() => setEditingTimeIndex(index)}
                >
                  <Text style={[dynamicStyles.timeDisplayText, { color: colors.text }]}>
                    {formatTime(reminderTimes[index].hour, reminderTimes[index].minute)}
                  </Text>
                </TouchableOpacity>
                
                {editingTimeIndex === index && (
                  <TimePicker
                    hour={reminderTimes[index].hour}
                    minute={reminderTimes[index].minute}
                    onTimeChange={(hour, minute) => handleTimeChange(index, hour, minute)}
                    colors={colors}
                  />
                )}
              </View>
            ))}

            <View style={dynamicStyles.modalButtons}>
              <TouchableOpacity
                style={[dynamicStyles.modalButton, dynamicStyles.modalButtonSecondary]}
                onPress={() => {
                  setShowTimeModal(false);
                  setEditingTimeIndex(null);
                }}
              >
                <Text style={dynamicStyles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[dynamicStyles.modalButton, dynamicStyles.modalButtonPrimary]}
                onPress={handleSaveTimes}
              >
                <Text style={dynamicStyles.modalButtonTextPrimary}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '300',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '200',
    letterSpacing: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  settingDescription: {
    fontSize: 13,
    fontWeight: '300',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '300',
    letterSpacing: 1,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
    fontWeight: '300',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
