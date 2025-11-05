import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Games from "./pages/Games";
import SnakeGame from "./pages/games/SnakeGame";
import EmotionsGame from "./pages/games/EmotionsGame";
import SimonGame from "./pages/games/SimonGame";
import MemoryGame from "./pages/games/MemoryGame";
import Articles from "./pages/Articles";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import About from "./pages/About";

const queryClient = new QueryClient();

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <>
      <Header isDark={theme === "dark"} toggleTheme={toggleTheme} />
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
