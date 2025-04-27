const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const storeRoutes = require('./routes/stores');

const app = express();

// 中間件
app.use(cors());
app.use(bodyParser.json());

// 資料庫連接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nearby')
.then(() => console.log('MongoDB 連接成功'))
.catch(err => console.error('MongoDB 連接失敗:', err));

// 路由
app.use('/api/stores', storeRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'NearBy API 服務運行中' });
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '伺服器錯誤' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`伺服器運行在端口 ${PORT}`);
}); 