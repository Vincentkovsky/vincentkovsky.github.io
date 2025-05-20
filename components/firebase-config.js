// Firebase访客数据存储模块
// 注意：您需要在Firebase控制台中创建一个项目，并在这里替换配置信息

/*
Firebase配置说明：
1. 在Firebase控制台(https://console.firebase.google.com/)创建一个新项目
2. 在项目设置中添加一个Web应用
3. 复制生成的Firebase配置对象，替换下面的配置
4. 在Firebase控制台中，转到Firestore数据库并创建一个新的数据库（可以从测试模式开始）
5. 在Firebase控制台启用匿名认证: Authentication > Sign-in method > Anonymous > Enable
6. 设置Firebase安全规则，仅允许认证用户访问
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  where, 
  query, 
  updateDoc, 
  doc, 
  orderBy, 
  limit,
  getDoc,
  setDoc,
  deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase配置 - 请替换为您的Firebase项目配置
const firebaseConfig = {
  apiKey: "AIzaSyDQ1AaF0akvP-Q_Lu1xM_Eh0WWiiYVbJXw",
  authDomain: "vincentkovsky.firebaseapp.com",
  projectId: "vincentkovsky",
  storageBucket: "vincentkovsky.appspot.com",
  messagingSenderId: "773913920947",
  appId: "1:773913920947:web:d4f51c8c4b81c6fe4577c6"
};

// 初始化Firebase
let app;
let db;
let auth;
let currentUser = null;
let visitorsCollection;
let statsDoc;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  visitorsCollection = collection(db, "visitors");
  statsDoc = doc(db, "statistics", "visitorStats");
  console.log("Firebase initialized successfully");
  
  // 尝试匿名登录
  signInAnonymously(auth)
    .then(() => {
      console.log("Anonymous authentication successful");
    })
    .catch((error) => {
      console.error("Anonymous authentication error:", error);
    });
  
  // 监听认证状态变化
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // 用户已登录
      currentUser = user;
      console.log("User authenticated with ID:", user.uid);
    } else {
      // 用户已登出
      currentUser = null;
      console.log("User signed out");
    }
  });
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// 访客数据Firebase存储管理
const FirebaseVisitorStorage = {
  /**
   * 检查Firebase是否正确配置和初始化
   */
  isConfigured() {
    // 检查是否有效的Firebase配置
    const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY";
    // 检查Firebase是否成功初始化
    const isInitialized = app && db;
    return hasValidConfig && isInitialized;
  },
  
  /**
   * 检查用户是否已通过认证
   */
  isAuthenticated() {
    return !!currentUser;
  },
  
  /**
   * 等待身份验证完成
   */
  async waitForAuthentication(maxWaitTime = 5000) {
    // 如果已认证，直接返回
    if (this.isAuthenticated()) {
      return true;
    }
    
    // 否则等待认证完成
    return new Promise((resolve) => {
      const authCheckInterval = 100; // 毫秒
      let elapsedTime = 0;
      
      const checkAuth = setInterval(() => {
        elapsedTime += authCheckInterval;
        
        if (this.isAuthenticated()) {
          clearInterval(checkAuth);
          resolve(true);
        } else if (elapsedTime >= maxWaitTime) {
          clearInterval(checkAuth);
          console.warn("Authentication timed out");
          resolve(false);
        }
      }, authCheckInterval);
    });
  },
  
  /**
   * 初始化统计数据
   */
  async initStats() {
    try {
      if (!this.isConfigured()) {
        throw new Error("Firebase not properly configured");
      }
      
      // 等待认证完成
      await this.waitForAuthentication();
      
      const statsSnapshot = await getDoc(statsDoc);
      
      if (!statsSnapshot.exists()) {
        await setDoc(statsDoc, {
          totalVisitors: 0,
          countries: {},
          cities: {},
          lastUpdated: new Date().toISOString()
        });
        console.log("Initialized visitor statistics");
      }
      
      return await this.getStats();
    } catch (error) {
      console.error("Error initializing stats:", error);
      return {
        totalVisitors: 0,
        uniqueCountries: 0,
        uniqueCities: 0,
        topCities: [],
        error: error.message
      };
    }
  },
  
  /**
   * 添加新访客
   * @param {Object} visitorData - 访客信息
   * @returns {Promise<Object>} - 返回保存的访客数据
   */
  async addVisitor(visitorData) {
    try {
      if (!this.isConfigured()) {
        throw new Error("Firebase not properly configured");
      }
      
      // 等待认证完成
      await this.waitForAuthentication();
      
      // 添加浏览器和引荐来源
      const enrichedData = {
        ...visitorData,
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        screenSize: `${window.screen.width}x${window.screen.height}`,
        userId: currentUser ? currentUser.uid : null
      };
      
      // 检查是否已存在相同IP的访客
      const existingVisitorQuery = query(visitorsCollection, where("ip", "==", visitorData.ip));
      const existingVisitorSnapshot = await getDocs(existingVisitorQuery);
      
      let visitorRef;
      let visitor;
      
      if (!existingVisitorSnapshot.empty) {
        // 更新现有访客
        visitorRef = doc(db, "visitors", existingVisitorSnapshot.docs[0].id);
        const existingData = existingVisitorSnapshot.docs[0].data();
        
        await updateDoc(visitorRef, {
          lastVisit: new Date().toISOString(),
          visitCount: (existingData.visitCount || 1) + 1
        });
        
        // 获取更新后的文档
        const updatedSnapshot = await getDoc(visitorRef);
        visitor = { id: updatedSnapshot.id, ...updatedSnapshot.data() };
        console.log("Updated existing visitor:", visitor.id);
      } else {
        // 添加新访客
        const newVisitor = {
          ...enrichedData,
          timestamp: new Date().toISOString(),
          visitCount: 1
        };
        
        const docRef = await addDoc(visitorsCollection, newVisitor);
        visitor = { id: docRef.id, ...newVisitor };
        console.log("Added new visitor:", visitor.id);
        
        // 更新统计信息
        const statsSnapshot = await getDoc(statsDoc);
        
        if (statsSnapshot.exists()) {
          const stats = statsSnapshot.data();
          const countryName = enrichedData.country_name || "Unknown";
          const cityName = enrichedData.city || "Unknown";
          const cityKey = `${cityName}, ${countryName}`;
          
          // 更新国家统计
          const countries = stats.countries || {};
          countries[countryName] = (countries[countryName] || 0) + 1;
          
          // 更新城市统计
          const cities = stats.cities || {};
          cities[cityKey] = (cities[cityKey] || 0) + 1;
          
          await updateDoc(statsDoc, {
            totalVisitors: stats.totalVisitors + 1,
            countries,
            cities,
            lastUpdated: new Date().toISOString()
          });
          console.log("Updated visitor statistics");
        } else {
          // 创建新的统计文档
          await this.initStats();
        }
      }
      
      return visitor;
    } catch (error) {
      console.error("Error adding visitor:", error);
      return { error: error.message };
    }
  },
  
  /**
   * 获取访客统计数据
   * @returns {Promise<Object>} - 返回访客统计信息
   */
  async getStats() {
    try {
      if (!this.isConfigured()) {
        throw new Error("Firebase not properly configured");
      }
      
      const statsSnapshot = await getDoc(statsDoc);
      
      if (!statsSnapshot.exists()) {
        return await this.initStats();
      }
      
      const stats = statsSnapshot.data();
      
      // 获取顶部城市
      const cities = stats.cities || {};
      const cityEntries = Object.entries(cities);
      const sortedCities = cityEntries.sort((a, b) => b[1] - a[1]);
      
      const topCities = sortedCities.slice(0, 3).map(([name, count]) => ({
        name,
        count,
        percentage: stats.totalVisitors ? Math.round((count / stats.totalVisitors) * 100) : 0
      }));
      
      return {
        totalVisitors: stats.totalVisitors || 0,
        uniqueCountries: Object.keys(stats.countries || {}).length,
        uniqueCities: Object.keys(stats.cities || {}).length,
        topCities
      };
    } catch (error) {
      console.error("Error getting stats:", error);
      return {
        totalVisitors: 0,
        uniqueCountries: 0,
        uniqueCities: 0,
        topCities: [],
        error: error.message
      };
    }
  },
  
  /**
   * 获取热图数据
   * @returns {Promise<Array>} - 返回热图数据点
   */
  async getHeatmapData() {
    try {
      if (!this.isConfigured()) {
        throw new Error("Firebase not properly configured");
      }
      
      const visitorsSnapshot = await getDocs(visitorsCollection);
      
      if (visitorsSnapshot.empty) {
        // 返回一些默认数据，以便在没有访客时显示热图
        return [
          [37.7749, -122.4194, 0.8],  // San Francisco
          [40.7128, -74.0060, 0.6],   // New York
          [51.5074, -0.1278, 0.7],    // London
          [48.8566, 2.3522, 0.5],     // Paris
          [35.6762, 139.6503, 0.6]    // Tokyo
        ];
      }
      
      return visitorsSnapshot.docs
        .map(doc => {
          const data = doc.data();
          if (data.latitude && data.longitude) {
            return [
              parseFloat(data.latitude),
              parseFloat(data.longitude),
              Math.min(0.5 + (data.visitCount || 1) * 0.1, 1)  // 强度根据访问次数增加
            ];
          }
          return null;
        })
        .filter(point => point !== null);
    } catch (error) {
      console.error("Error getting heatmap data:", error);
      // 出错时返回一些默认数据，以便热图能够显示
      return [
        [37.7749, -122.4194, 0.8],
        [40.7128, -74.0060, 0.6]
      ];
    }
  },
  
  /**
   * 获取所有访客
   * @returns {Promise<Array>} - 返回访客列表
   */
  async getAllVisitors() {
    try {
      if (!this.isConfigured()) {
        throw new Error("Firebase not properly configured");
      }
      
      const visitorsQuery = query(
        visitorsCollection, 
        orderBy("timestamp", "desc")
      );
      
      const visitorsSnapshot = await getDocs(visitorsQuery);
      
      return visitorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting all visitors:", error);
      return [];
    }
  },
  
  /**
   * 清除所有访客数据
   * @returns {Promise<boolean>} - 返回操作成功状态
   */
  async clearData() {
    try {
      if (!this.isConfigured()) {
        throw new Error("Firebase not properly configured");
      }
      
      // 获取所有访客文档
      const visitorsSnapshot = await getDocs(visitorsCollection);
      
      // 删除每个访客文档
      const deletePromises = visitorsSnapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      
      await Promise.all(deletePromises);
      console.log("Deleted all visitor documents");
      
      // 重置统计信息
      await setDoc(statsDoc, {
        totalVisitors: 0,
        countries: {},
        cities: {},
        lastUpdated: new Date().toISOString()
      });
      console.log("Reset visitor statistics");
      
      return true;
    } catch (error) {
      console.error("Error clearing data:", error);
      return false;
    }
  },
  
  /**
   * 导出访客数据为JSON
   */
  async exportData() {
    try {
      if (!this.isConfigured()) {
        throw new Error("Firebase not properly configured");
      }
      
      const visitors = await this.getAllVisitors();
      const stats = await this.getStats();
      
      const data = {
        source: 'firebase',
        exportDate: new Date().toISOString(),
        stats,
        visitors
      };
      
      // 创建并下载JSON文件
      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `visitors_data_firebase_${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      return true;
    } catch (error) {
      console.error("Error exporting data:", error);
      return false;
    }
  }
};

// 确保FirebaseVisitorStorage对象可以在全局访问
window.FirebaseVisitorStorage = FirebaseVisitorStorage;

// 导出模块 - 支持导入时使用
export default FirebaseVisitorStorage; 