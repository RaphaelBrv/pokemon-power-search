import React, { Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Zap, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserPokedex from "./UserPokedex";
import "./Hero.css";
import { motion } from "framer-motion";

// Lazy load du composant 3D lourd (Three.js)
const Pokeball3D = lazy(() => import("./Pokeball3D"));

const Hero: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="relative py-12 sm:py-20 px-4 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-5">
        <div className="grid grid-cols-6 gap-4 rotate-12 scale-150">
          {Array.from({ length: 24 }).map((_, i) => (
            <Zap key={i} className="w-20 h-20 text-[#3B4CCA]" />
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#FFDE00]/20 text-[#3B4CCA] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-[#FFDE00]/30 backdrop-blur-sm">
            <Trophy className="w-4 h-4" />
            La collection ultime vous attend
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-[#3B4CCA] mb-6 leading-[0.9] tracking-tighter italic drop-shadow-sm">
            ATTRAPEZ-LES <br />
            <span className="text-[#FF0000] drop-shadow-[0_4px_0_rgba(0,0,0,0.1)]">TOUTES !</span>
          </h1>
          
          <p className="text-lg sm:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium leading-tight">
            Le moteur de recherche Pokémon le plus puissant. <br className="hidden sm:block" />
            <span className="text-[#3B4CCA] font-black">Trouvez, collectionnez, dominez.</span>
          </p>
        </motion.div>

        {/* Lazy loading du composant 3D avec fallback */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-[#3B4CCA]/10 rounded-full blur-[100px] scale-75 group-hover:bg-[#FF0000]/10 transition-colors duration-1000" />
          <Suspense
            fallback={
              <div className="w-full h-64 sm:h-80 mx-auto max-w-xl my-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <div className="text-white text-4xl font-black">POKÉ</div>
              </div>
            }
          >
            <Pokeball3D className="w-full h-[400px] sm:h-[500px] mx-auto max-w-2xl my-4" />
          </Suspense>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold border border-white/10 shadow-2xl">
            CLIQUEZ SUR LA POKÉBALL POUR UNE SURPRISE !
          </div>
        </motion.div>

        {/* Boutons d'action */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-col items-center gap-6"
        >
          {user ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-[#3B4CCA] font-black italic">
                <Sparkles className="h-5 w-5 text-[#FFDE00] fill-[#FFDE00]" />
                BIENVENUE, MAÎTRE DRESSEUR !
                <Sparkles className="h-5 w-5 text-[#FFDE00] fill-[#FFDE00]" />
              </div>

              <div className="scale-110 hover:scale-105 transition-transform duration-300">
                <UserPokedex />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-3 text-sm text-gray-500 font-bold bg-white px-6 py-3 rounded-2xl border-2 border-dashed border-gray-200">
                <BookOpen className="h-5 w-5 text-[#3B4CCA]" />
                Prêt à créer votre propre collection ?
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="poke-button-yellow h-16 px-12 text-xl tracking-tighter"
                  disabled
                >
                  <Zap className="mr-3 h-6 w-6 fill-current" />
                  COMMENCER L'AVENTURE
                </Button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
