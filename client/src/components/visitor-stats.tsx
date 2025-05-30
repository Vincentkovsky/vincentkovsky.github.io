import React, { useEffect, useState, useRef } from "react";
import { Globe, MapPin, Users, Flag, Building, Activity } from "lucide-react";
import {
  getVisitorStats,
  recordVisitorLocation,
  updateVisitorStats,
  VisitorLocation,
  CountryCount,
  CityCount,
} from "../lib/firebaseService";

// Add Leaflet typings to window object
declare global {
  interface Window {
    L: any;
  }
}

export default function VisitorStats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalVisitors: number;
    topCountries: CountryCount[];
    topCities: CityCount[];
    recentVisitors: VisitorLocation[];
    lastUpdated?: string;
  } | null>(null);
  const [visitorLocation, setVisitorLocation] = useState<{
    city?: string;
    country?: string;
    country_name?: string;
    ip?: string;
    region?: string;
    latitude?: number;
    longitude?: number;
  } | null>(null);
  const [visitorRecorded, setVisitorRecorded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const heatLayerRef = useRef<any>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Predefined colors for top locations
  const locationColors = [
    "bg-primary",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-purple-500",
  ];

  // 记录访问者并更新统计数据
  const recordVisitor = async () => {
    try {
      // 记录当前访问者位置并更新 visitors 集合
      const currentVisitor = await recordVisitorLocation();

      if (currentVisitor) {
        // 设置访问者位置状态
        setVisitorLocation({
          city: currentVisitor.city || undefined,
          country: currentVisitor.country || undefined,
          country_name: currentVisitor.country_name || undefined,
          ip: currentVisitor.ip || undefined,
          region: currentVisitor.region || undefined,
          latitude:
            typeof currentVisitor.latitude === "number" ? currentVisitor.latitude : undefined,
          longitude:
            typeof currentVisitor.longitude === "number" ? currentVisitor.longitude : undefined,
        });

        // 将新访问者添加到地图
        if (currentVisitor.latitude && currentVisitor.longitude && stats) {
          setStats((prev) => {
            if (!prev) return prev;

            // 创建新的访问者列表，加入当前访问者
            const updatedVisitors = [...prev.recentVisitors];
            // 检查是否已经有"current"ID，避免重复添加
            if (!updatedVisitors.some((v) => v.id === "current")) {
              updatedVisitors.unshift({
                id: "current",
                country: currentVisitor.country_name || currentVisitor.country || "Unknown",
                city: currentVisitor.city || "Unknown",
                latitude: Number(currentVisitor.latitude),
                longitude: Number(currentVisitor.longitude),
                timestamp: new Date(),
              });
            }

            return {
              ...prev,
              recentVisitors: updatedVisitors,
            };
          });
        }

        return currentVisitor;
      }
    } catch (error) {
      console.error("Failed to record visitor:", error);
      return null;
    }
  };

  // Load the visitor stats and record current visitor
  useEffect(() => {
    const loadData = async () => {
      try {
        // 先获取统计数据
        try {
          const visitorStats = await getVisitorStats();
          if (visitorStats) {
            setStats(visitorStats);
          } else {
            setError("No visitor data available");
          }
        } catch (statsError) {
          console.error("Error fetching visitor stats:", statsError);
          setError("Could not load visitor statistics");
        }

        // 然后记录当前访问者（仅在首次加载时）
        if (!visitorRecorded) {
          const visitor = await recordVisitor();
          if (visitor) {
            console.log("Successfully recorded visitor");
            setVisitorRecorded(true);
          }
        }
      } catch (error) {
        console.error("Error in visitor stats component:", error);
        setError("Could not initialize visitor statistics");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // 设置定期刷新统计数据的定时器（每5分钟刷新一次）
    const refreshInterval = setInterval(async () => {
      try {
        const refreshedStats = await getVisitorStats();
        if (refreshedStats) {
          setStats(refreshedStats);
        }
      } catch (refreshError) {
        console.warn("Failed to refresh stats:", refreshError);
      }
    }, 5 * 60 * 1000);

    // 清理函数
    return () => {
      clearInterval(refreshInterval);
    };
  }, [visitorRecorded]);

  // Helper to load external scripts
  const loadScript = (url: string, integrity?: string, crossOrigin?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (document.querySelector(`script[src="${url}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = url;
      // Don't use integrity for local development to avoid CORS issues
      // if (integrity) script.integrity = integrity;
      // if (crossOrigin) script.crossOrigin = crossOrigin;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
  };

  // Helper to load external CSS
  const loadCSS = (url: string, integrity?: string, crossOrigin?: string): Promise<void> => {
    return new Promise((resolve) => {
      if (document.querySelector(`link[href="${url}"]`)) {
        resolve(); // Already loaded
        return;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      // Don't use integrity for local development to avoid CORS issues
      // if (integrity) link.integrity = integrity;
      // if (crossOrigin) link.crossOrigin = crossOrigin;
      link.onload = () => resolve();
      document.head.appendChild(link);
    });
  };

  // Initialize the map after component mounts and stats are loaded
  useEffect(() => {
    // Skip if map is already initialized or if we're still loading
    if (
      mapInitialized ||
      loading ||
      !stats ||
      !mapContainerRef.current ||
      typeof window === "undefined"
    ) {
      return;
    }

    // Set a fixed height to ensure the map container is visible
    if (mapContainerRef.current) {
      mapContainerRef.current.style.height = "250px";
      mapContainerRef.current.style.width = "100%";
    }

    // Load Leaflet scripts and initialize map
    const initMap = async () => {
      try {
        console.log("Initializing map...");
        // Load Leaflet CSS
        await loadCSS("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");

        // Load Leaflet JS
        await loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js");

        // Load Leaflet Heat plugin
        await loadScript("https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js");

        // Wait a bit to ensure scripts are fully loaded
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Access the Leaflet global object after scripts are loaded
        const L = window.L;

        if (!L) {
          throw new Error("Leaflet failed to load");
        }

        console.log("Leaflet loaded, initializing map");

        // Clear any previous instances
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Check if the container already has a map instance attached
        if (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_id) {
          console.log("Container already has a map instance, cleaning up...");
          // Force cleanup of any existing leaflet instances on this container
          (mapContainerRef.current as any)._leaflet_id = null;
        }

        // 确保地图容器完全渲染
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Force a reflow on the container
        if (mapContainerRef.current) {
          const height = mapContainerRef.current.offsetHeight;
          const width = mapContainerRef.current.offsetWidth;
          console.log(`Map container dimensions: ${width}x${height}`);

          // 如果容器尺寸为0，等待并重试
          if (height === 0 || width === 0) {
            console.warn("Map container has zero dimensions, delaying initialization...");
            setTimeout(() => {
              setMapInitialized(false); // 触发重新初始化
            }, 500);
            return;
          }
        }

        // Create new map instance
        if (mapContainerRef.current) {
          console.log("Creating map at container:", mapContainerRef.current);

          try {
            // Assign a unique ID to the container element
            mapContainerRef.current.id = `map-container-${Date.now()}`;

            // Make sure any previous initialization attempts are cleaned up
            if (typeof L.map.closePopup === "function") {
              L.map.closePopup();
            }

            // Wrap map creation in a try/catch to handle any initialization errors
            try {
              // 先添加地图但不设置视图
              mapInstanceRef.current = L.map(mapContainerRef.current, {
                zoomControl: false,
                attributionControl: false,
                // Add a unique ID to avoid initialization conflicts
                uniqueId: Date.now().toString(),
              });

              // 添加图层
              L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
                attribution:
                  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                subdomains: "abcd",
                maxZoom: 19,
                className: "map-tiles-dark",
              }).addTo(mapInstanceRef.current);
            } catch (mapCreateError) {
              console.error("Error creating map:", mapCreateError);

              // Try again with a delay
              setTimeout(() => {
                setMapInitialized(false);
              }, 1000);
              return;
            }

            // 等待地图渲染
            await new Promise((resolve) => setTimeout(resolve, 300));

            // 确保地图实例存在并已挂载
            if (!mapInstanceRef.current || !mapInstanceRef.current._container) {
              console.error("Map instance is not properly initialized");
              setTimeout(() => {
                setMapInitialized(false);
              }, 1000);
              return;
            }

            // 强制更新地图大小
            try {
              mapInstanceRef.current.invalidateSize(true);
              // 然后设置视图
              mapInstanceRef.current.setView([20, 0], 2);
            } catch (sizeError) {
              console.error("Error updating map size:", sizeError);
              // Try again with a delay if this fails
              setTimeout(() => {
                setMapInitialized(false);
              }, 1000);
              return;
            }

            // Make sure we have visitor data
            if (stats.recentVisitors && stats.recentVisitors.length > 0) {
              // Add heat layer with visitor locations
              const heatData = stats.recentVisitors
                .filter((visitor) => visitor.latitude && visitor.longitude)
                .map((visitor) => [
                  visitor.latitude,
                  visitor.longitude,
                  0.5, // Intensity
                ]);

              // Create heat layer if we have data
              if (heatData.length > 0 && L.heatLayer && mapInstanceRef.current) {
                try {
                  heatLayerRef.current = L.heatLayer(heatData, {
                    radius: 15,
                    blur: 15,
                    maxZoom: 10,
                    gradient: {
                      0.1: "#4ADE80", // Light green
                      0.3: "#22C55E", // Medium green
                      0.5: "#16A34A", // Deep green
                      0.7: "#15803D", // Deeper green
                      1.0: "#14532D", // Darkest green
                    },
                  }).addTo(mapInstanceRef.current);
                } catch (heatError) {
                  console.error("Error adding heat layer:", heatError);
                }
              }

              // Add markers for top cities with custom styling
              stats.topCities.slice(0, 5).forEach((city, index) => {
                try {
                  // Try to match city with a visitor location
                  const matchingVisitor = stats.recentVisitors.find(
                    (v) => v.city && v.city.includes(city.city.split(",")[0])
                  );

                  // If no match, use a random visitor location or calculate from known locations
                  let markerLocation;
                  if (matchingVisitor) {
                    markerLocation = [matchingVisitor.latitude, matchingVisitor.longitude];
                  } else if (stats.recentVisitors.length > 0) {
                    // Use a random visitor as fallback
                    const randomVisitor =
                      stats.recentVisitors[Math.floor(Math.random() * stats.recentVisitors.length)];
                    markerLocation = [randomVisitor.latitude, randomVisitor.longitude];
                  } else {
                    // Default fallback coordinates
                    markerLocation = [20, index * 30 - 60]; // Space them out along the equator
                  }

                  // Use different colors for top locations
                  const colorClass = locationColors[index % locationColors.length];
                  const colorHex = getColorHexFromClass(colorClass);

                  // Create pulsing marker
                  if (mapInstanceRef.current) {
                    const marker = L.circleMarker(markerLocation, {
                      radius: 5,
                      color: colorHex,
                      fillColor: colorHex,
                      fillOpacity: 0.8,
                      className: "animate-pulse-slow",
                    }).addTo(mapInstanceRef.current);

                    // Add tooltip with custom styling
                    marker.bindTooltip(
                      `<div style="padding: 6px 10px; background-color: rgba(30, 41, 59, 0.95); border: 1px solid ${colorHex}; border-radius: 4px; color: #E2E8F0; font-size: 0.85rem;">
                        <strong>${city.city}</strong><br/>
                        Visitors: ${city.count}
                      </div>`,
                      { className: "custom-tooltip" }
                    );
                  }
                } catch (markerError) {
                  console.error("Error adding city marker:", markerError);
                }
              });

              // 设置一个默认的用户位置（优先使用当前位置，回退到最近访问者）
              let userLat = 0,
                userLng = 0;
              let hasUserLocation = false;

              // 首先尝试使用 visitorLocation
              if (visitorLocation && visitorLocation.latitude && visitorLocation.longitude) {
                userLat = visitorLocation.latitude;
                userLng = visitorLocation.longitude;
                hasUserLocation = true;
              }
              // 否则尝试使用最近的访问者
              else if (
                stats.recentVisitors[0] &&
                stats.recentVisitors[0].latitude &&
                stats.recentVisitors[0].longitude
              ) {
                userLat = stats.recentVisitors[0].latitude;
                userLng = stats.recentVisitors[0].longitude;
                hasUserLocation = true;
              }

              // 如果有用户位置，添加标记
              if (hasUserLocation) {
                try {
                  // 创建样式
                  const style = document.createElement("style");
                  style.textContent = `
                    .your-location-marker {
                      position: relative;
                    }
                    .pulse-ring {
                      position: absolute;
                      width: 30px;
                      height: 30px;
                      border-radius: 50%;
                      background: rgba(255, 71, 87, 0.3);
                      top: 1px;
                      left: 1px;
                      animation: pulse 2s infinite;
                    }
                    @keyframes pulse {
                      0% {
                        transform: scale(1);
                        opacity: 1;
                      }
                      70% {
                        transform: scale(2);
                        opacity: 0;
                      }
                      100% {
                        transform: scale(1);
                        opacity: 0;
                      }
                    }
                    .your-location-tooltip {
                      background-color: #ff4757;
                      color: white;
                      border: none;
                      border-radius: 4px;
                      padding: 5px 10px;
                      font-weight: bold;
                      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    }
                  `;
                  document.head.appendChild(style);

                  // 创建用户位置图标
                  const yourLocationIcon = L.divIcon({
                    html: `<div class="your-location-marker">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff4757" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <div class="pulse-ring"></div>
                    </div>`,
                    className: "custom-div-icon",
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                  });

                  // 确保地图准备就绪后再添加标记
                  setTimeout(() => {
                    if (mapInstanceRef.current) {
                      try {
                        // 添加用户位置标记
                        const visitorMarker = L.marker([userLat, userLng], {
                          icon: yourLocationIcon,
                        }).addTo(mapInstanceRef.current);

                        visitorMarker.bindTooltip("Your Location", {
                          permanent: true,
                          direction: "top",
                          offset: [0, -20],
                          className: "your-location-tooltip",
                        });

                        // 更新地图大小后再设置视图
                        mapInstanceRef.current.invalidateSize(true);
                        // 安全地设置视图
                        mapInstanceRef.current.setView([userLat, userLng], 5, {
                          animate: false,
                        });
                      } catch (markerError) {
                        console.error("Error adding marker or updating map:", markerError);
                      }
                    }
                  }, 300);
                } catch (locationError) {
                  console.error("Error setting up user location:", locationError);
                }
              }
            }

            // 延迟标记地图为已初始化，确保所有操作完成
            setTimeout(() => {
              if (mapInstanceRef.current && mapInstanceRef.current._container) {
                console.log("Map successfully initialized");
                setMapInitialized(true);
              } else {
                console.warn("Map initialization failed or was interrupted");
                setMapInitialized(false);
              }
            }, 500);
          } catch (mapError: any) {
            console.error("Error creating map instance:", mapError);
            setError("Failed to create map: " + mapError.message);
          }
        }
      } catch (error: any) {
        console.error("Error initializing map:", error);
        setError("Could not initialize map: " + error.message);
      }
    };

    // Call the initialization function
    initMap();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        console.log("Cleaning up map instance");
        try {
          // Remove all event listeners
          mapInstanceRef.current.off();
          // Remove all layers
          mapInstanceRef.current.eachLayer((layer: any) => {
            mapInstanceRef.current.removeLayer(layer);
          });
          // Remove the map
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          // Reset initialization flag
          setMapInitialized(false);
        } catch (error) {
          console.error("Error during map cleanup:", error);
        }
      }
    };
  }, [loading, stats, visitorLocation]);

  // Helper to convert Tailwind color classes to hex
  const getColorHexFromClass = (colorClass: string): string => {
    switch (colorClass) {
      case "bg-primary":
        return "#48BB78"; // Green
      case "bg-blue-500":
        return "#3B82F6"; // Blue
      case "bg-yellow-500":
        return "#EAB308"; // Yellow
      case "bg-green-500":
        return "#22C55E"; // Green
      case "bg-purple-500":
        return "#A855F7"; // Purple
      default:
        return "#48BB78"; // Default to primary
    }
  };

  // Calculate percentages for city bars
  const getCityPercentage = (count: number) => {
    if (!stats || stats.totalVisitors === 0) return 0;
    return ((count / stats.totalVisitors) * 100).toFixed(1);
  };

  // Format for display
  const formatCityForDisplay = (city: string) => {
    // 如果城市包含逗号，可能已经包含国家部分
    if (city.includes(",")) {
      const parts = city.split(",").map((part) => part.trim());
      if (parts.length >= 2) {
        return city; // 已经是正确格式，直接返回
      }
    }
    return city; // 如果没有逗号，直接返回
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border card-hover-effect">
      {/* Map Widget */}
      <div className="bg-secondary rounded-lg p-4 mb-6 h-64 flex items-center justify-center relative overflow-hidden hover-glow">
        {/* Show a placeholder image while loading, then switch to the actual map */}
        {loading ? (
          <img
            src="https://images.unsplash.com/photo-1519302959554-a75be0afc82a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
            alt="Interactive world map showing visitor statistics"
            className="w-full h-full object-cover rounded opacity-80 transition-opacity duration-300 hover:opacity-100"
          />
        ) : (
          <div
            ref={mapContainerRef}
            className="w-full h-full rounded-lg overflow-hidden"
            style={{ minHeight: "250px", display: "block" }}
          ></div>
        )}

        {/* Show overlay indicators for the placeholder image if still loading */}
        {loading && (
          <div className="absolute inset-0">
            <div className="absolute top-16 left-20 w-3 h-3 bg-primary rounded-full animate-pulse hover:scale-150 transition-transform duration-300" />
            <div
              className="absolute top-24 left-32 w-3 h-3 bg-blue-500 rounded-full animate-pulse hover:scale-150 transition-transform duration-300"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="absolute top-20 right-24 w-3 h-3 bg-yellow-500 rounded-full animate-pulse hover:scale-150 transition-transform duration-300"
              style={{ animationDelay: "1s" }}
            />
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-background/50 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error message if there's an issue */}
        {error && !loading && (
          <div className="absolute inset-0 bg-background/70 flex flex-col justify-center items-center text-center p-4">
            <div className="text-red-500 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}
      </div>

      {/* 添加总访问量显示 */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h5 className="text-sm font-medium">Total Visits</h5>
            <p className="text-lg font-bold text-gradient">{stats?.totalVisitors || 0}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h5 className="text-sm font-medium">Your IP</h5>
            <p className="text-sm font-mono text-gradient">{visitorLocation?.ip || "Unknown"}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold mb-4 text-gradient">Top Visitor Locations</h4>
        <div className="space-y-3">
          {stats && stats.topCities.length > 0
            ? stats.topCities.slice(0, 3).map((city, index) => (
                <div
                  key={city.city}
                  className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-300 hover-glow animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 ${
                        locationColors[index % locationColors.length]
                      } rounded-full animate-pulse-slow`}
                    />
                    <span className="text-sm font-medium">{formatCityForDisplay(city.city)}</span>
                  </div>
                  <span className="text-gradient font-mono font-bold text-sm">
                    {getCityPercentage(city.count)}%
                  </span>
                </div>
              ))
            : // Default placeholder cities if no data is available
              [
                { location: "Singapore, Singapore", percentage: "0%", color: "bg-primary" },
                { location: "Hyderabad, India", percentage: "0%", color: "bg-blue-500" },
                { location: "Tokyo, Japan", percentage: "0%", color: "bg-yellow-500" },
              ].map((stat, index) => (
                <div
                  key={stat.location}
                  className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-300 hover-glow animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${stat.color} rounded-full animate-pulse-slow`} />
                    <span className="text-sm font-medium">{stat.location}</span>
                  </div>
                  <span className="text-gradient font-mono font-bold text-sm">
                    {stat.percentage}
                  </span>
                </div>
              ))}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-muted-foreground text-sm flex items-center hover:text-primary transition-colors duration-300">
          <MapPin className="mr-2 text-primary w-4 h-4 animate-pulse-slow" />
          Based in:{" "}
          <span className="text-gradient ml-1 font-semibold">
            {visitorLocation?.city && visitorLocation?.country_name
              ? `${visitorLocation.city}, ${visitorLocation.country_name}`
              : visitorLocation?.city && visitorLocation?.country
              ? `${visitorLocation.city}, ${visitorLocation.country}`
              : "Unknown Location"}
          </span>
        </p>
        {stats?.lastUpdated && (
          <p className="text-xs text-muted-foreground mt-2 opacity-60">
            Last updated: {new Date(stats.lastUpdated).toLocaleString()}
          </p>
        )}
        {error && <p className="text-xs text-muted-foreground mt-2 opacity-60">{error}</p>}
        {!mapInitialized && !loading && (
          <p className="text-xs text-muted-foreground mt-2 opacity-60">
            Map visualization temporarily unavailable. Try refreshing the page.
          </p>
        )}
      </div>
    </div>
  );
}
