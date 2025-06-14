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
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, LogOut, User, Settings } from "lucide-react";
import AuthModal from "./AuthModal";
import UserPokedex from "./UserPokedex";

// Utiliser directement React.HTMLAttributes<HTMLElement> pour les props
const Navbar: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  className,
  ...props
}) => {
  const { user, profile, signOut, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <nav
      className={cn(
        "w-full bg-[#3B4CCA] text-white py-4 px-6 mb-8", // Classes par défaut
        className // Classes externes passées via la prop
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-[#FFDE00]">Pokédex</div>

        <div className="flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-[#FF0000]/20">
                  Explorer
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 w-[400px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-[#CC0000] to-[#FF0000] p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Pokédex
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Explorez la base de données complète des Pokémon
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-[#FF0000]/20">
                  Curiosités
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li className="row-span-3">
                      <span className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-[#FFDE00] to-[#B3A125] p-6 no-underline outline-none focus:shadow-md">
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Le Saviez-vous ?
                        </div>
                        <p className="text-sm leading-tight text-black/90">
                          Découvrez des faits fascinants sur vos Pokémon
                          préférés
                        </p>
                      </span>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Boutons d'authentification et pokédex */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <UserPokedex />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={profile?.avatar_url}
                          alt={profile?.name || user.email}
                        />
                        <AvatarFallback className="bg-[#FFDE00] text-[#3B4CCA]">
                          {(profile?.name || user.email)
                            ?.charAt(0)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {profile?.name && (
                          <p className="font-medium">{profile.name}</p>
                        )}
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Se déconnecter</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                variant="secondary"
                onClick={() => setAuthModalOpen(true)}
                disabled={loading}
                className="bg-[#FFDE00] text-[#3B4CCA] hover:bg-[#FFDE00]/90"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Se connecter
              </Button>
            )}
          </div>
        </div>

        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </div>
    </nav>
  );
};

export default Navbar;
