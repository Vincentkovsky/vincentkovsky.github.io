/**
 * 访客数据存储选择器
 * 整合三种存储方法（本地、服务器、Firebase），提供统一接口
 */

// 导入存储模块
import FirebaseVisitorStorage from './firebase-config.js';

// 首先检查是否有服务器API可用
async function checkServerAvailability() {
  try {
    const response = await fetch('/api/health', { 
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      // 设置超时，避免长时间等待
      signal: AbortSignal.timeout(3000)
    });
    return response.ok;
  } catch (error) {
    console.warn('Server API not available:', error);
    return false;
  }
}

// 统一的存储管理器
const StorageManager = {
  // 默认为本地存储模式
  currentMode: 'local',
  
  // 可用存储模式列表
  availableModes: ['local'],
  
  // 存储模式配置状态
  modeStatus: {
    local: { available: true, configured: true },
    server: { available: false, configured: false },
    firebase: { available: true, configured: false }
  },
  
  // 初始化存储管理器
  async init() {
    // 检查服务器是否可用
    const serverAvailable = await checkServerAvailability();
    this.modeStatus.server.available = serverAvailable;
    
    if (serverAvailable) {
      this.availableModes.push('server');
    }
    
    // 检查Firebase配置
    try {
      if (typeof FirebaseVisitorStorage !== 'undefined') {
        const testStats = await FirebaseVisitorStorage.getStats();
        this.modeStatus.firebase.configured = true;
        this.availableModes.push('firebase');
      }
    } catch (error) {
      console.warn('Firebase not properly configured:', error);
    }
    
    // 尝试从localStorage加载之前的配置
    const savedMode = localStorage.getItem('preferred_storage_mode');
    if (savedMode && this.availableModes.includes(savedMode)) {
      this.currentMode = savedMode;
    }
    
    return this.availableModes;
  },
  
  // 设置当前存储模式
  setMode(mode) {
    if (this.availableModes.includes(mode)) {
      this.currentMode = mode;
      localStorage.setItem('preferred_storage_mode', mode);
      return true;
    }
    return false;
  },
  
  // 获取当前存储模式
  getMode() {
    return this.currentMode;
  },
  
  // 添加新访客
  async addVisitor(visitorData) {
    switch (this.currentMode) {
      case 'server':
        try {
          return await window.VisitorAPI.saveVisitor(visitorData);
        } catch (error) {
          console.error('Server storage error, falling back to local:', error);
          return window.VisitorStorage.addVisitor(visitorData);
        }
      case 'firebase':
        try {
          return await FirebaseVisitorStorage.addVisitor(visitorData);
        } catch (error) {
          console.error('Firebase storage error, falling back to local:', error);
          return window.VisitorStorage.addVisitor(visitorData);
        }
      case 'local':
      default:
        return window.VisitorStorage.addVisitor(visitorData);
    }
  },
  
  // 获取访客统计
  async getStats() {
    switch (this.currentMode) {
      case 'server':
        try {
          return await window.VisitorAPI.getStats();
        } catch (error) {
          console.error('Server stats error, falling back to local:', error);
          return window.VisitorStorage.getStats();
        }
      case 'firebase':
        try {
          return await FirebaseVisitorStorage.getStats();
        } catch (error) {
          console.error('Firebase stats error, falling back to local:', error);
          return window.VisitorStorage.getStats();
        }
      case 'local':
      default:
        return window.VisitorStorage.getStats();
    }
  },
  
  // 获取热图数据
  async getHeatmapData() {
    switch (this.currentMode) {
      case 'server':
        try {
          return await window.VisitorAPI.getHeatmapData();
        } catch (error) {
          console.error('Server heatmap error, falling back to local:', error);
          return window.VisitorStorage.getHeatmapData();
        }
      case 'firebase':
        try {
          return await FirebaseVisitorStorage.getHeatmapData();
        } catch (error) {
          console.error('Firebase heatmap error, falling back to local:', error);
          return window.VisitorStorage.getHeatmapData();
        }
      case 'local':
      default:
        return window.VisitorStorage.getHeatmapData();
    }
  },
  
  // 获取所有访客
  async getAllVisitors() {
    switch (this.currentMode) {
      case 'server':
        try {
          return await window.VisitorAPI.getAllVisitors();
        } catch (error) {
          console.error('Server visitors list error, falling back to local:', error);
          const data = window.VisitorStorage.getData();
          return data.visitors || [];
        }
      case 'firebase':
        try {
          return await FirebaseVisitorStorage.getAllVisitors();
        } catch (error) {
          console.error('Firebase visitors list error, falling back to local:', error);
          const data = window.VisitorStorage.getData();
          return data.visitors || [];
        }
      case 'local':
      default:
        const data = window.VisitorStorage.getData();
        return data.visitors || [];
    }
  },
  
  // 清除访客数据
  async clearData() {
    switch (this.currentMode) {
      case 'server':
        try {
          // 服务器端清除操作
          const response = await fetch('/api/visitors/clear', { method: 'DELETE' });
          return response.ok;
        } catch (error) {
          console.error('Server clear error:', error);
          return false;
        }
      case 'firebase':
        try {
          return await FirebaseVisitorStorage.clearData();
        } catch (error) {
          console.error('Firebase clear error:', error);
          return false;
        }
      case 'local':
      default:
        window.VisitorStorage.clearData();
        return true;
    }
  },
  
  // 导出访客数据
  async exportData() {
    let data;
    const timestamp = new Date().toISOString().slice(0, 10);
    
    switch (this.currentMode) {
      case 'server':
        try {
          data = await window.VisitorAPI.getAllVisitors();
          data = { source: 'server', visitors: data };
        } catch (error) {
          console.error('Server export error, falling back to local:', error);
          data = window.VisitorStorage.getData();
          data.source = 'local_fallback';
        }
        break;
      case 'firebase':
        try {
          data = await FirebaseVisitorStorage.getAllVisitors();
          data = { source: 'firebase', visitors: data };
        } catch (error) {
          console.error('Firebase export error, falling back to local:', error);
          data = window.VisitorStorage.getData();
          data.source = 'local_fallback';
        }
        break;
      case 'local':
      default:
        data = window.VisitorStorage.getData();
        data.source = 'local';
    }
    
    // 创建并下载JSON文件
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `visitors_data_${this.currentMode}_${timestamp}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    return true;
  }
};

export default StorageManager; 