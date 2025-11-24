# 完整安裝命令清單

## 📦 安裝所有必要套件

請按照以下順序執行命令：

### 1. 核心 Expo 套件
```bash
npx expo install expo-router expo-notifications expo-sqlite expo-camera expo-media-library expo-location expo-file-system expo-sharing react-native-safe-area-context react-native-screens expo-status-bar
```

### 2. UI 組件
```bash
npm install @react-native-community/slider
```

### 3. TypeScript 類型定義
```bash
npm install --save-dev @types/react @types/react-native
```

### 4. 確認安裝
```bash
npm list expo-notifications expo-sqlite expo-camera expo-location
```

## 🚀 啟動 App

### 開發模式（推薦）
```bash
# 清理快取並啟動
npx expo start -c

# 或一般啟動
npx expo start
```

### 選擇執行平台
- 按 `i` - iOS 模擬器（需要 Mac）
- 按 `a` - Android 模擬器
- 掃描 QR code - 使用 Expo Go（iPhone/Android）

## 📱 iPhone 測試步驟

### 方法 1: Expo Go（最簡單）

1. **下載 Expo Go**
   - 在 iPhone 上開啟 App Store
   - 搜尋並下載「Expo Go」

2. **啟動開發伺服器**
   ```bash
   npx expo start
   ```

3. **連接手機**
   - 確保電腦和 iPhone 在同一 Wi-Fi
   - 使用 iPhone 相機掃描終端機中的 QR code
   - App 會在 Expo Go 中自動開啟

### 方法 2: EAS Build（完整功能）

1. **安裝 EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **登入 Expo 帳號**
   ```bash
   eas login
   ```

3. **建立開發版本**
   ```bash
   eas build:configure
   eas build --profile development --platform ios
   ```

4. **安裝到 iPhone**
   - 掃描建置完成後的 QR code
   - 或下載 .ipa 檔案透過 TestFlight 安裝

## 🔧 常用命令

### 清理和重置
```bash
# 清理快取
npx expo start -c

# 清理 Metro bundler
rm -rf .expo
rm -rf node_modules/.cache

# 完全重新安裝
rm -rf node_modules
npm install
```

### 查看日誌
```bash
# 查看 React Native 日誌
npx react-native log-ios    # iOS
npx react-native log-android # Android
```

### 預構建（如果需要）
```bash
npx expo prebuild --clean
```

## ✅ 驗證安裝

執行以下命令確認所有套件已正確安裝：

```bash
# 檢查 Expo 版本
npx expo --version

# 檢查已安裝的套件
npm list --depth=0 | grep expo

# 檢查 TypeScript 配置
npx tsc --noEmit
```

## 🐛 常見錯誤解決

### 錯誤: "Cannot find module"
```bash
npm install
npx expo start -c
```

### 錯誤: "Metro bundler error"
```bash
rm -rf node_modules/.cache
npx expo start -c
```

### 錯誤: "Unable to resolve module"
```bash
watchman watch-del-all  # macOS
npx expo start -c
```

### 錯誤: TypeScript 錯誤
```bash
npm install --save-dev @types/react @types/react-native
npx expo start
```

## 📋 套件版本參考

所有套件會自動安裝與你的 Expo SDK 版本相容的版本。當前專案使用：

- expo: ~51.x.x
- react: 18.x.x
- react-native: 0.74.x

## 💡 開發提示

1. **首次執行**：
   - 啟動後會自動要求權限
   - 前往 Settings 頁面啟用所有權限

2. **熱重載**：
   - 修改程式碼會自動重載
   - 在 Expo Go 中搖動手機可開啟開發選單

3. **除錯**：
   - 搖動 iPhone 開啟開發選單
   - 選擇 "Debug Remote JS" 在 Chrome 中除錯

## 🎯 快速檢查清單

安裝完成後，確認：

- [ ] `npx expo start` 可以成功執行
- [ ] Expo Go 可以掃描 QR code
- [ ] App 在手機上可以開啟
- [ ] Settings 頁面所有權限可以授予
- [ ] Record 頁面可以錄影
- [ ] Data 頁面可以查看記錄

完成以上檢查後，就可以開始使用 App 了！🎉
