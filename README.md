<<<<<<< HEAD
# NearBy

NearBy 是一個基於地理位置的移動應用程式，幫助用戶收藏喜愛的店家、在 Google 地圖上查看店家位置，並在靠近時接收自動推送通知。無論是探索附近美食還是記錄常去的咖啡廳，NearBy 都能讓你的生活更便利。

## 專案結構

```
NearBy/
├── client/                 # React Native + Expo 前端
├── server/                 # Node.js + Express 後端
└── README.md
```

## 技術棧

- 前端：React Native + Expo
- 後端：Node.js + Express
- 資料庫：MongoDB
- 地圖服務：Google Maps API
- 推送通知：Expo Notifications

## 功能特點

- 店家收藏管理：添加、刪除和查看收藏的店家。
- Google 地圖整合：顯示用戶當前位置和收藏店家的標記。
- 基於地理位置的推送通知：當用戶靠近收藏店家時自動推送提醒。
- 使用者位置追蹤：實時更新用戶位置，支援地理圍欄（Geofencing）。

## 開發環境設置

### 前端設置

1. 安裝依賴：
```bash
cd client
npm install
```

2. 配置環境變數：
- 至 `.env` 填入必要的 API 金鑰和資料庫連接資訊

3. 啟動開發伺服器：
```bash
npm start
```

### 後端設置

1. 安裝依賴：
```bash
cd server
npm install
```

2. 啟動開發伺服器：
```bash
npm run dev
```

## 環境要求

- Node.js >= 18
- MongoDB >= 6.0
- Expo CLI
- Google Maps API 金鑰
=======
# NearBy
>>>>>>> 75d130c5a24c91d30672033d806aafe77729d33c
