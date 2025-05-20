/**
 * 访客数据API客户端
 * 用于与服务器端API通信，管理访客数据
 */

const VisitorAPI = {
  // API基础URL，根据环境自动选择
  baseUrl: window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api',
  
  /**
   * 提交新的访客数据
   * @param {Object} visitorData - 访客信息
   * @returns {Promise<Object>} - 返回保存的访客数据
   */
  async saveVisitor(visitorData) {
    try {
      // 添加用户代理和引荐来源
      const enrichedData = {
        ...visitorData,
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct'
      };
      
      const response = await fetch(`${this.baseUrl}/visitors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(enrichedData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving visitor data:', error);
      // 如果API调用失败，回退到本地存储
      if (window.VisitorStorage) {
        console.log('Falling back to local storage');
        return window.VisitorStorage.addVisitor(visitorData);
      }
      return null;
    }
  },
  
  /**
   * 获取访客统计数据
   * @returns {Promise<Object>} - 返回访客统计信息
   */
  async getStats() {
    try {
      const response = await fetch(`${this.baseUrl}/visitors/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
      // 如果API调用失败，回退到本地存储
      if (window.VisitorStorage) {
        console.log('Falling back to local storage for stats');
        return window.VisitorStorage.getStats();
      }
      return {
        totalVisitors: 0,
        uniqueCountries: 0,
        uniqueCities: 0,
        topCities: []
      };
    }
  },
  
  /**
   * 获取热图数据
   * @returns {Promise<Array>} - 返回用于热图的数据点数组
   */
  async getHeatmapData() {
    try {
      const response = await fetch(`${this.baseUrl}/visitors/heatmap`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
      // 如果API调用失败，回退到本地存储
      if (window.VisitorStorage) {
        console.log('Falling back to local storage for heatmap data');
        return window.VisitorStorage.getHeatmapData();
      }
      return [];
    }
  },
  
  /**
   * 获取所有访客数据
   * @returns {Promise<Array>} - 返回所有访客数据
   */
  async getAllVisitors() {
    try {
      const response = await fetch(`${this.baseUrl}/visitors`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching all visitors:', error);
      // 如果API调用失败，回退到本地存储
      if (window.VisitorStorage) {
        console.log('Falling back to local storage for visitor list');
        const data = window.VisitorStorage.getData();
        return data.visitors || [];
      }
      return [];
    }
  }
};

// 导出API对象
export default VisitorAPI; 