import React from "react";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { Github, Twitter, Mail, Heart, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";

export type FooterProps = React.HTMLAttributes<HTMLElement>;

const Footer: React.FC<FooterProps> = ({ className, ...props }) => {
  return (
    <footer className={cn("mt-20 bg-[#111] text-white overflow-hidden", className)} {...props}>
      <div className="h-2 w-full bg-[#FFDE00]" />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#FFDE00] p-2 rounded-lg">
                <Zap className="w-6 h-6 text-[#3B4CCA] fill-[#3B4CCA]" />
              </div>
              <span className="text-2xl font-black italic tracking-tighter text-[#FFDE00]">
                POKÉPOWER
              </span>
            </div>
            <p className="text-gray-400 font-medium leading-relaxed">
              Le moteur de recherche ultime pour tous les dresseurs. Trouvez chaque carte, suivez chaque prix, dominez la ligue.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Globe].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5, color: "#FFDE00" }}
                  className="bg-white/5 p-3 rounded-xl border border-white/10 text-white/60 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-black uppercase tracking-widest text-white/40">Ressources</h4>
            <ul className="space-y-4 font-bold text-gray-300">
              <li><a href="#" className="hover:text-[#FFDE00] transition-colors">API TCGDex</a></li>
              <li><a href="#" className="hover:text-[#FFDE00] transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-[#FFDE00] transition-colors">Statistiques Live</a></li>
              <li><a href="#" className="hover:text-[#FFDE00] transition-colors">Guide du Dresseur</a></li>
            </ul>
          </div>

          <div className="bg-[#3B4CCA] rounded-3xl p-8 relative overflow-hidden group">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -right-10 -bottom-10 opacity-10"
            >
              <Zap className="w-40 h-40 text-white fill-white" />
            </motion.div>
            <h4 className="text-xl font-black italic mb-4 relative z-10">REJOIGNEZ LA LIGUE</h4>
            <p className="text-white/80 font-bold mb-6 relative z-10">Recevez des alertes sur les cartes rares et les nouvelles extensions.</p>
            <div className="flex gap-2 relative z-10">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="bg-black/20 border-2 border-white/10 rounded-xl px-4 py-2 flex-1 font-bold placeholder:text-white/30 focus:border-[#FFDE00] outline-none transition-all"
              />
              <button className="bg-[#FFDE00] text-[#3B4CCA] p-2 rounded-xl">
                <Mail className="w-6 h-6 stroke-[3px]" />
              </button>
            </div>
          </div>
        </div>

        <Separator className="bg-white/5 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
            <Heart className="w-4 h-4 text-[#FF0000] fill-[#FF0000]" />
            <span>Fait avec passion pour les dresseurs de 2025</span>
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
            © 2025 POKÉPOWER SEARCH ENGINE • TOUS DROITS RÉSERVÉS
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
