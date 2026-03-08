import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { SearchHistoryProvider } from "@/contexts/SearchHistoryContext";
import { DeckProvider } from "@/contexts/DeckContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { PokedexProvider } from "@/contexts/PokedexContext";
import { CursorProvider } from "@/contexts/CursorContext";

import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const App = () => (
  <AuthProvider>
    <CursorProvider>
      <PokedexProvider>
        <FavoritesProvider>
          <SearchHistoryProvider>
            <DeckProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter
                  future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                  }}
                >
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </DeckProvider>
          </SearchHistoryProvider>
        </FavoritesProvider>
      </PokedexProvider>
    </CursorProvider>
  </AuthProvider>
);

export default App;
