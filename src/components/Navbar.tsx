import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, LogOut, User, Settings, Menu, Bug, Zap, Sparkles } from "lucide-react";
import AuthModal from "./AuthModal";
import UserPokedex from "./UserPokedex";
import PerformanceIndicator from "./PerformanceIndicator";
import { testSupabaseConnection, debugSignOut } from "@/utils/supabase-test";
import { motion, AnimatePresence } from "framer-motion";

// Composant Pokéball miniature pour les survols
const PokeBallIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("w-5 h-5", className)}
  >
    <circle cx="12" cy="12" r="10" fill="white" stroke="black" strokeWidth="2" />
    <path
      d="M2 12H22"
      stroke="black"
      strokeWidth="2"
    />
    <circle cx="12" cy="12" r="3" fill="white" stroke="black" strokeWidth="2" />
    <path
      d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12"
      fill="#FF0000"
      stroke="black"
      strokeWidth="2"
    />
  </svg>
);

const Navbar: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  className,
  ...props
}) => {
  const { user, profile, signOut, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      await debugSignOut();
      await signOut();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      await signOut();
    }
    setMobileMenuOpen(false);
  };

  const handleDebugSupabase = async () => {
    await testSupabaseConnection();
  };

  return (
    <nav
      className={cn(
        "w-full bg-gradient-to-r from-[#3B4CCA] to-[#2A3990] text-white py-3 px-4 sm:px-6 mb-8 sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.3)] border-b-4 border-[#FFDE00]",
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <motion.div 
            className="flex items-center gap-2 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = "/"}
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <PokeBallIcon className="w-8 h-8 sm:w-10 sm:h-10 shadow-lg rounded-full" />
              </motion.div>
              <motion.div 
                className="absolute -top-1 -right-1"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-[#FFDE00]" />
              </motion.div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl sm:text-2xl font-black text-[#FFDE00] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-tighter italic">
                POKÉ<span className="text-white">POWER</span>
              </span>
              <span className="text-[10px] font-bold text-white/70 tracking-[0.2em] uppercase ml-1">
                Search Engine
              </span>
            </div>
          </motion.div>
          <PerformanceIndicator isVisible={!!user} />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className="bg-transparent text-white hover:bg-white/10 data-[state=open]:bg-white/20 transition-all font-bold tracking-wide"
                  onMouseEnter={() => setIsHovered("explorer")}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <div className="flex items-center gap-2">
                    <AnimatePresence>
                      {isHovered === "explorer" && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                        >
                          <Zap className="w-4 h-4 text-[#FFDE00] fill-[#FFDE00]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    Explorer
                  </div>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-[400px] bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-[#3B4CCA]">
                    <NavigationMenuLink asChild>
                      <a
                        className="group flex flex-col gap-2 rounded-xl bg-gradient-to-br from-[#FF0000] to-[#CC0000] p-6 no-underline outline-none transition-all hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]"
                        href="/"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-black text-white">Pokédex PRO</div>
                          <PokeBallIcon className="w-12 h-12 opacity-20 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500" />
                        </div>
                        <p className="text-sm text-white/90 font-medium">
                          Accédez à la base de données ultime. Filtres avancés, statistiques et raretés en temps réel.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className="bg-transparent text-white hover:bg-white/10 data-[state=open]:bg-white/20 transition-all font-bold tracking-wide"
                  onMouseEnter={() => setIsHovered("curiosites")}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <div className="flex items-center gap-2">
                    <AnimatePresence>
                      {isHovered === "curiosites" && (
                        <motion.div
                          initial={{ scale: 0, y: 10 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0, y: 10 }}
                        >
                          <Sparkles className="w-4 h-4 text-[#FFDE00] fill-[#FFDE00]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    Curiosités
                  </div>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-[400px] bg-white rounded-lg shadow-2xl border-2 border-[#3B4CCA]">
                    <div className="rounded-xl bg-gradient-to-br from-[#FFDE00] to-[#F3CC00] p-6 text-[#3B4CCA]">
                      <div className="text-xl font-black mb-2 flex items-center gap-2">
                        <Zap className="w-5 h-5 fill-current" />
                        Le Saviez-vous ?
                      </div>
                      <p className="text-sm font-bold opacity-80">
                        Chaque carte possède une histoire unique. Découvrez les secrets de fabrication et les anecdotes les plus folles du monde Pokémon.
                      </p>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Auth */}
          <div className="flex items-center space-x-3 bg-black/20 p-1.5 rounded-full border border-white/10 backdrop-blur-sm">
            {user ? (
              <>
                <UserPokedex />
                <motion.div whileHover={{ rotate: 15 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDebugSupabase}
                    className="text-orange-400 hover:text-orange-300 hover:bg-orange-400/10 rounded-full h-9 w-9"
                  >
                    <Bug className="h-5 w-5" />
                  </Button>
                </motion.div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="relative h-10 w-10 rounded-full border-2 border-[#FFDE00] p-0.5 shadow-lg overflow-hidden"
                    >
                      <Avatar className="h-full w-full">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback className="bg-[#FFDE00] text-[#3B4CCA] font-black">
                          {(profile?.name || user.email)?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 mt-2 p-2 border-2 border-[#3B4CCA] rounded-xl shadow-2xl" align="end">
                    <div className="flex items-center gap-3 p-3 bg-[#3B4CCA]/5 rounded-lg mb-2">
                      <Avatar className="h-12 w-12 border-2 border-[#3B4CCA]">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback className="bg-[#FFDE00] text-[#3B4CCA] font-bold text-xl">
                          {(profile?.name || user.email)?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <p className="font-black text-[#3B4CCA] truncate">{profile?.name || "Dresseur"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="rounded-md font-bold py-3 cursor-pointer group">
                      <User className="mr-3 h-5 w-5 text-[#3B4CCA] group-hover:scale-110 transition-transform" />
                      <span>Mon Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-md font-bold py-3 cursor-pointer group">
                      <Settings className="mr-3 h-5 w-5 text-[#3B4CCA] group-hover:rotate-90 transition-transform duration-500" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="rounded-md font-bold py-3 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      <span>Quitter l'aventure</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setAuthModalOpen(true)}
                  disabled={loading}
                  className="bg-[#FFDE00] text-[#3B4CCA] hover:bg-[#F3CC00] font-black rounded-full px-6 shadow-[0_4px_0_rgb(179,161,37)] hover:shadow-[0_2px_0_rgb(179,161,37)] hover:translate-y-0.5 transition-all"
                >
                  <LogIn className="mr-2 h-4 w-4 stroke-[3px]" />
                  SE CONNECTER
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center space-x-3">
          {user && <UserPokedex />}
          
          {!user && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAuthModalOpen(true)}
              className="bg-[#FFDE00] text-[#3B4CCA] font-bold rounded-full px-4"
            >
              <LogIn className="mr-1 h-4 w-4" />
              Connexion
            </Button>
          )}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/10 rounded-lg border border-white/20"
              >
                <Menu className="h-6 w-6" />
              </motion.button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] p-0 border-l-4 border-[#3B4CCA]">
              <div className="h-full flex flex-col">
                <div className="p-6 bg-gradient-to-br from-[#3B4CCA] to-[#2A3990] text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <PokeBallIcon className="w-10 h-10" />
                    <span className="text-2xl font-black text-[#FFDE00] italic">POKÉPOWER</span>
                  </div>
                  <p className="text-sm text-white/70 font-bold tracking-widest uppercase">Menu Principal</p>
                </div>

                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                  <div className="space-y-2">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Navigation</p>
                    <motion.button 
                      whileTap={{ x: 10 }}
                      className="flex items-center gap-4 w-full p-4 rounded-xl hover:bg-gray-100 font-black text-[#3B4CCA] transition-colors"
                    >
                      <Zap className="w-6 h-6 text-[#FFDE00] fill-[#FFDE00]" />
                      Explorer le Monde
                    </motion.button>
                    <motion.button 
                      whileTap={{ x: 10 }}
                      className="flex items-center gap-4 w-full p-4 rounded-xl hover:bg-gray-100 font-black text-[#3B4CCA] transition-colors"
                    >
                      <Sparkles className="w-6 h-6 text-[#FFDE00] fill-[#FFDE00]" />
                      Curiosités
                    </motion.button>
                  </div>

                  <div className="border-t-2 border-dashed border-gray-200 pt-6">
                    {user ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-[#3B4CCA]/5 rounded-2xl border-2 border-[#3B4CCA]/10">
                          <Avatar className="h-14 w-14 border-4 border-white shadow-lg">
                            <AvatarImage src={profile?.avatar_url} />
                            <AvatarFallback className="bg-[#FFDE00] text-[#3B4CCA] font-black text-2xl">
                              {(profile?.name || user.email)?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <p className="font-black text-xl text-[#3B4CCA] truncate">{profile?.name || "Dresseur"}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="h-14 font-black border-2 rounded-xl text-[#3B4CCA]">
                            <User className="mr-2 h-5 w-5" /> Profil
                          </Button>
                          <Button variant="outline" className="h-14 font-black border-2 rounded-xl text-[#3B4CCA]">
                            <Settings className="mr-2 h-5 w-5" /> Paramètres
                          </Button>
                        </div>
                        
                        <Button
                          variant="destructive"
                          className="w-full h-14 font-black rounded-xl text-lg shadow-lg"
                          onClick={handleSignOut}
                        >
                          <LogOut className="mr-2 h-6 w-6" />
                          Quitter l'aventure
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                        <p className="text-gray-500 font-bold mb-6">Connectez-vous pour accéder à vos succès et votre collection !</p>
                        <Button
                          className="w-full h-14 bg-[#3B4CCA] hover:bg-[#2A3990] font-black rounded-xl text-lg shadow-xl"
                          onClick={() => {
                            setAuthModalOpen(true);
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogIn className="mr-2 h-6 w-6" />
                          Se Connecter
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </nav>
  );
};

export default Navbar;
