const mongoose = require('mongoose');
const Store = require('../models/Store');
require('dotenv').config();

// 連接到 MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nearby')
  .then(() => console.log('MongoDB 連接成功'))
  .catch(err => console.error('MongoDB 連接失敗:', err));

// 定義測試店家資料
const stores = [
  {
    name: '星巴克 台北101店',
    address: '台北市信義區信義路五段7號',
    description: '提供優質咖啡和輕食的連鎖咖啡店',
    category: '咖啡廳',
    rating: 4.5,
    location: {
      type: 'Point',
      coordinates: [121.5654, 25.0330]
    }
  },
  {
    name: '鼎泰豐 信義店',
    address: '台北市信義區松高路68號',
    description: '世界知名的小籠包餐廳',
    category: '餐廳',
    rating: 4.8,
    location: {
      type: 'Point',
      coordinates: [121.5665, 25.0335]
    }
  },
  {
    name: '誠品書店 信義店',
    address: '台北市信義區松高路11號',
    description: '24小時營業的大型書店',
    category: '書店',
    rating: 4.6,
    location: {
      type: 'Point',
      coordinates: [121.5670, 25.0340]
    }
  },
  {
    name: '微風廣場',
    address: '台北市信義區松仁路100號',
    description: '精品購物中心',
    category: '購物中心',
    rating: 4.4,
    location: {
      type: 'Point',
      coordinates: [121.5675, 25.0345]
    }
  },
  {
    name: '茶湯會 信義店',
    address: '台北市信義區松壽路12號',
    description: '人氣手搖飲料店',
    category: '飲料店',
    rating: 4.3,
    location: {
      type: 'Point',
      coordinates: [121.5680, 25.0350]
    }
  }
];

// 添加店家到資料庫
async function addStores() {
  try {
    // 先清除所有現有的店家
    await Store.deleteMany({});
    console.log('已清除現有店家');

    // 添加新的店家
    const result = await Store.insertMany(stores);
    console.log('成功添加店家:', result.length);
    
    // 關閉資料庫連接
    await mongoose.connection.close();
    console.log('資料庫連接已關閉');
  } catch (error) {
    console.error('添加店家失敗:', error);
    process.exit(1);
  }
}

// 執行添加店家的操作
addStores(); 