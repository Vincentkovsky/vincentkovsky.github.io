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
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  browser?: string;
  os?: string;
  device?: string;
  timestamp: Date | Timestamp | FieldValue;
  referrer?: string;
  path?: string;
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

/**
 * Records a visitor's geographic data in Firestore
 */
export const recordVisitorLocation = async () => {
  try {
    // Get visitor's IP and geolocation data
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    // Get browser and OS info
    const userAgent = navigator.userAgent;
    const browser = detectBrowser(userAgent);
    const os = detectOS(userAgent);
    const device = detectDevice(userAgent);

    // Create visitor record
    const visitorData: Omit<VisitorData, "id"> = {
      ip: data.ip,
      country: data.country_name,
      region: data.region,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      browser,
      os,
      device,
      timestamp: serverTimestamp(),
      referrer: document.referrer || undefined,
      path: window.location.pathname,
    };

    // Check if this IP has visited in the last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const visitorQuery = query(
      collection(db, "visitors"),
      where("ip", "==", data.ip),
      where("timestamp", ">=", oneDayAgo),
      limit(1)
    );

    const visitorSnapshot = await getCountFromServer(visitorQuery);

    // Only add new record if this IP hasn't visited in 24 hours
    if (visitorSnapshot.data().count === 0) {
      await addDoc(collection(db, "visitors"), visitorData);
    }

    return visitorData;
  } catch (error) {
    console.error("Error recording visitor location:", error);
    // Fail silently - don't block the user experience
    return null;
  }
};

/**
 * Get visitor statistics from Firestore
 */
export const getVisitorStats = async () => {
  try {
    // Total unique visitors (IPs)
    const uniqueIpsSnapshot = await getCountFromServer(collection(db, "visitors"));
    const totalVisitors = uniqueIpsSnapshot.data().count;

    // Visitors by country
    const visitorsSnapshot = await getDocs(collection(db, "visitors"));
    const visitorsByCountry: Record<string, number> = {};
    const visitorsByCity: Record<string, number> = {};

    visitorsSnapshot.forEach((doc) => {
      const data = doc.data();

      // Count by country
      if (data.country) {
        visitorsByCountry[data.country] = (visitorsByCountry[data.country] || 0) + 1;
      }

      // Count by city
      if (data.city && data.country) {
        const location = `${data.city}, ${data.country}`;
        visitorsByCity[location] = (visitorsByCity[location] || 0) + 1;
      }
    });

    // Get top countries
    const topCountries: CountryCount[] = Object.entries(visitorsByCountry)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get top cities
    const topCities: CityCount[] = Object.entries(visitorsByCity)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recent visitors with location data for map
    const recentVisitorsQuery = query(
      collection(db, "visitors"),
      orderBy("timestamp", "desc"),
      limit(100)
    );

    const recentVisitorsSnapshot = await getDocs(recentVisitorsQuery);
    const recentVisitors: VisitorLocation[] = [];

    recentVisitorsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.latitude && data.longitude) {
        recentVisitors.push({
          id: doc.id,
          country: data.country,
          city: data.city,
          latitude: data.latitude,
          longitude: data.longitude,
          timestamp: data.timestamp?.toDate() || new Date(),
        });
      }
    });

    return {
      totalVisitors,
      topCountries,
      topCities,
      recentVisitors,
    };
  } catch (error) {
    console.error("Error getting visitor stats:", error);
    throw new Error("Failed to retrieve visitor statistics");
  }
};

export const createContactSubmission = async (
  data: Omit<ContactSubmission, "id" | "createdAt">
) => {
  try {
    const docRef = await addDoc(collection(db, "contactSubmissions"), {
      ...data,
      createdAt: Timestamp.now(),
    });

    return {
      id: docRef.id,
      ...data,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error adding contact submission: ", error);
    throw new Error("Failed to submit contact form");
  }
};

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
