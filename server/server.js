const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 访客数据模型
const visitorSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  city: String,
  country_name: String,
  country_code: String,
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
  visitCount: { type: Number, default: 1 },
  lastVisit: { type: Date, default: Date.now },
  userAgent: String,
  referrer: String
});

const Visitor = mongoose.model('Visitor', visitorSchema);

// 路由
app.get('/api/visitors', async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ timestamp: -1 });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/visitors', async (req, res) => {
  try {
    const { ip } = req.body;
    
    // 查找是否已存在此IP的访客
    const existingVisitor = await Visitor.findOne({ ip });
    
    if (existingVisitor) {
      // 更新现有访客的信息
      existingVisitor.visitCount += 1;
      existingVisitor.lastVisit = new Date();
      await existingVisitor.save();
      res.json(existingVisitor);
    } else {
      // 创建新访客记录
      const newVisitor = new Visitor(req.body);
      await newVisitor.save();
      res.status(201).json(newVisitor);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 获取统计数据
app.get('/api/visitors/stats', async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();
    const uniqueCountries = await Visitor.distinct('country_name');
    const uniqueCities = await Visitor.distinct('city');
    
    // 获取访问量最多的城市
    const topCities = await Visitor.aggregate([
      { $match: { city: { $exists: true, $ne: null } } },
      { $group: { 
        _id: { city: '$city', country: '$country_name' },
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } },
      { $limit: 3 },
      { $project: { 
        _id: 0,
        name: { $concat: ['$_id.city', ', ', '$_id.country'] },
        count: 1,
        percentage: { 
          $multiply: [{ $divide: ['$count', totalVisitors] }, 100] 
        }
      }}
    ]);
    
    res.json({
      totalVisitors,
      uniqueCountries: uniqueCountries.length,
      uniqueCities: uniqueCities.length,
      topCities
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取热图数据
app.get('/api/visitors/heatmap', async (req, res) => {
  try {
    const visitors = await Visitor.find({ 
      latitude: { $exists: true, $ne: null },
      longitude: { $exists: true, $ne: null }
    });
    
    const heatmapData = visitors.map(visitor => [
      visitor.latitude,
      visitor.longitude,
      Math.min(0.5 + visitor.visitCount * 0.1, 1) // 根据访问次数增加强度
    ]);
    
    res.json(heatmapData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 静态文件服务
app.use(express.static('../'));

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 