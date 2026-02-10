import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import {
  ArrowLeft,
  Navigation2,
  Search,
  MapPin,
  ArrowRight,
  ArrowUp,
  CornerDownRight,
  Clock,
  Gauge,
  Loader2,
  X,
} from "lucide-react";

// Component to update map center when GPS changes
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface NavigationScreenProps {
  navigateTo: (screen: string) => void;
}

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

interface RouteData {
  distance: number;
  duration: number;
  coordinates: [number, number][];
  instructions: Array<{
    text: string;
    distance: number;
    time: number;
  }>;
}

export function NavigationScreen({ navigateTo }: NavigationScreenProps) {
  const [destination, setDestination] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const [gps, setGps] = useState({ lat: 10.015, lng: 76.341 });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<{ lat: number; lng: number } | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle keyboard navigation (Backspace to go home)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' && !e.defaultPrevented) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          navigateTo('home');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateTo]);

  // Real-time GPS updates from WebSocket
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.gps) {
        setGps(data.gps);
      }
    };

    ws.onerror = () => {
      console.log("WebSocket disconnected, using default location");
    };

    return () => ws.close();
  }, []);

  // Search locations using Nominatim (OpenStreetMap's geocoding service)
  const searchLocation = async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(destination);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [destination]);

  // Get route using OSRM (Open Source Routing Machine)
  const getRoute = async (start: { lat: number; lng: number }, end: { lat: number; lng: number }) => {
    setIsLoadingRoute(true);
    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&steps=true`
      );

      const route = response.data.routes[0];
      const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
      
      const instructions = route.legs[0].steps.map((step: any) => ({
        text: step.maneuver.instruction || "Continue",
        distance: step.distance,
        time: step.duration,
      }));

      setRouteData({
        distance: route.distance / 1000, // Convert to km
        duration: route.duration / 60, // Convert to minutes
        coordinates,
        instructions,
      });
    } catch (error) {
      console.error("Route error:", error);
      alert("Could not calculate route. Please try again.");
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Select a destination from search results
  const selectDestination = (result: SearchResult) => {
    const destLocation = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
    setSelectedDestination(destLocation);
    setDestination(result.display_name);
    setSearchResults([]);
    getRoute(gps, destLocation);
  };

  const handleStartRide = () => {
    if (!selectedDestination) {
      alert("Please select a destination first");
      return;
    }
    setIsNavigating(true);
  };

  const clearSearch = () => {
    setDestination("");
    setSearchResults([]);
    setSelectedDestination(null);
    setRouteData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {!isNavigating ? (
        /* Navigation Setup */
        <>
          {/* Header */}
          <div className="bg-gradient-to-b from-accent to-background px-6 pb-6 pt-12">
            <div className="mb-6 flex items-center gap-4">
              <button
                onClick={() => navigateTo("home")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
              >
                <ArrowLeft size={20} className="text-foreground" />
              </button>
              <div>
                <h1 className="text-2xl">Navigation</h1>
                <p className="text-sm text-muted-foreground">Plan your ride</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <Search size={20} className="text-muted-foreground" />
              </div>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Search destination..."
                className="w-full rounded-xl border border-border bg-input px-12 py-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {destination && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={20} />
                </button>
              )}
              {isSearching && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                  <Loader2 size={20} className="animate-spin text-primary" />
                </div>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-60 overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
                {searchResults.map((result) => (
                  <button
                    key={result.place_id}
                    onClick={() => selectDestination(result)}
                    className="flex w-full items-start gap-3 border-b border-border p-4 text-left transition-colors hover:bg-accent last:border-b-0"
                  >
                    <MapPin size={20} className="mt-1 shrink-0 text-primary" />
                    <div className="flex-1">
                      <div className="text-sm">{result.display_name}</div>
                      <div className="mt-1 text-xs text-muted-foreground capitalize">
                        {result.type}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* OpenStreetMap - FREE with Real-time Location! */}
          <div className="relative mx-6 mb-6 h-80 overflow-hidden rounded-2xl border-2 border-border shadow-lg">
            {isLoadingRoute && (
              <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="text-center">
                  <Loader2 size={48} className="mx-auto mb-3 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Calculating route...</p>
                </div>
              </div>
            )}
            <MapContainer 
              center={[gps.lat, gps.lng]} 
              zoom={selectedDestination ? 13 : 15} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapUpdater center={[gps.lat, gps.lng]} />
              
              {/* Current Location Marker */}
              <Marker position={[gps.lat, gps.lng]}>
                <Popup>📍 Your Location</Popup>
              </Marker>
              
              {/* Destination Marker */}
              {selectedDestination && (
                <Marker position={[selectedDestination.lat, selectedDestination.lng]}>
                  <Popup>🎯 Destination</Popup>
                </Marker>
              )}
              
              {/* Route Line */}
              {routeData && (
                <Polyline 
                  positions={routeData.coordinates} 
                  color="#00ff88" 
                  weight={4}
                  opacity={0.7}
                />
              )}
            </MapContainer>
          </div>

          {/* Route Summary (if route calculated) */}
          {routeData && (
            <div className="mx-6 mb-6 rounded-2xl border-2 border-primary bg-card p-5 shadow-lg">
              <h3 className="mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                Route Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl text-primary">{routeData.distance.toFixed(1)} km</div>
                  <div className="mt-1 text-xs text-muted-foreground">Distance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-primary">{Math.round(routeData.duration)} min</div>
                  <div className="mt-1 text-xs text-muted-foreground">Duration</div>
                </div>
              </div>
            </div>
          )}

          {/* Current Location */}
          <div className="px-6">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <Navigation2 size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">
                    Current Location
                  </div>
                  <div className="mt-1 text-sm">
                    Lat: {gps.lat.toFixed(4)}, Lng: {gps.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Start Ride Button */}
          <div className="px-6 pt-6">
            <button
              onClick={handleStartRide}
              disabled={!selectedDestination || isLoadingRoute}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-[var(--tech-blue)] py-4 text-primary-foreground shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-2">
                {isLoadingRoute ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    <span className="text-lg">Calculating Route...</span>
                  </>
                ) : (
                  <>
                    <Navigation2 size={24} />
                    <span className="text-lg">
                      {selectedDestination ? "Start Ride" : "Select Destination"}
                    </span>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Recent Destinations */}
          <div className="mt-6 px-6 pb-6">
            <h3 className="mb-4 text-sm uppercase tracking-wide text-muted-foreground">
              Recent Destinations
            </h3>
            <div className="space-y-3">
              {["City Center Mall", "Riverside Park", "Tech Campus"].map(
                (place, index) => (
                  <button
                    key={index}
                    className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:bg-accent"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm">{place}</div>
                    </div>
                    <ArrowRight size={18} className="text-muted-foreground" />
                  </button>
                ),
              )}
            </div>
          </div>
        </>
      ) : (
        /* Active Navigation */
        <>
          {/* Map View with Route */}
          <div className="relative h-[60vh] overflow-hidden">
            <MapContainer 
              center={[gps.lat, gps.lng]} 
              zoom={16} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapUpdater center={[gps.lat, gps.lng]} />
              
              {/* Current Location */}
              <Marker position={[gps.lat, gps.lng]}>
                <Popup>📍 You are here</Popup>
              </Marker>
              
              {/* Destination */}
              {selectedDestination && (
                <Marker position={[selectedDestination.lat, selectedDestination.lng]}>
                  <Popup>🎯 Destination</Popup>
                </Marker>
              )}
              
              {/* Route */}
              {routeData && (
                <Polyline 
                  positions={routeData.coordinates} 
                  color="#00ff88" 
                  weight={5}
                  opacity={0.8}
                />
              )}
            </MapContainer>

            {/* Back Button */}
            <button
              onClick={() => navigateTo("home")}
              className="absolute left-6 top-12 z-[1000] flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-lg"
            >
              <ArrowLeft size={20} className="text-foreground" />
            </button>

            {/* Trip Stats */}
            <div className="absolute right-6 top-12 z-[1000] space-y-2">
              <div className="rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  <div className="text-sm">12 min</div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Gauge size={16} className="text-primary" />
                  <div className="text-sm">45 km/h</div>
                </div>
              </div>
            </div>
          </div>

          {/* Turn-by-turn Directions */}
          <div className="bg-background px-6 pb-6 pt-6">
            {/* Next Turn */}
            {routeData && routeData.instructions.length > 0 && (
              <div className="mb-4 rounded-2xl border-2 border-primary bg-card p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                    <CornerDownRight size={32} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      In {routeData.instructions[0].distance.toFixed(0)} meters
                    </div>
                    <div className="mt-1 text-xl">{routeData.instructions[0].text}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Route Summary */}
            {routeData && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                  Route Summary
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xl text-primary">{routeData.distance.toFixed(1)} km</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Distance
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl text-primary">{Math.round(routeData.duration)} min</div>
                    <div className="mt-1 text-xs text-muted-foreground">ETA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl text-primary">
                      {new Date(Date.now() + routeData.duration * 60000).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Arrival
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming Turns */}
            {routeData && routeData.instructions.length > 1 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm uppercase tracking-wide text-muted-foreground">
                  Upcoming Turns
                </h3>
                {routeData.instructions.slice(1, 4).map((instruction, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                  >
                    <CornerDownRight size={20} className="text-muted-foreground" />
                    <div className="flex-1 text-sm">{instruction.text}</div>
                    <div className="text-xs text-muted-foreground">
                      {(instruction.distance / 1000).toFixed(1)} km
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* End Ride Button */}
            <button 
              onClick={() => {
                setIsNavigating(false);
                clearSearch();
              }}
              className="mt-6 w-full rounded-xl border border-destructive bg-destructive/10 py-3 text-destructive transition-all hover:bg-destructive/20 active:scale-95"
            >
              End Navigation
            </button>
          </div>
        </>
      )}
    </div>
  );
}
