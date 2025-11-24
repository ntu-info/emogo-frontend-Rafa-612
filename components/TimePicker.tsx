import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface TimePickerProps {
  hour: number;
  minute: number;
  onTimeChange: (hour: number, minute: number) => void;
  colors: any;
}

export function TimePicker({ hour, minute, onTimeChange, colors }: TimePickerProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Text style={[styles.columnLabel, { color: colors.textSecondary }]}>Hour</Text>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={true}
        >
          {hours.map((h) => (
            <TouchableOpacity
              key={h}
              style={[
                styles.option,
                hour === h && { backgroundColor: colors.primary },
              ]}
              onPress={() => onTimeChange(h, minute)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: hour === h ? colors.background : colors.text },
                ]}
              >
                {h.toString().padStart(2, '0')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={[styles.separator, { color: colors.text }]}>:</Text>

      <View style={styles.column}>
        <Text style={[styles.columnLabel, { color: colors.textSecondary }]}>Minute</Text>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={true}
        >
          {minutes.map((m) => (
            <TouchableOpacity
              key={m}
              style={[
                styles.option,
                minute === m && { backgroundColor: colors.primary },
              ]}
              onPress={() => onTimeChange(hour, m)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: minute === m ? colors.background : colors.text },
                ]}
              >
                {m.toString().padStart(2, '0')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  column: {
    width: 80,
  },
  columnLabel: {
    fontSize: 12,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollView: {
    height: 180,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '400',
  },
  separator: {
    fontSize: 24,
    fontWeight: '200',
    marginHorizontal: 12,
  },
});
