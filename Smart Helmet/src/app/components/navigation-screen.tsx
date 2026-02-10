import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
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
} from "lucide-react";

interface NavigationScreenProps {
  navigateTo: (screen: string) => void;
}

export function NavigationScreen({ navigateTo }: NavigationScreenProps) {
  const [destination, setDestination] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const [gps, setGps] = useState({ lat: 0, lng: 0 });
  const [currentLocation, setCurrentLocation] = useState(null);

  // Handle keyboard navigation (Backspace to go home)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace" && !e.defaultPrevented) {
        // Only navigate if not typing in an input
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
          navigateTo("home");
        }
      }
    };

    useEffect(() => {
      navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    }, []);

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateTo]);

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const center = {
    lat: gps.lat || 10.015,
    lng: gps.lng || 76.341,
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.gps) {
        setGps(data.gps);
      }
    };

    return () => ws.close();
  }, []);

  const handleStartRide = () => {
    setIsNavigating(true);
  };

  // Check if Google Maps API key is configured
  const hasGoogleMapsKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY &&
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY !== "YOUR_API_KEY_HERE";

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
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="relative mx-6 mb-6 h-80 overflow-hidden rounded-2xl border-2 border-border shadow-lg">
            {hasGoogleMapsKey ? (
              <LoadScript
                googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
              >
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={15}
                >
                  <Marker position={center} />
                </GoogleMap>
              </LoadScript>
            ) : (
              <div className="relative h-full w-full bg-gradient-to-br from-accent to-secondary">
                {/* Grid overlay for map effect */}
                <div className="absolute inset-0 opacity-10">
                  <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:20px_20px]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-2xl border-2 border-destructive bg-card/95 p-6 text-center backdrop-blur-sm">
                    <MapPin
                      size={48}
                      className="mx-auto mb-3 text-destructive"
                    />
                    <h3 className="mb-2 text-lg">
                      Google Maps API Key Required
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Please configure your API key in the .env file
                    </p>
                    <a
                      href="/GOOGLE_MAPS_SETUP.md"
                      target="_blank"
                      className="text-sm text-primary hover:underline"
                    >
                      View Setup Instructions →
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

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
              className="w-full rounded-xl bg-gradient-to-r from-primary to-[var(--tech-blue)] py-4 text-primary-foreground shadow-lg transition-all hover:scale-[1.02] active:scale-95"
            >
              <div className="flex items-center justify-center gap-2">
                <Navigation2 size={24} />
                <span className="text-lg">Start Ride</span>
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
          {/* Map View */}
          <div className="relative h-[60vh] overflow-hidden bg-gradient-to-br from-accent to-secondary">
            <div className="absolute inset-0">
              {/* Map grid effect */}
              <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:30px_30px] opacity-10" />
              {/* Route line */}
              <div className="absolute left-1/4 top-1/4 h-1/2 w-1 rotate-45 bg-gradient-to-b from-primary to-[var(--tech-blue)]" />
            </div>

            {/* Current Location Pin */}
            <div
              className="absolute"
              style={{
                bottom: `${30 + (gps.lat % 20)}%`,
                left: `${50 + (gps.lng % 20)}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative">
                <div className="h-4 w-4 animate-pulse rounded-full bg-[var(--tech-blue)] shadow-lg" />
                <div className="absolute -inset-2 animate-ping rounded-full bg-[var(--tech-blue)]/40" />
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigateTo("home")}
              className="absolute left-6 top-12 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-lg"
            >
              <ArrowLeft size={20} className="text-foreground" />
            </button>

            {/* Trip Stats */}
            <div className="absolute right-6 top-12 space-y-2">
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
            <div className="mb-4 rounded-2xl border-2 border-primary bg-card p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <CornerDownRight size={32} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    In 500 meters
                  </div>
                  <div className="mt-1 text-xl">Turn right on Oak Street</div>
                </div>
              </div>
            </div>

            {/* Route Summary */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                Route Summary
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl text-primary">5.2 km</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Distance
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl text-primary">12 min</div>
                  <div className="mt-1 text-xs text-muted-foreground">ETA</div>
                </div>
                <div className="text-center">
                  <div className="text-xl text-primary">14:30</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Arrival
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Turns */}
            <div className="mt-4 space-y-2">
              <h3 className="text-sm uppercase tracking-wide text-muted-foreground">
                Upcoming Turns
              </h3>
              {[
                {
                  icon: CornerDownRight,
                  text: "Turn right on Oak Street",
                  distance: "500 m",
                },
                {
                  icon: ArrowUp,
                  text: "Continue on Oak Street",
                  distance: "1.2 km",
                },
                {
                  icon: CornerDownRight,
                  text: "Turn right on Maple Ave",
                  distance: "2.8 km",
                },
              ].map((turn, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <turn.icon size={20} className="text-muted-foreground" />
                  <div className="flex-1 text-sm">{turn.text}</div>
                  <div className="text-xs text-muted-foreground">
                    {turn.distance}
                  </div>
                </div>
              ))}
            </div>

            {/* End Ride Button */}
            <button className="mt-6 w-full rounded-xl border border-destructive bg-destructive/10 py-3 text-destructive transition-all hover:bg-destructive/20 active:scale-95">
              End Navigation
            </button>
          </div>
        </>
      )}
    </div>
  );
}
