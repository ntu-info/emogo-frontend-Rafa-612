[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/1M59WghA)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=21804124&assignment_repo_type=AssignmentRepo)

# 📱 APK Download

**Download the Android APK here:**  
🔗 [https://expo.dev/accounts/rafa-612/projects/expo-router-mwe/builds/c038c676-5dfc-4d23-bb85-b3b75223fd08](https://expo.dev/accounts/rafa-612/projects/expo-router-mwe/builds/c038c676-5dfc-4d23-bb85-b3b75223fd08)

---

# Expo Router Minimal Working Example

This is a very small Expo project using **expo-router** with:

- A root `Stack` layout
- A `(tabs)` group using `Tabs`
- A `details` screen pushed on top of the tab stack
- `Link` components and `useRouter` for navigation

## How to run

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

2. Start the dev server:

   ```bash
   npx expo start --tunnel
   ```

3. Open the app on a device or emulator using the Expo dev tools.

# EmoGo - Emotion Tracking App

情緒追蹤應用程式，用於記錄每日情緒狀態、拍攝影片自拍並追蹤地理位置。

## 功能特色

### ✅ 已實現功能

1. **每日通知提醒** (9:00 AM, 12:00 PM, 6:00 PM)
   - 使用 `expo-notifications` 實現
   - 支援 iOS 和 Android
   - 最高優先級通知，確保送達

2. **情緒量表** (0-10 分)
   - 互動式滑桿，從紅色漸層到綠色
   - 0 分 = Awfully Bad 😢
   - 10 分 = Perfectly Good 😄

3. **影片自拍** (1 秒)
   - 使用 `expo-camera` 錄製
   - 前置鏡頭自拍
   - 自動儲存到相簿和 app 目錄
   - 支援翻轉鏡頭

4. **位置追蹤**
   - 使用 `expo-location` 自動記錄
   - 反向地理編碼顯示地址
   - 背景位置追蹤支援

5. **數據儲存與導出**
   - SQLite 本地資料庫 (`expo-sqlite`)
   - JSON 格式導出
   - 使用 `expo-sharing` 分享數據

## 安裝步驟

### 1. 安裝必要的套件

```bash
# 核心依賴
npm install expo-router expo-notifications expo-sqlite expo-camera expo-media-library expo-location expo-file-system expo-sharing

# UI 組件
npm install @react-native-community/slider

# 類型定義
npm install --save-dev @types/react @types/react-native
```

### 2. 設定開發環境

```bash
# 安裝 Expo CLI（如果還沒安裝）
npm install -g expo-cli

# 安裝依賴
npm install

# 清理快取（如果需要）
npx expo start -c
```

### 3. 在手機上測試

#### iPhone 測試方法：

**方法 1: 使用 Expo Go（最簡單）**
```bash
# 1. 在 iPhone 上從 App Store 下載 Expo Go
# 2. 啟動開發伺服器
npx expo start

# 3. 使用 iPhone 相機掃描終端機中的 QR code
# 4. 在 Expo Go 中打開應用程式
```

**方法 2: 使用 EAS Build（推薦用於完整測試）**
```bash
# 1. 安裝 EAS CLI
npm install -g eas-cli

# 2. 登入 Expo 帳號
eas login

# 3. 建立 iOS 開發版本
eas build --profile development --platform ios

# 4. 下載並安裝到 iPhone
# 5. 使用 Expo Go 或獨立 app 執行
```

## 使用方式

### 首次使用設定

1. **開啟 App 後立即前往 Settings 頁面**
2. **啟用通知權限** - 點擊「Daily Reminders」開關
3. **授予位置權限** - 點擊「Location Access」
4. **測試通知** - 點擊「Send Test Notification」確認通知正常

### 記錄情緒

1. **前往 Record 頁面**
2. **拖曳滑桿選擇情緒分數** (0-10)
3. **點擊「Record Video」錄製 1 秒自拍**
   - 會有 3 秒倒數
   - 自動錄製 1 秒後停止
4. **點擊「Submit Record」提交**
   - 自動記錄位置
   - 儲存到資料庫

### 查看和導出數據

1. **前往 Data 頁面查看所有記錄**
2. **當記錄 ≥ 4 筆時，點擊「Export Data」**
3. **選擇分享方式**（AirDrop, Files, 等）
4. **將 JSON 檔案加入 GitHub repo 的 `data/` 資料夾**

## 專案結構

```
emogo-frontend/
├── app/
│   ├── (tabs)/
│   │   ├── record.tsx      # 記錄情緒頁面
│   │   ├── data.tsx        # 數據查看頁面
│   │   └── settings.tsx    # 設定頁面
│   └── _layout.tsx         # 主要佈局
├── components/
│   ├── EmotionSlider.tsx   # 情緒滑桿組件
│   └── VideoRecorder.tsx   # 影片錄製組件
├── utils/
│   ├── database.ts         # SQLite 資料庫操作
│   ├── notifications.ts    # 通知管理
│   ├── location.ts         # 位置服務
│   └── dataExport.ts       # 數據導出
├── hooks/
│   └── useAppInitialization.ts  # App 初始化
└── app.json                # Expo 配置
```

## 資料格式

導出的 JSON 格式：

```json
[
  {
    "id": 1,
    "timestamp": "2024-01-15T09:30:00.000Z",
    "emotionScore": 7,
    "latitude": 25.0330,
    "longitude": 121.5654,
    "videoPath": "/path/to/video.mp4",
    "address": "Taipei, Taiwan, TW"
  }
]
```

## 故障排除

### 通知沒有收到

1. 檢查手機設定中的通知權限
2. 確認 App 有「重要通知」權限（Android）
3. iOS: 設定 > 通知 > EmoGo > 允許通知
4. 使用「Send Test Notification」測試

### 相機無法使用

1. 檢查相機和麥克風權限
2. iOS: 設定 > 隱私權 > 相機/麥克風
3. Android: 設定 > 應用程式 > EmoGo > 權限

### 位置無法記錄

1. 檢查位置權限
2. iOS: 允許「使用 App 期間」或「永遠」
3. Android: 允許「使用應用程式時」

### 編譯錯誤

```bash
# 清理快取並重新安裝
rm -rf node_modules
npm install
npx expo start -c
```

## 注意事項

⚠️ **重要**：
- 至少需要記錄 **4 筆以上**的數據才能完成作業要求
- 導出的數據檔案需要放入 GitHub repo 的 `data/` 資料夾
- 影片檔案會佔用空間，建議定期清理舊記錄

## 技術棧

- **Framework**: Expo + React Native
- **Routing**: Expo Router
- **Database**: SQLite (expo-sqlite)
- **Notifications**: expo-notifications
- **Camera**: expo-camera
- **Location**: expo-location
- **File System**: expo-file-system
- **UI**: React Native Components + @react-native-community/slider

## 授權

此專案為教育用途，由 NTU INFO 課程作業開發。
