import { Pressable, StyleSheet, Text, Animated, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import React, { useEffect, useRef } from 'react';

type TabButtonProps = {
  children?: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  accessibilityState?: { selected: boolean };
  label: string;
};

export function CustomTabButton({ onPress, onLongPress, accessibilityState, label }: TabButtonProps) {
  const isFocused = accessibilityState?.selected || false;
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isFocused ? 1 : 0.95,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [isFocused]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: isFocused ? 1 : 0.95,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {isFocused && (
          <View
            style={[
              styles.activeIndicator,
              { backgroundColor: colors.primary },
            ]}
          />
        )}
        <Text
          style={[
            styles.label,
            {
              color: isFocused ? colors.primary : colors.textTertiary,
              fontWeight: isFocused ? '600' : '400',
            },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
