import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmotionSlider from '@/components/EmotionSlider';
import VideoRecorder from '@/components/VideoRecorder';
import { insertEmotionRecord, getRecordCount } from '@/utils/database';
import { getCurrentLocation } from '@/utils/location';
import { getWeatherSimple } from '@/utils/weather';
import { useTheme } from '@/contexts/ThemeContext';

export default function RecordScreen() {
  const { colors } = useTheme();
  const [emotionScore, setEmotionScore] = useState(5);
  const [showCamera, setShowCamera] = useState(false);
  const [videoPath, setVideoPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recordCount, setRecordCount] = useState(0);

  useEffect(() => {
    loadRecordCount();
  }, []);

  const loadRecordCount = async () => {
    try {
      const count = await getRecordCount();
      setRecordCount(count);
    } catch (error) {
      console.error('Error loading record count:', error);
    }
  };

  const handleVideoRecorded = (uri: string) => {
    setVideoPath(uri);
    setShowCamera(false);
    Alert.alert('Success', 'Video recorded successfully! 🎥');
  };

  const handleSubmit = async () => {
    if (!videoPath) {
      Alert.alert('Missing Video', 'Please record a video selfie first!');
      return;
    }

    setIsLoading(true);

    try {
      // 獲取位置
      const location = await getCurrentLocation();
      
      // 獲取天氣（如果有位置的話）
      let weather = null;
      if (location?.latitude && location?.longitude) {
        weather = await getWeatherSimple(location.latitude, location.longitude);
      }
      
      const record = {
        timestamp: new Date().toISOString(),
        emotionScore,
        latitude: location?.latitude || null,
        longitude: location?.longitude || null,
        videoPath,
        address: location?.address || null,
        temperature: weather?.temperature || null,
        weatherCondition: weather?.condition || null,
        weatherIcon: weather?.icon || null,
      };

      await insertEmotionRecord(record);

      Alert.alert(
        'Success! 🎉',
        'Your emotion record has been saved successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              setEmotionScore(5);
              setVideoPath(null);
              loadRecordCount();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting record:', error);
      Alert.alert('Error', 'Failed to save record. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showCamera) {
    return (
      <VideoRecorder
        onVideoRecorded={handleVideoRecorded}
        onCancel={() => setShowCamera(false)}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>EmoGo</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
            {recordCount} {recordCount === 1 ? 'entry' : 'entries'}
          </Text>
        </View>

        <View style={styles.sliderSection}>
          <EmotionSlider value={emotionScore} onValueChange={setEmotionScore} />
        </View>

        <View style={styles.videoSection}>
          {videoPath ? (
            <View style={[styles.videoCompleted, { backgroundColor: colors.cardBackground, borderColor: colors.primary }]}>
              <View style={[styles.checkmarkCircle, { backgroundColor: colors.primary }]}>
                <Text style={[styles.checkmark, { color: colors.background }]}>✓</Text>
              </View>
              <Text style={[styles.videoCompletedText, { color: colors.text }]}>Video captured</Text>
              <TouchableOpacity onPress={() => setShowCamera(true)}>
                <Text style={[styles.retakeLink, { color: colors.textSecondary }]}>Retake</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.videoButton, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              onPress={() => setShowCamera(true)}
              activeOpacity={0.8}
            >
              <View style={[styles.cameraIcon, { backgroundColor: colors.primary }]}>
                <Text style={styles.cameraIconText}>📹</Text>
              </View>
              <Text style={[styles.videoButtonText, { color: colors.text }]}>Capture video selfie</Text>
              <Text style={[styles.videoButtonSubtext, { color: colors.textTertiary }]}>1 second</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: colors.primary },
            (!videoPath || isLoading) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isLoading || !videoPath}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={[styles.submitButtonText, { color: colors.background }]}>Save Record</Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Your location will be recorded automatically
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 48,
    marginTop: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 48,
    fontWeight: '200',
    marginBottom: 8,
    letterSpacing: 3,
    fontFamily: 'System',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '300',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sliderSection: {
    marginBottom: 40,
  },
  videoSection: {
    marginBottom: 32,
  },
  videoButton: {
    borderRadius: 16,
    paddingVertical: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cameraIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cameraIconText: {
    fontSize: 36,
  },
  videoButtonText: {
    fontSize: 18,
    fontWeight: '300',
    marginBottom: 6,
    letterSpacing: 0.5,
    fontFamily: 'System',
  },
  videoButtonSubtext: {
    fontSize: 13,
    fontWeight: '300',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  videoCompleted: {
    borderRadius: 16,
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  checkmarkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  checkmark: {
    fontSize: 32,
    fontWeight: '300',
  },
  videoCompletedText: {
    fontSize: 18,
    fontWeight: '300',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  retakeLink: {
    fontSize: 13,
    fontWeight: '300',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textDecorationLine: 'underline',
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#e5e5e5',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  footerText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '400',
    paddingHorizontal: 32,
  },
});
