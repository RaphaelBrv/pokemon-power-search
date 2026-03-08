import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePokedexStats, useUserCards } from "@/hooks/usePokedexQueries";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Mail, Calendar, Hash, Trophy, Sparkles, Edit2, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const ProfilePage = () => {
  const { user, profile, updateProfile } = useAuth();
  const { totalCards, uniqueCards } = usePokedexStats();
  const { data: userCards = [] } = useUserCards();
  
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(profile?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateName = async () => {
    if (!newName.trim()) return;
    
    setIsUpdating(true);
    const { error } = await updateProfile({ name: newName });
    setIsUpdating(false);
    
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le nom",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
      setIsEditing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Veuillez vous connecter pour accéder à votre profil.</p>
      </div>
    );
  }

  const pokemonRed = "#FF0000";
  const pokemonWhite = "#FFFFFF";
  const pokemonBlack = "#000000";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c13.807 0 25 11.193 25 25S18.807 55 5 55 5 43.807 5 30 16.193 5 30 5zm0 5C18.954 10 10 18.954 10 30s8.954 20 20 20 20-8.954 20-20S41.046 10 30 10zm0 16c2.209 0 4 1.791 4 4s-1.791 4-4 4-4-1.791-4-4 1.791-4 4-4z' fill='%23000000' fill-rule='nonzero'/%3E%3C/svg%3E")`,
             backgroundSize: '120px 120px'
           }} 
      />
      
      <Navbar className={`bg-[${pokemonRed}] text-[${pokemonWhite}] shadow-md z-10`}>
        {/* Navbar content will be inherited from the component */}
      </Navbar>

      <main className="flex-grow container mx-auto px-4 py-8 relative z-10 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Left Column - User Info */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border-2 border-[#3B4CCA]/10 shadow-xl overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-[#3B4CCA] to-[#2A3990]" />
              <CardContent className="pt-0 -mt-12 flex flex-col items-center">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg mb-4">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-[#FFDE00] text-[#3B4CCA] text-3xl font-black">
                    {(profile?.name || user.email)?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {isEditing ? (
                  <div className="flex items-center gap-2 w-full mt-2">
                    <Input 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)}
                      className="text-center font-bold"
                      placeholder="Votre nom"
                      autoFocus
                    />
                    <Button size="icon" variant="ghost" onClick={handleUpdateName} disabled={isUpdating}>
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-2">
                    <h2 className="text-2xl font-black text-[#3B4CCA] text-center">
                      {profile?.name || "Dresseur"}
                    </h2>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400" onClick={() => setIsEditing(true)}>
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                <p className="text-sm text-gray-500 mb-6">{user.email}</p>
                
                <div className="w-full space-y-3 pt-6 border-t border-dashed">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-[#3B4CCA]" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-[#3B4CCA]" />
                    <span>Membre depuis {profile?.created_at ? format(new Date(profile.created_at), 'MMMM yyyy', { locale: fr }) : '...'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Hash className="h-4 w-4 text-[#3B4CCA]" />
                    <span className="font-mono text-xs opacity-60">ID: {user.id.substring(0, 8)}...</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#FFDE00]/30 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-[#FFDE00]" /> Succès
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Niveau Dresseur</span>
                  <Badge className="bg-[#3B4CCA]">Niv. {Math.floor(totalCards / 10) + 1}</Badge>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#FFDE00] h-full transition-all duration-1000" 
                    style={{ width: `${(totalCards % 10) * 10}%` }}
                  />
                </div>
                <p className="text-[10px] text-center text-gray-400">
                  {10 - (totalCards % 10)} cartes avant le prochain niveau
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="md:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-white to-blue-50 border-none shadow-lg">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-2xl text-[#3B4CCA]">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Cartes Uniques</p>
                    <p className="text-3xl font-black text-[#3B4CCA]">{uniqueCards}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-white to-red-50 border-none shadow-lg">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-2xl text-[#FF0000]">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Total Collection</p>
                    <p className="text-3xl font-black text-[#FF0000]">{totalCards}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-xl border-none">
              <CardHeader>
                <CardTitle className="text-xl font-black text-[#3B4CCA] flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#FFDE00]" /> Activité Récente
                </CardTitle>
                <CardDescription>Vos dernières cartes ajoutées au Pokédex</CardDescription>
              </CardHeader>
              <CardContent>
                {userCards.length > 0 ? (
                  <div className="space-y-4">
                    {userCards.slice(0, 5).map((card) => (
                      <div key={card.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        <div className="h-16 w-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {card.card_image_url ? (
                            <img src={card.card_image_url} alt={card.card_name} className="h-full w-full object-contain" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400">?</div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="font-black text-gray-800">{card.card_name}</p>
                          <p className="text-xs text-gray-500">{card.card_set || 'Set inconnu'}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-[10px]">{card.card_rarity || 'Commune'}</Badge>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {format(new Date(card.added_at), 'dd/MM/yyyy', { locale: fr })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Button variant="ghost" className="w-full text-[#3B4CCA] font-bold" asChild>
                      <Link to="/">
                        Voir tout le Pokédex
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 italic">Aucune activité récente. Commencez votre collection !</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>

      <Footer className={`bg-[${pokemonBlack}] text-[${pokemonWhite}] mt-12 z-10`} />
    </div>
  );
};

export default ProfilePage;
