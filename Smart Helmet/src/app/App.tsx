import React, { useState, useEffect } from "react";
import { SplashScreen } from "@/app/components/splash-screen";
import { LoginScreen } from "@/app/components/login-screen";
import { HomeScreen } from "@/app/components/home-screen";
import { LiveMonitoringScreen } from "@/app/components/live-monitoring-screen";
import { NavigationScreen } from "@/app/components/navigation-screen-osm";
import { AlertsScreen } from "@/app/components/alerts-screen";
import { EmergencyContactsScreen } from "@/app/components/emergency-contacts-screen";
import { ProfileScreen } from "@/app/components/profile-screen";
import { ThemeProvider, useTheme } from "@/app/contexts/theme-context";

type Screen =
  | "splash"
  | "login"
  | "home"
  | "monitoring"
  | "navigation"
  | "alerts"
  | "contacts"
  | "profile";

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Show splash screen for 2 seconds
    if (currentScreen === "splash") {
      const timer = setTimeout(() => {
        setCurrentScreen("login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen("home");
  };

  const handleGuestLogin = () => {
    setIsLoggedIn(false);
    setCurrentScreen("home");
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };
    
  return (
    <ThemeProvider>
      <AppContent
        currentScreen={currentScreen}
        isLoggedIn={isLoggedIn}
        handleLogin={handleLogin}
        handleGuestLogin={handleGuestLogin}
        navigateTo={navigateTo}
      />
    </ThemeProvider>
  );
}

function AppContent({
  currentScreen,
  isLoggedIn,
  handleLogin,
  handleGuestLogin,
  navigateTo,
}: {
  currentScreen: Screen;
  isLoggedIn: boolean;
  handleLogin: () => void;
  handleGuestLogin: () => void;
  navigateTo: (screen: Screen) => void;
}) {
  const { theme } = useTheme();

  return (
    <div className={`${theme} min-h-screen bg-background`}>
      <div className="mx-auto max-w-md">
        {currentScreen === "splash" && <SplashScreen />}
        {currentScreen === "login" && (
          <LoginScreen onLogin={handleLogin} onGuestLogin={handleGuestLogin} />
        )}
        {currentScreen === "home" && <HomeScreen navigateTo={navigateTo} />}
        {currentScreen === "monitoring" && (
          <LiveMonitoringScreen navigateTo={navigateTo} />
        )}
        {currentScreen === "navigation" && (
          <NavigationScreen navigateTo={navigateTo} />
        )}
        {currentScreen === "alerts" && <AlertsScreen navigateTo={navigateTo} />}
        {currentScreen === "contacts" && (
          <EmergencyContactsScreen navigateTo={navigateTo} />
        )}
        {currentScreen === "profile" && (
          <ProfileScreen navigateTo={navigateTo} />
        )}
      </div>
    </div>
  );
}

export default App;
