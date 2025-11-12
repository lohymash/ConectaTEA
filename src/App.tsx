import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import LoadingScreen from "@/components/LoadingScreen";
import GlobalTTS from "@/components/GlobalTTS";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Community = lazy(() => import("./pages/Community"));
const Games = lazy(() => import("./pages/Games"));
const SnakeGame = lazy(() => import("./pages/games/SnakeGame"));
const EmotionsGame = lazy(() => import("./pages/games/EmotionsGame"));
const SimonGame = lazy(() => import("./pages/games/SimonGame"));
const MemoryGame = lazy(() => import("./pages/games/MemoryGame"));
const Articles = lazy(() => import("./pages/Articles"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));
const About = lazy(() => import("./pages/About"));

const queryClient = new QueryClient();

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <>
      <Header isDark={theme === "dark"} toggleTheme={toggleTheme} />
      <GlobalTTS />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/community" element={<Community />} />
        <Route path="/about" element={<About />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/snake" element={<SnakeGame />} />
              <Route path="/games/emotions" element={<EmotionsGame />} />
              <Route path="/games/simon" element={<SimonGame />} />
              <Route path="/games/memory" element={<MemoryGame />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/profile" element={<Profile />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
