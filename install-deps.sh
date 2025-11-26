˙最一#!/bin/bash

echo "🚀 Installing EmoGo dependencies..."

# Core Expo packages
echo "📦 Installing Expo packages..."
npx expo install expo-router expo-notifications expo-sqlite expo-camera expo-media-library expo-location expo-file-system expo-sharing

# UI Components
echo "🎨 Installing UI components..."
npm install @react-native-community/slider

# Type definitions
echo "📝 Installing type definitions..."
npm install --save-dev @types/react @types/react-native

# Additional required packages
echo "🔧 Installing additional packages..."
npx expo install react-native-safe-area-context react-native-screens expo-status-bar

echo "✅ All dependencies installed successfully!"
echo ""
echo "📱 Next steps:"
echo "1. Run 'npx expo prebuild' to generate native projects (optional)"
echo "2. Run 'npx expo start' to start the development server"
echo "3. Scan the QR code with Expo Go app on your iPhone"
echo ""
echo "💡 Tips:"
echo "- For iOS testing: Download 'Expo Go' from App Store"
echo "- For production build: Use 'eas build' command"
echo "- Make sure to enable all permissions when prompted"
