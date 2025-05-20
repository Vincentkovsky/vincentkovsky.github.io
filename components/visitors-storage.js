// 访客数据本地存储管理
const VisitorStorage = {
  // 存储键名
  STORAGE_KEY: 'portfolio_visitors_data',
  
  // 初始化数据结构
  initData() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const initialData = {
        visitors: [],
        totalCount: 0,
        countries: {},
        cities: {},
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
    }
    return this.getData();
  },
  
  // 获取存储的数据
  getData() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || this.initData();
    } catch (e) {
      console.error('Error retrieving visitor data:', e);
      return this.initData();
    }
  },
  
  // 添加新访客
  addVisitor(visitorData) {
    try {
      const data = this.getData();
      
      // 添加IP和时间戳
      const visitor = {
        ...visitorData,
        timestamp: new Date().toISOString(),
        visitId: `visit_${Date.now()}_${Math.floor(Math.random() * 1000)}`
      };
      
      // 更新访客列表
      data.visitors.push(visitor);
      data.totalCount++;
      
      // 更新国家统计
      if (visitor.country_name) {
        data.countries[visitor.country_name] = (data.countries[visitor.country_name] || 0) + 1;
      }
      
      // 更新城市统计
      if (visitor.city) {
        const cityKey = `${visitor.city}, ${visitor.country_name}`;
        data.cities[cityKey] = (data.cities[cityKey] || 0) + 1;
      }
      
      // 更新最后更新时间
      data.lastUpdated = new Date().toISOString();
      
      // 存储更新后的数据
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      
      return data;
    } catch (e) {
      console.error('Error adding visitor:', e);
      return null;
    }
  },
  
  // 获取顶部访问城市
  getTopCities(limit = 3) {
    const data = this.getData();
    
    // 将城市数据转换为数组并排序
    const cityEntries = Object.entries(data.cities || {});
    const sortedCities = cityEntries.sort((a, b) => b[1] - a[1]);
    
    // 返回前N个城市及其百分比
    return sortedCities.slice(0, limit).map(([city, count]) => ({
      name: city,
      count,
      percentage: data.totalCount ? Math.round((count / data.totalCount) * 100) : 0
    }));
  },
  
  // 获取访客统计摘要
  getStats() {
    const data = this.getData();
    return {
      totalVisitors: data.totalCount,
      uniqueCountries: Object.keys(data.countries || {}).length,
      uniqueCities: Object.keys(data.cities || {}).length,
      topCities: this.getTopCities()
    };
  },
  
  // 获取访客位置数据用于热图
  getHeatmapData() {
    const data = this.getData();
    
    // 将访客数据转换为热图数据格式 [lat, lng, intensity]
    return data.visitors
      .filter(v => v.latitude && v.longitude)
      .map(v => [
        parseFloat(v.latitude), 
        parseFloat(v.longitude), 
        0.5 // 默认强度值
      ]);
  },
  
  // 清除所有访客数据（重置）
  clearData() {
    localStorage.removeItem(this.STORAGE_KEY);
    return this.initData();
  }
};

// 导出模块
export default VisitorStorage; 