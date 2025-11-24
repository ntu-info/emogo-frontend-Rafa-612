# Expo Go 限制說明

## ⚠️ 你看到的警告

當你在 Expo Go 中運行 app 時，會看到這些警告：

```
WARN expo-notifications: Android Push notifications (remote notifications) functionality 
provided by expo-notifications was removed from Expo Go with the release of SDK 53.

WARN Due to changes in Androids permission requirements, Expo Go can no longer provide 
full access to the media library.
```

## 🤔 這些警告的意思

這些是 **Expo Go 的限制**，不是你的程式碼有問題！

### 1. 通知功能 (expo-notifications)
- **在 Expo Go 中**：✅ 本地通知正常工作（我們的定時提醒）
- **不支援的**：❌ 遠端推送通知（需要 development build）
- **對作業的影響**：✅ **完全沒有影響**，我們只用本地通知

### 2. 媒體庫功能 (expo-media-library)
- **在 Expo Go 中**：✅ 基本功能正常（保存影片到相簿）
- **限制**：某些進階功能受限
- **對作業的影響**：✅ **完全沒有影響**，基本保存功能正常

## ✅ 你的 App 功能完全正常

儘管有這些警告，你的 app **所有核心功能都正常運作**：

- ✅ 每日通知提醒（9am, 12pm, 6pm）
- ✅ 情緒量表記錄
- ✅ 影片錄製和保存
- ✅ 位置追蹤
- ✅ SQLite 資料庫
- ✅ 資料導出

## 📱 測試確認

你可以測試這些功能來確認：

1. **通知測試**：
   - 前往 Settings 頁面
   - 點擊 "Send Test Notification"
   - 應該會在 2 秒後收到通知 ✅

2. **影片保存測試**：
   - 錄製一個影片
   - 檢查手機相簿
   - 影片應該已保存 ✅

3. **完整流程測試**：
   - 記錄情緒 → 錄影 → 提交
   - 切換到 Data 頁面查看記錄
   - 應該能看到新記錄 ✅

## 🚀 如果需要完整功能（選做）

如果你想要 100% 完整功能（沒有任何警告），可以建立 development build：

```bash
# 安裝 EAS CLI
npm install -g eas-cli

# 登入
eas login

# 建立 iOS development build
eas build --profile development --platform ios
```

**但這不是必要的！** 用 Expo Go 測試完全符合作業要求。

## 📝 總結

| 功能 | Expo Go | Development Build | 作業需求 |
|------|---------|-------------------|----------|
| 本地通知 | ✅ | ✅ | ✅ 滿足 |
| 遠端推送 | ❌ | ✅ | ❌ 不需要 |
| 影片保存 | ✅ | ✅ | ✅ 滿足 |
| 位置追蹤 | ✅ | ✅ | ✅ 滿足 |
| 資料庫 | ✅ | ✅ | ✅ 滿足 |
| 資料導出 | ✅ | ✅ | ✅ 滿足 |

## 💡 建議

**對於這次作業**：
- ✅ 繼續使用 Expo Go
- ✅ 忽略這些警告
- ✅ 專注於記錄 4+ 筆數據
- ✅ 導出 JSON 並上傳到 GitHub

這些警告只是告訴你某些進階功能在 Expo Go 中受限，但**不影響你完成作業**！

---

**問題？** 如果遇到實際功能不工作（不是警告），再來除錯。警告可以安全忽略。
