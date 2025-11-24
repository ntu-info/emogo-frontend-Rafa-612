import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '@/contexts/ThemeContext';

interface EmotionSliderProps {
  value: number;
  onValueChange: (value: number) => void;
}

export default function EmotionSlider({ value, onValueChange }: EmotionSliderProps) {
  const { colors } = useTheme();
  const getEmotionLabel = (score: number): string => {
    if (score === 0) return 'Awfully Bad 😢';
    if (score <= 2) return 'Very Bad 😞';
    if (score <= 4) return 'Bad 😔';
    if (score <= 5) return 'Neutral 😐';
    if (score <= 7) return 'Good 🙂';
    if (score <= 9) return 'Very Good 😊';
    return 'Perfectly Good 😄';
  };

  const getEmotionColor = (score: number): string => {
    // 從紅色 (0) 到深橙黃 (5) 到深綠色 (10)
    if (score <= 5) {
      // 紅色到深橙黃
      const ratio = score / 5;
      const red = 220;
      const green = Math.round(180 * ratio); // 0 -> 180 (更深的黃)
      return `rgb(${red}, ${green}, 0)`;
    } else {
      // 深橙黃到深綠色
      const ratio = (score - 5) / 5;
      const red = Math.round(180 * (1 - ratio)); // 180 -> 0
      const green = 180 + Math.round(20 * ratio); // 180 -> 200 (深綠)
      return `rgb(${red}, ${green}, 0)`;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>How are you feeling?</Text>
      
      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreText, { color: getEmotionColor(value) }]}>
          {value}
        </Text>
        <Text style={[styles.labelText, { color: getEmotionColor(value) }]}>
          {getEmotionLabel(value)}
        </Text>
      </View>

      <View style={styles.sliderWrapper}>
        {/* 深色背景軌道增強對比 */}
        <View style={styles.sliderTrackBackground} />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={value}
          onValueChange={onValueChange}
          minimumTrackTintColor={getEmotionColor(value)}
          maximumTrackTintColor="rgba(0,0,0,0.08)"
          thumbTintColor={getEmotionColor(value)}
        />
      </View>

      <View style={styles.extremeLabelsContainer}>
        <View style={styles.extremeLabel}>
          <Text style={[styles.extremeScore, { color: colors.textSecondary }]}>0</Text>
          <Text style={[styles.extremeDescription, { color: colors.textTertiary }]}>Awfully Bad</Text>
        </View>
        <View style={styles.extremeLabel}>
          <Text style={[styles.extremeScore, { color: colors.textSecondary }]}>10</Text>
          <Text style={[styles.extremeDescription, { color: colors.textTertiary }]}>Perfectly Good</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 28,
    paddingVertical: 36,
    backgroundColor: '#fafafa',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 32,
    color: '#1a1a1a',
    letterSpacing: 0.5,
    fontFamily: 'System',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  scoreText: {
    fontSize: 80,
    fontWeight: '200',
    marginBottom: 8,
    letterSpacing: 2,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sliderWrapper: {
    position: 'relative',
    marginBottom: 25,
    paddingHorizontal: 4,
  },
  sliderTrackBackground: {
    position: 'absolute',
    left: 4,
    right: 4,
    top: '50%',
    height: 4,
    backgroundColor: '#e8e8e8',
    borderRadius: 2,
    transform: [{ translateY: -2 }],
    zIndex: -1,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  extremeLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  extremeLabel: {
    alignItems: 'center',
  },
  extremeScore: {
    fontSize: 16,
    fontWeight: '300',
    color: '#666',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  extremeDescription: {
    fontSize: 11,
    color: '#999',
    fontWeight: '300',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
