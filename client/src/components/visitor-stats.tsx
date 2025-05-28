import { useEffect, useState } from "react";
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

// No need for import, the .d.ts file will be automatically included by TypeScript
// import "../types/google-maps";

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
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  // Record visitor location on component mount
  useEffect(() => {
    recordVisitorLocation();
  }, []);

  // Load Google Maps script
  useEffect(() => {
    if (!mapLoaded) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&libraries=visualization`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [mapLoaded]);

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

  // Initialize map once data is loaded and map script is ready
  useEffect(() => {
    if (mapLoaded && stats?.recentVisitors && stats.recentVisitors.length > 0 && !map) {
      const mapElement = document.getElementById("visitor-map");

      if (mapElement) {
        // Create map
        const newMap = new google.maps.Map(mapElement, {
          center: { lat: 30, lng: 0 },
          zoom: 2,
          mapTypeId: "terrain",
          styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
              featureType: "administrative.locality",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#263c3f" }],
            },
            {
              featureType: "poi.park",
              elementType: "labels.text.fill",
              stylers: [{ color: "#6b9a76" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#38414e" }],
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#212a37" }],
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9ca5b3" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#746855" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#1f2835" }],
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [{ color: "#f3d19c" }],
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#2f3948" }],
            },
            {
              featureType: "transit.station",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#515c6d" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#17263c" }],
            },
          ],
        });

        setMap(newMap);
      }
    }
  }, [mapLoaded, stats, map]);

  // Add markers for visitors
  useEffect(() => {
    if (map && stats?.recentVisitors && stats.recentVisitors.length > 0) {
      // Clear old markers
      markers.forEach((marker) => marker.setMap(null));

      // Create new markers
      const newMarkers = stats.recentVisitors.map((visitor: VisitorLocation) => {
        const marker = new google.maps.Marker({
          position: {
            lat: visitor.latitude,
            lng: visitor.longitude,
          },
          map: map,
          title: visitor.city ? `${visitor.city}, ${visitor.country}` : visitor.country,
          animation: google.maps.Animation.DROP,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: "#3b82f6",
            fillOpacity: 0.7,
            strokeWeight: 1,
            strokeColor: "#1d4ed8",
          },
        });

        // Add click event
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="color: #000;">
              <h3>${
                visitor.city ? `${visitor.city}, ${visitor.country}` : visitor.country || "Unknown"
              }</h3>
              <p>Visited: ${new Date(visitor.timestamp).toLocaleString()}</p>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker as unknown as google.maps.MVCObject);
        });

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
          id="visitor-map"
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
                      className={`w-2 h-2 ${
                        COLORS[index % COLORS.length]
                      } rounded-full animate-pulse-slow`}
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
              <div id="visitor-map" className="w-full h-[400px] rounded-lg overflow-hidden"></div>
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
