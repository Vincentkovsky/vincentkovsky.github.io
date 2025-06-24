import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  where,
  limit,
  getCountFromServer,
  serverTimestamp,
  FieldValue,
  updateDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date | Timestamp;
}

export interface VisitorData {
  id?: string;
  asn?: string | null;
  city?: string | null;
  continent_code?: string | null;
  country?: string | null;
  country_area?: number | null;
  country_calling_code?: string | null;
  country_capital?: string | null;
  country_code?: string | null;
  country_code_iso3?: string | null;
  country_name?: string | null;
  country_population?: number | null;
  country_tld?: string | null;
  currency?: string | null;
  currency_name?: string | null;
  in_eu?: boolean | null;
  ip?: string | null;
  languages?: string | null;
  lastVisit?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  network?: string | null;
  org?: string | null;
  postal?: string | null;
  referrer?: string | null;
  region?: string | null;
  region_code?: string | null;
  screenSize?: string | null;
  timestamp: string | Date | Timestamp | FieldValue;
  timezone?: string | null;
  userAgent?: string | null;
  utc_offset?: string | null;
  version?: string | null;
  visitCount?: number | null;
}

export interface CountryCount {
  country: string;
  count: number;
}

export interface CityCount {
  city: string;
  count: number;
}

export interface VisitorLocation {
  id: string;
  country?: string;
  city?: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
}

// 联系表单数据类型
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Records a visitor's geographic data in Firestore
 */
