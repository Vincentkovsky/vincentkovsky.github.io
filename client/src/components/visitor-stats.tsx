import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getVisitorStats,
  recordVisitorLocation,
  VisitorLocation,
  CountryCount,
  CityCount,
} from "@/lib/firebaseService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Globe, Users, MapPin, Activity } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Map chart colors
const COLORS = [
  "#3b82f6", // blue-500
  "#2563eb", // blue-600
  "#1d4ed8", // blue-700
  "#1e40af", // blue-800
  "#0ea5e9", // sky-500
  "#0284c7", // sky-600
  "#0369a1", // sky-700
  "#075985", // sky-800
  "#06b6d4", // cyan-500
  "#8b5cf6", // violet-500
];

// Custom Type for the stats data
interface VisitorStats {
  totalVisitors: number;
  topCountries: CountryCount[];
  topCities: CityCount[];
  recentVisitors: VisitorLocation[];
}

interface VisitorStatsProps {
  isEmbedded?: boolean;
}

export default function VisitorStats({ isEmbedded = false }: VisitorStatsProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [markers, setMarkers] = useState<L.Marker[]>([]);

  // Record visitor location on component mount
  useEffect(() => {
    recordVisitorLocation();
  }, []);

  // Fix Leaflet default icon issue
  useEffect(() => {
    // Fix for Leaflet's default icon
    // @ts-ignore: Unreachable code error - this is a known issue with Leaflet types
    delete L.Icon.Default.prototype._getIconUrl;

    // @ts-ignore: Unreachable code error
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  // Fetch visitor statistics
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery<VisitorStats>({
    queryKey: ["visitorStats"],
    queryFn: getVisitorStats,
    refetchInterval: 60000, // Refetch every minute
  });

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || map) return;

    // Initialize the map with a dark theme
    const leafletMap = L.map(mapContainerRef.current).setView([30, 0], 2);

    // Add OpenStreetMap tile layer with dark theme
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(leafletMap);

    setMap(leafletMap);

    // Clean up on unmount
    return () => {
      leafletMap.remove();
    };
  }, [mapContainerRef, map]);

  // Add markers for visitors
  useEffect(() => {
    if (map && stats?.recentVisitors && stats.recentVisitors.length > 0) {
      // Clear old markers
      markers.forEach((marker) => marker.remove());

      // Create marker cluster group for better performance with many markers
      const newMarkers = stats.recentVisitors.map((visitor: VisitorLocation) => {
        // Create custom icon with blue color
        const visitorIcon = L.divIcon({
          className: "custom-marker",
          html: `<div style="background-color: #3b82f6; width: 10px; height: 10px; border-radius: 50%; border: 2px solid #1d4ed8;"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        // Create marker
        const marker = L.marker([visitor.latitude, visitor.longitude], {
          icon: visitorIcon,
          title: visitor.city ? `${visitor.city}, ${visitor.country}` : visitor.country,
        }).addTo(map);

        // Add popup
        marker.bindPopup(`
          <div>
            <h3>${
              visitor.city ? `${visitor.city}, ${visitor.country}` : visitor.country || "Unknown"
            }</h3>
            <p>Visited: ${new Date(visitor.timestamp).toLocaleString()}</p>
          </div>
        `);

        return marker;
      });

      setMarkers(newMarkers);
    }
  }, [map, stats]);

  // If component is embedded in another section, use a more compact view
  if (isEmbedded) {
    if (isLoading) {
      return <div className="p-4 text-center">Loading visitor data...</div>;
    }

    if (error) {
      return <div className="p-4 text-center text-destructive">Error loading visitor data</div>;
    }

    return (
      <div className="space-y-4">
        {/* Compact Map */}
        <div
          ref={mapContainerRef}
          className="w-full h-[250px] rounded-lg overflow-hidden bg-secondary"
        ></div>

        {/* Compact Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Total Visitors</h4>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">{stats?.totalVisitors || 0}</p>
          </div>

          <div className="bg-secondary/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Top Country</h4>
              <Globe className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xl font-bold">{stats?.topCountries?.[0]?.country || "None"}</p>
          </div>
        </div>

        {/* Top Countries List */}
        {stats?.topCountries && stats.topCountries.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Top Visitor Locations</h4>
            <div className="space-y-2">
              {stats.topCountries.slice(0, 3).map((country, index) => (
                <div
                  key={country.country}
                  className="flex justify-between items-center p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-300"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 bg-[${
                        COLORS[index % COLORS.length]
                      }] rounded-full animate-pulse-slow`}
                    />
                    <span className="text-xs font-medium">{country.country}</span>
                  </div>
                  <span className="text-primary font-mono font-bold text-xs">
                    {country.count} visits
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full standalone component
  if (isLoading) {
    return (
      <section id="visitor-stats" className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <Globe className="inline mr-3 text-primary" />
              Visitor Statistics
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Loading visitor data...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="visitor-stats" className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <Globe className="inline mr-3 text-primary" />
              Visitor Statistics
            </h2>
            <p className="text-destructive text-lg max-w-2xl mx-auto">
              Error loading visitor data.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="visitor-stats" className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <Globe className="inline mr-3 text-primary" />
            Visitor Geography
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See where visitors to this site are coming from around the world.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Visitors */}
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-medium">Total Visitors</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalVisitors || 0}</div>
              <p className="text-xs text-muted-foreground">Unique visitors</p>
            </CardContent>
          </Card>

          {/* Top Country */}
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-medium">Top Country</CardTitle>
              <Globe className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.topCountries?.[0]?.country || "None"}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.topCountries?.[0]?.count || 0} visitors
              </p>
            </CardContent>
          </Card>

          {/* Top City */}
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-medium">Top City</CardTitle>
              <MapPin className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.topCities?.[0]?.city || "None"}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.topCities?.[0]?.count || 0} visitors
              </p>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-medium">Recent Activity</CardTitle>
              <Activity className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.recentVisitors?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Locations tracked</p>
            </CardContent>
          </Card>
        </div>

        {/* Map and Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* World Map */}
          <Card className="col-span-2 md:col-span-1 lg:col-span-2 bg-card">
            <CardHeader>
              <CardTitle>Visitor Locations</CardTitle>
              <CardDescription>Geographic distribution of site visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                ref={mapContainerRef}
                className="w-full h-[400px] rounded-lg overflow-hidden"
              ></div>
            </CardContent>
          </Card>

          {/* Top Countries Chart */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Top Countries</CardTitle>
              <CardDescription>Visitors by country of origin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {stats?.topCountries && stats.topCountries.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.topCountries.slice(0, 5)}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 80,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="country" tickLine={false} axisLine={false} />
                      <Tooltip formatter={(value) => [`${value} visitors`, "Count"]} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Cities Chart */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Top Cities</CardTitle>
              <CardDescription>Visitors by city location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {stats?.topCities && stats.topCities.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.topCities.slice(0, 5)}
                        dataKey="count"
                        nameKey="city"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#3b82f6"
                        label={({ city, count }) => `${city}: ${count}`}
                        labelLine={false}
                      >
                        {stats.topCities.slice(0, 5).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} visitors`, "Count"]} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
