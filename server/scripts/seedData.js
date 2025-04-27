const mongoose = require('mongoose');
const Store = require('../models/Store');

const stores = [
  {
    name: '台北 101',
    address: '台北市信義區信義路五段7號',
    description: '台北地標建築',
    category: '景點',
    rating: 4.5,
    location: {
      type: 'Point',
      coordinates: [121.5654, 25.0330]
    }
  },
  {
    name: '誠品信義店',
    address: '台北市信義區松高路11號',
    description: '24小時書店',
    category: '書店',
    rating: 4.3,
    location: {
      type: 'Point',
      coordinates: [121.5665, 25.0393]
    }
  },
  {
    name: '象山步道',
    address: '台北市信義區信義路五段150巷',
    description: '熱門登山步道',
    category: '戶外',
    rating: 4.4,
    location: {
      type: 'Point',
      coordinates: [121.5719, 25.0275]
    }
  },
  {
    name: '松山文創園區',
    address: '台北市信義區光復南路133號',
    description: '文創園區',
    category: '文化',
    rating: 4.2,
    location: {
      type: 'Point',
      coordinates: [121.5602, 25.0436]
    }
  }
];

mongoose.connect('mongodb://localhost:27017/nearby', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB 連接成功');
  
  // 清空現有資料
  await Store.deleteMany({});
  
  // 插入新資料
  await Store.insertMany(stores);
  
  console.log('資料添加成功');
  process.exit(0);
})
.catch(err => {
  console.error('MongoDB 連接失敗:', err);
  process.exit(1);
}); 