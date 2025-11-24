# Data Export Folder

這個資料夾用於存放從 EmoGo app 導出的情緒記錄數據。

## 如何導出數據

1. 在 App 的 **Data** 頁面點擊 **「Export Data」**
2. 選擇分享方式（AirDrop、Files 等）
3. 將導出的 JSON 檔案放到這個資料夾
4. Commit 並 push 到 GitHub

## 檔案命名格式

導出的檔案會自動命名為：
```
emogo_data_YYYY-MM-DDTHH-MM-SS-sssZ.json
```

範例：
```
emogo_data_2024-01-15T09-30-00-000Z.json
```

## 資料格式

每個 JSON 檔案包含一個陣列，每個元素代表一筆情緒記錄：

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
  },
  {
    "id": 2,
    "timestamp": "2024-01-15T12:15:00.000Z",
    "emotionScore": 5,
    "latitude": 25.0420,
    "longitude": 121.5650,
    "videoPath": "/path/to/video2.mp4",
    "address": "Taipei, Taiwan, TW"
  }
]
```

## 欄位說明

- **id**: 記錄的唯一識別碼
- **timestamp**: 記錄時間（ISO 8601 格式）
- **emotionScore**: 情緒分數（0-10）
  - 0 = Awfully Bad 😢
  - 10 = Perfectly Good 😄
- **latitude**: 緯度
- **longitude**: 經度
- **videoPath**: 影片檔案路徑（儲存在手機中）
- **address**: 反向地理編碼的地址

## 作業要求

⚠️ **重要**: 至少需要 **4 筆以上**的記錄才能滿足作業要求。

## 隱私注意事項

🔒 這些數據包含：
- 情緒狀態
- 地理位置
- 影片檔案路徑

請確保：
- 只分享你願意公開的數據
- 影片檔案不會自動上傳（只有路徑）
- 如果需要，可以在提交前匿名化地理位置
