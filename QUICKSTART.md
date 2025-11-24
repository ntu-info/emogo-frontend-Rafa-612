# EmoGo 快速開始指南

## 🚀 快速安裝（3 分鐘）

### Step 1: 安裝依賴
```bash
# 方法 1: 使用安裝腳本（推薦）
chmod +x install-deps.sh
./install-deps.sh

# 方法 2: 手動安裝
npx expo install expo-router expo-notifications expo-sqlite expo-camera expo-media-library expo-location expo-file-system expo-sharing
npm install @react-native-community/slider
```

### Step 2: 啟動開發伺服器
```bash
npx expo start
```

### Step 3: 在 iPhone 上測試
1. 從 App Store 下載 **Expo Go**
2. 使用相機掃描終端機中的 QR code
3. App 會在 Expo Go 中開啟

## 📱 首次使用流程

### 1️⃣ 設定權限（Settings 頁面）
- ✅ 開啟「Daily Reminders」
- ✅ 點擊「Location Access」授權
- ✅ 點擊「Send Test Notification」測試

### 2️⃣ 記錄情緒（Record 頁面）
- 拖曳滑桿選擇情緒 (0-10)
- 錄製 1 秒影片自拍
- 提交記錄

### 3️⃣ 導出數據（Data 頁面）
- 記錄 4+ 筆後點擊「Export Data」
- 選擇分享方式
- 將 JSON 檔案放入 GitHub 的 `data/` 資料夾

## 🎯 完成作業檢查清單

- [ ] App 可以成功啟動
- [ ] 通知權限已授予
- [ ] 位置權限已授予
- [ ] 相機權限已授予
- [ ] 已成功記錄 4 筆以上資料
- [ ] 數據已導出為 JSON
- [ ] JSON 檔案已上傳到 GitHub `data/` 資料夾

## 📅 通知時間

App 會在以下時間發送提醒：
- 🌅 **09:00** - 早晨
- 🌞 **12:00** - 中午
- 🌆 **18:00** - 傍晚

## 📊 數據格式範例

```json
[
  {
    "id": 1,
    "timestamp": "2024-01-15T09:30:00.000Z",
    "emotionScore": 7,
    "latitude": 25.0330,
    "longitude": 121.5654,
    "videoPath": "/var/mobile/.../emogo_video_2024-01-15.mp4",
    "address": "Taipei, Taiwan, TW"
  }
]
```

## ❓ 常見問題

### Q: 為什麼我收不到通知？
**A:** 檢查以下設定：
- iPhone 設定 > 通知 > EmoGo > 允許通知
- 確認「重要提示」已開啟
- 在 Settings 頁面測試通知

### Q: iPhone 怎麼測試這個 app？
**A:** 有兩種方法：
1. **Expo Go**（推薦新手）：下載 Expo Go，掃描 QR code
2. **EAS Build**（完整功能）：使用 `eas build` 建立 iOS app

### Q: 影片儲存在哪裡？
**A:** 
- 手機相簿（透過 expo-media-library）
- App 內部目錄（透過 expo-file-system）
- 數據庫記錄路徑

### Q: 如何把數據放到 GitHub？
**A:**
1. 在 Data 頁面點擊「Export Data」
2. 透過 AirDrop 或其他方式傳到電腦
3. 在專案中創建 `data/` 資料夾
4. 將 JSON 檔案放入
5. Git commit & push

## 🔧 故障排除

### 清理快取
```bash
npx expo start -c
```

### 重新安裝依賴
```bash
rm -rf node_modules
npm install
```

### 查看錯誤日誌
```bash
npx expo start --dev-client
# 然後在 Expo Go 中搖動手機 > 開啟開發者選單 > Debug
```

## 📞 需要幫助？

- 查看完整 README.md
- 檢查 Expo 文檔：https://docs.expo.dev
- 查看專案結構和程式碼註解

---

🎉 **祝你使用順利！記得至少記錄 4 筆數據喔！**
