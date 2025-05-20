// Firebase连接测试脚本
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 测试Firebase连接的函数
async function testFirebaseConnection(config) {
  console.log("开始测试Firebase连接...");
  
  try {
    // 记录配置，但隐藏API密钥
    const safeConfig = {...config};
    if (safeConfig.apiKey) {
      safeConfig.apiKey = safeConfig.apiKey.substring(0, 5) + "...";
    }
    console.log("Firebase配置:", safeConfig);
    
    // 初始化Firebase
    const app = initializeApp(config);
    console.log("Firebase应用初始化成功");
    
    // 获取Firestore实例
    const db = getFirestore(app);
    console.log("Firestore实例创建成功");
    
    // 尝试读取一个简单的测试文档
    // 如果不存在，这会失败，但我们可以捕获特定错误
    try {
      const testDocRef = doc(db, "test", "connection-test");
      const testDoc = await getDoc(testDocRef);
      
      if (testDoc.exists()) {
        console.log("成功读取测试文档:", testDoc.data());
      } else {
        console.log("测试文档不存在，但Firestore连接成功");
      }
    } catch (docError) {
      // 检查错误类型
      if (docError.code === "permission-denied") {
        console.log("Firestore连接成功，但权限被拒绝 - 这通常表示安全规则限制");
      } else {
        throw docError; // 重新抛出非权限错误
      }
    }
    
    // 尝试列出collections
    try {
      const collections = await getDocs(collection(db, "visitors"));
      console.log(`成功连接到visitors集合，找到 ${collections.size} 个文档`);
      return true;
    } catch (colError) {
      if (colError.code === "permission-denied") {
        console.log("Firestore连接成功，但无法列出集合 - 这通常表示安全规则限制");
        return true;
      } else {
        throw colError;
      }
    }
  } catch (error) {
    console.error("Firebase连接测试失败:", error);
    console.error("错误代码:", error.code);
    console.error("错误消息:", error.message);
    
    // 提供特定错误的解决方案
    if (error.code === "unavailable") {
      console.error("解决方案: 检查您的网络连接，确认Firebase服务正常运行");
    } else if (error.code === "invalid-api-key") {
      console.error("解决方案: 检查您的API密钥是否正确，并确认没有被撤销或限制");
    } else if (error.code === "app/duplicate-app") {
      console.error("解决方案: 应用程序已初始化，这可能不是问题");
      return true;
    }
    
    return false;
  }
}

// 导出测试函数
export { testFirebaseConnection }; 