export const recordVisitorLocation = async () => {
  try {
    // Get visitor's IP and geolocation data
    let geoData = {
      ip: "0.0.0.0",
      country: "Unknown",
      country_name: "Unknown",
      city: "Unknown",
      region: null,
      region_code: null,
      loc: "0,0",
      timezone: null,
      org: null,
      postal: null,
    };

    try {
      // Try with ipinfo API
      const response = await fetch("https://ipinfo.io/json", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Successfully fetched location from ipinfo");

        // 合并数据，确保所有必要字段存在
        geoData = {
          ...geoData,
          ...data,
          // ipinfo.io 没有提供 country_name，使用 country 代替
          country_name: data.country || "Unknown",
        };
      } else {
        throw new Error(`Geolocation API failed with status: ${response.status}`);
      }
    } catch (geoError) {
      console.warn("Error fetching geolocation data, trying alternative API", geoError);

      try {
        // Try another free API as backup
        const response = await fetch(
          "https://api.ipgeolocation.io/ipgeo?apiKey=API_KEY", // 您需要替换为自己的API密钥
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // 合并数据，确保所有必要字段存在
          geoData = {
            ...geoData,
            ...data,
          };
          console.log("Successfully fetched location from ipgeolocation");
        } else {
          throw new Error("Alternative API also failed");
        }
      } catch (altError) {
        console.warn("All geolocation APIs failed, using minimal data", altError);
      }
    }

    // 打印 geoData 进行调试
    console.log("Geolocation data:", geoData);

    // Create visitor record
    const screenSize = `${window.innerWidth}x${window.innerHeight}`;

    // 构建访问者数据
    const visitorData: Omit<VisitorData, "id"> = {
      ip: geoData.ip,
      city: geoData.city,
      country: geoData.country,
      country_name: geoData.country_name,
      region: geoData.region || null,
      region_code: geoData.region_code || null,
      // ipinfo 使用 "loc": "latitude,longitude" 格式
      latitude: geoData.loc ? parseFloat(geoData.loc.split(",")[0]) || 0 : 0,
      longitude: geoData.loc ? parseFloat(geoData.loc.split(",")[1]) || 0 : 0,
      timezone: geoData.timezone || null,
      org: geoData.org || null,
      postal: geoData.postal || null,
      userAgent: navigator.userAgent,
      referrer: document.referrer || "",
      screenSize: screenSize,
      timestamp: new Date().toISOString(),
      visitCount: 1,
      lastVisit: new Date().toISOString(),
    };

    let isNewVisitor = false;
    let existingDocId = null;

    // Check if this IP has visited before
    try {
      const visitorQuery = query(
        collection(db, "visitors"),
        where("ip", "==", geoData.ip),
        limit(1)
      );

      const visitorSnapshot = await getDocs(visitorQuery);

      if (visitorSnapshot.empty) {
        // New visitor
        isNewVisitor = true;
        const docRef = await addDoc(collection(db, "visitors"), visitorData);
        existingDocId = docRef.id;
      } else {
        // Existing visitor - update visit count and last visit time
        const visitorDoc = visitorSnapshot.docs[0];
        existingDocId = visitorDoc.id;
        const currentData = visitorDoc.data();
        const newVisitCount = (currentData.visitCount || 0) + 1;

        await updateDoc(visitorDoc.ref, {
          visitCount: newVisitCount,
          lastVisit: new Date().toISOString(),
        });
      }

      // If this is a new visitor, update the statistics collection
      if (isNewVisitor) {
        await updateVisitorStats(visitorData);
      }

      // Add the document ID to the visitor data before returning
      return {
        ...visitorData,
        id: existingDocId,
      };
    } catch (dbError) {
      console.warn("Firestore error when recording visitor", dbError);
      // Try adding visitor without checking for duplicates
      try {
        const docRef = await addDoc(collection(db, "visitors"), visitorData);
        // Still try to update statistics
        await updateVisitorStats(visitorData);
        return {
          ...visitorData,
          id: docRef.id,
        };
      } catch (addError) {
        console.error("Failed to add visitor to Firestore", addError);
        return visitorData; // Return data without ID
      }
    }
  } catch (error) {
    console.error("Error recording visitor location:", error);
    // Return minimal data to avoid UI errors
    return {
      ip: "0.0.0.0",
      country: "Unknown",
      country_name: "Unknown",
      city: "Unknown",
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Update visitor statistics in the statistics collection
 */
export async function updateVisitorStats(visitorData: Omit<VisitorData, "id">) {
  try {
    // Get the stats document
    const statsRef = doc(db, "statistics", "visitorStats");
    const statsDoc = await getDoc(statsRef);

    // 确保我们有有效的城市和国家名称
    const cityName = visitorData.city || "Unknown";
    const countryName = visitorData.country_name || visitorData.country || "Unknown";
    const cityKey = `${cityName}, ${countryName}`;

    if (statsDoc.exists()) {
      // Update existing stats
      const currentStats = statsDoc.data();

      // Get current values or default to 0
      const cities = currentStats.cities || {};
      const cityCount = cities[cityKey] || 0;

      const countries = currentStats.countries || {};
      const countryCount = countries[countryName] || 0;

      // Update the stats document with new counts
      const updates: Record<string, any> = {
        lastUpdated: new Date().toISOString(),
      };

      updates[`cities.${cityKey}`] = cityCount + 1;
      updates[`countries.${countryName}`] = countryCount + 1;
      updates.totalVisitors = (currentStats.totalVisitors || 0) + 1;

      await updateDoc(statsRef, updates);
    } else {
      // Create new stats document with properly structured data
      await setDoc(statsRef, {
        cities: {
          [cityKey]: 1,
        },
        countries: {
          [countryName]: 1,
        },
        totalVisitors: 1,
        lastUpdated: new Date().toISOString(),
      });
    }

    return true;
  } catch (error) {
    console.error("Error updating visitor statistics:", error);
    return false;
  }
}

/**
 * Gets visitor statistics for the dashboard
 */
export const getVisitorStats = async () => {
  try {
    // 首先从 statistics 集合获取统计数据
    const statsRef = doc(db, "statistics", "visitorStats");
    const statsDoc = await getDoc(statsRef);

    let totalVisitors = 0;
    let topCountries: CountryCount[] = [];
    let topCities: CityCount[] = [];
    let lastUpdated: string | undefined;

    if (statsDoc.exists()) {
      const statsData = statsDoc.data();
      totalVisitors = statsData.totalVisitors || 0;
      lastUpdated = statsData.lastUpdated;

      // 处理国家数据
      if (statsData.countries) {
        topCountries = Object.entries(statsData.countries)
          .map(([country, count]) => ({
            country,
            count: count as number,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
      }

      // 处理城市数据
      if (statsData.cities) {
        topCities = Object.entries(statsData.cities)
          .map(([city, count]) => ({
            city,
            count: count as number,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
      }
    }

    // 获取最近的访问者记录
    const visitorsQuery = query(
      collection(db, "visitors"),
      orderBy("timestamp", "desc"),
      limit(20)
    );

    const visitorsSnapshot = await getDocs(visitorsQuery);
    const recentVisitors: VisitorLocation[] = [];

    visitorsSnapshot.forEach((doc) => {
      const data = doc.data();
      recentVisitors.push({
        id: doc.id,
        city: data.city,
        country: data.country_name || data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: new Date(data.timestamp),
      });
    });

    return {
      totalVisitors,
      topCountries,
      topCities,
      recentVisitors,
      lastUpdated,
    };
  } catch (error) {
    console.error("Error getting visitor stats:", error);
    throw error;
  }
};

/**
 * 创建联系表单提交
 * @param data 联系表单数据
 * @returns Promise 包含提交结果
 */
export async function createContactSubmission(data: ContactFormData) {
  try {
    console.log("开始提交联系表单数据...", data);

    // 添加时间戳和状态信息
    const submissionData = {
      ...data,
      createdAt: Timestamp.now(),
      status: "unread", // 可用于后续管理 (已读/未读/已回复)
    };

    console.log("准备提交数据到 Firestore:", submissionData);

    // 添加到 Firestore 的 contactMessages 集合
    const docRef = await addDoc(collection(db, "contactMessages"), submissionData);
    console.log("消息提交成功，ID:", docRef.id);

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("提交消息时出错:", error);

    // 添加更详细的错误信息
    if (error instanceof Error) {
      console.error("错误类型:", error.name);
      console.error("错误消息:", error.message);
      console.error("错误堆栈:", error.stack);
    }

    throw new Error(`提交消息失败: ${error instanceof Error ? error.message : "未知错误"}`);
  }
}

export const getContactSubmissions = async () => {
  try {
    const q = query(collection(db, "contactSubmissions"), orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    const submissions: ContactSubmission[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      submissions.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        message: data.message,
        createdAt: data.createdAt.toDate(),
      });
    });

    return submissions;
  } catch (error) {
    console.error("Error getting contact submissions: ", error);
    throw new Error("Failed to retrieve contact submissions");
  }
};

// Helper functions to detect browser, OS, and device
function detectBrowser(userAgent: string): string {
  if (userAgent.indexOf("Firefox") > -1) return "Firefox";
  else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) return "Opera";
  else if (userAgent.indexOf("Trident") > -1) return "Internet Explorer";
  else if (userAgent.indexOf("Edge") > -1) return "Edge";
  else if (userAgent.indexOf("Chrome") > -1) return "Chrome";
  else if (userAgent.indexOf("Safari") > -1) return "Safari";
  else return "Unknown";
}

function detectOS(userAgent: string): string {
  if (userAgent.indexOf("Windows") > -1) return "Windows";
  else if (userAgent.indexOf("Mac") > -1) return "macOS";
  else if (userAgent.indexOf("Linux") > -1) return "Linux";
  else if (userAgent.indexOf("Android") > -1) return "Android";
  else if (
    userAgent.indexOf("iOS") > -1 ||
    userAgent.indexOf("iPhone") > -1 ||
    userAgent.indexOf("iPad") > -1
  )
    return "iOS";
  else return "Unknown";
}

function detectDevice(userAgent: string): string {
  if (userAgent.indexOf("Mobile") > -1) return "Mobile";
  else if (userAgent.indexOf("Tablet") > -1) return "Tablet";
  else return "Desktop";
}

/**
 * 获取所有联系表单消息
 * 注意：此函数应该只在管理页面使用，需要适当的身份验证
 * @returns 联系表单消息列表
 */
export async function getContactMessages() {
  try {
    const messagesRef = collection(db, "contactMessages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching contact messages: ", error);
    throw new Error("Failed to fetch contact messages");
  }
}

/**
 * 更新联系表单消息状态
 * @param messageId 消息ID
 * @param status 新状态 (read, replied, archived)
 */
export async function updateMessageStatus(messageId: string, status: string) {
  try {
    const messageRef = doc(db, "contactMessages", messageId);
    await updateDoc(messageRef, { status });
    return { success: true };
  } catch (error) {
    console.error("Error updating message status: ", error);
    throw new Error("Failed to update message status");
  }
}
