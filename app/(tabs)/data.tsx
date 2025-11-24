import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getAllEmotionRecords, EmotionRecord, clearAllRecords } from '@/utils/database';
import { exportAndShareData } from '@/utils/dataExport';
import { useTheme } from '@/contexts/ThemeContext';

export default function DataScreen() {
  const { colors } = useTheme();
  const [records, setRecords] = useState<EmotionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadRecords();
    }, [])
  );

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      console.log('Loading records...');
      const data = await getAllEmotionRecords();
      console.log('Records loaded:', data.length, 'records');
      setRecords(data);
    } catch (error) {
      console.error('Error loading records:', error);
      Alert.alert('Error', 'Failed to load records: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const success = await exportAndShareData();
      if (success) {
        Alert.alert('Success', 'Data exported successfully!');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Records',
      'Are you sure you want to delete all your emotion records? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllRecords();
              setRecords([]);
              Alert.alert('Success', 'All records have been cleared');
            } catch (error) {
              console.error('Error clearing records:', error);
              Alert.alert('Error', 'Failed to clear records');
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getEmotionLabel = (score: number): string => {
    if (score === 0) return 'Awfully Bad';
    if (score <= 2) return 'Very Bad';
    if (score <= 4) return 'Bad';
    if (score <= 5) return 'Neutral';
    if (score <= 7) return 'Good';
    if (score <= 9) return 'Very Good';
    return 'Perfectly Good';
  };

  const getEmotionColor = (score: number): string => {
    if (score <= 5) {
      const ratio = score / 5;
      const red = 220;
      const green = Math.round(180 * ratio);
      return `rgb(${red}, ${green}, 0)`;
    } else {
      const ratio = (score - 5) / 5;
      const red = Math.round(180 * (1 - ratio));
      const green = 180 + Math.round(20 * ratio);
      return `rgb(${red}, ${green}, 0)`;
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Record History</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
          {records.length} {records.length === 1 ? 'entry' : 'entries'}
        </Text>
      </View>

      {records.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>No records yet</Text>
          <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
            Start tracking your emotions to see your history here
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={records}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={[styles.recordCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                {/* Timestamp at top */}
                <Text style={[styles.timestamp, { color: colors.textTertiary }]}>
                  {formatDate(item.timestamp)} · Taiwan
                </Text>
                
                {/* Emotion Score Section */}
                <View style={styles.emotionSection}>
                  <Text style={[styles.emotionScore, { color: getEmotionColor(item.emotionScore) }]}>
                    {item.emotionScore}
                  </Text>
                  <View style={styles.emotionLabelContainer}>
                    <Text style={[styles.emotionLabelTitle, { color: colors.textTertiary }]}>Emotion Score</Text>
                    <Text style={[styles.emotionLabelText, { color: getEmotionColor(item.emotionScore) }]}>
                      {getEmotionLabel(item.emotionScore)}
                    </Text>
                  </View>
                </View>
                
                {/* Divider */}
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                
                {/* Record Info */}
                <View style={styles.recordInfo}>
                  {item.address && (
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Location</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={2}>
                        {item.address}
                      </Text>
                    </View>
                  )}
                  
                  {item.latitude && item.longitude && (
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Coordinates</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>
                        {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                      </Text>
                    </View>
                  )}
                  
                  {item.videoPath && (
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Video</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>
                        ✓ Recorded
                      </Text>
                    </View>
                  )}
                  
                  {item.temperature !== null && item.weatherCondition && (
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Weather</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>
                        {item.weatherIcon} {item.temperature}°C · {item.weatherCondition}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.exportButton, { backgroundColor: colors.primary }]}
              onPress={handleExport}
              activeOpacity={0.85}
            >
              <Text style={[styles.exportButtonText, { color: colors.background }]}>Export Data</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.clearButton, { backgroundColor: colors.cardBackground, borderColor: colors.danger }]} 
              onPress={handleClearAll}
              activeOpacity={0.85}
            >
              <Text style={[styles.clearButtonText, { color: colors.danger }]}>Clear All Records</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 48,
    fontWeight: '200',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: 3,
    fontFamily: 'System',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#b3b3b3',
    fontWeight: '300',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '300',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 0.3,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  recordCard: {
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  timestamp: {
    fontSize: 11,
    color: '#999999',
    fontWeight: '300',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  emotionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  emotionScore: {
    fontSize: 36,
    fontWeight: '200',
    letterSpacing: 2,
    marginRight: 16,
  },
  emotionLabelContainer: {
    flex: 1,
  },
  emotionLabelTitle: {
    fontSize: 10,
    color: '#999999',
    fontWeight: '300',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  emotionLabelText: {
    fontSize: 15,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
  },
  recordInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 13,
    color: '#666666',
    marginRight: 8,
    fontWeight: '300',
    minWidth: 90,
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '400',
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  exportButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  clearButton: {
    backgroundColor: '#fafafa',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  clearButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
