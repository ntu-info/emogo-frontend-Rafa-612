import { useTheme } from '@/contexts/ThemeContext';
import { View, StyleSheet } from 'react-native';

export default function TabBarBackground() {
  const { colors } = useTheme();
  
  return (
    <View 
      style={[
        styles.background, 
        { backgroundColor: colors.cardBackground, borderTopColor: colors.border }
      ]} 
    />
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
  },
});
