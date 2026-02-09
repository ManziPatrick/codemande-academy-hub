import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";

import { BrandingProvider } from "@/components/BrandingProvider";
import { ChatBot } from "@/components/chatbot/ChatBot";
import { GoogleOneTap } from "@/components/auth/GoogleOneTap";

import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GoogleOneTap />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} storageKey="codemande-theme">
          <BrandingProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <AnimatedRoutes />
                <ChatBot />
              </BrowserRouter>
            </TooltipProvider>
          </BrandingProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
