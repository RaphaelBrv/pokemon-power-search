import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCursor, CursorStyleId } from "@/contexts/CursorContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Settings, Shield, Bell, MousePointer2, Save, Trash2, AlertTriangle, Languages } from "lucide-react";
import { motion } from "framer-motion";

const SettingsPage = () => {
  const { user } = useAuth();
  const { selectedCursorId, setSelectedCursorId } = useCursor();
  
  // États pour les paramètres (simulés ou réels)
  const [notifications, setNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simuler une sauvegarde
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Paramètres enregistrés",
        description: "Vos préférences ont été mises à jour avec succès.",
      });
    }, 800);
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");
    if (confirm) {
      toast({
        title: "Action requise",
        description: "Veuillez contacter le support pour la suppression de compte.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Veuillez vous connecter pour accéder aux paramètres.</p>
      </div>
    );
  }

  const pokemonRed = "#FF0000";
  const pokemonWhite = "#FFFFFF";
  const pokemonBlack = "#000000";

  const cursorOptions: { id: CursorStyleId; name: string; description: string }[] = [
    { id: null, name: "Par défaut", description: "Le curseur standard de votre système" },
    { id: "pokeball", name: "Poké Ball", description: "Le classique indémodable" },
    { id: "masterball", name: "Master Ball", description: "Pour les dresseurs d'élite" },
    { id: "safari", name: "Safari Ball", description: "L'esprit de l'aventure" },
    { id: "rotating", name: "Poké Ball Animée", description: "Elle tourne sans cesse" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c13.807 0 25 11.193 25 25S18.807 55 5 55 5 43.807 5 30 16.193 5 30 5zm0 5C18.954 10 10 18.954 10 30s8.954 20 20 20 20-8.954 20-20S41.046 10 30 10zm0 16c2.209 0 4 1.791 4 4s-1.791 4-4 4-4-1.791-4-4 1.791-4 4-4z' fill='%23000000' fill-rule='nonzero'/%3E%3C/svg%3E")`,
             backgroundSize: '120px 120px'
           }} 
      />
      
      <Navbar className={`bg-[${pokemonRed}] text-[${pokemonWhite}] shadow-md z-10`} />

      <main className="flex-grow container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-3 bg-[#3B4CCA] rounded-2xl text-white shadow-lg">
            <Settings className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#3B4CCA] uppercase tracking-tighter">Paramètres</h1>
            <p className="text-gray-500 font-medium">Gérez vos préférences et la sécurité de votre compte</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {/* Personnalisation du Curseur */}
          <Card className="border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b border-purple-100">
              <div className="flex items-center gap-3">
                <MousePointer2 className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg font-black text-gray-800 uppercase tracking-tight">Style du Curseur</CardTitle>
              </div>
              <CardDescription>Personnalisez votre pointeur pour une expérience unique</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {cursorOptions.map((opt) => (
                  <div 
                    key={opt.id}
                    onClick={() => setSelectedCursorId(opt.id)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                      selectedCursorId === opt.id 
                        ? "border-[#3B4CCA] bg-blue-50/50 shadow-md scale-[1.02]" 
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-black text-[#3B4CCA] mb-1">{opt.name}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{opt.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Notifications */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-lg font-black text-gray-800">Notifications</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold">Alertes de collection</Label>
                    <p className="text-xs text-gray-500">Être notifié quand vous complétez un set</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold">Emails marketing</Label>
                    <p className="text-xs text-gray-500">Recevoir des offres et nouveautés</p>
                  </div>
                  <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                </div>
              </CardContent>
            </Card>

            {/* Langue & Région */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Languages className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg font-black text-gray-800">Langue & Région</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold">Langue de l'interface</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choisir une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français (France)</SelectItem>
                      <SelectItem value="en">English (UK/US)</SelectItem>
                      <SelectItem value="jp">日本語 (Japon)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sécurité et Compte */}
          <Card className="border-none shadow-xl overflow-hidden border-t-4 border-red-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-red-600" />
                <CardTitle className="text-lg font-black text-gray-800">Sécurité du Compte</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                <div>
                  <div className="font-bold text-red-900 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Zone de danger
                  </div>
                  <p className="text-xs text-red-700">La suppression de votre compte effacera tout votre Pokédex et vos decks.</p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="font-black"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Supprimer mon compte
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" className="font-bold" onClick={() => window.history.back()}>
              Annuler
            </Button>
            <Button 
              className="bg-[#3B4CCA] hover:bg-[#2A3990] font-black px-8 shadow-lg"
              onClick={handleSaveSettings}
              disabled={isSaving}
            >
              {isSaving ? "Enregistrement..." : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      <Footer className={`bg-[${pokemonBlack}] text-[${pokemonWhite}] mt-12 z-10`} />
    </div>
  );
};

export default SettingsPage;
