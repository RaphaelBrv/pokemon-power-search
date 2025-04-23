
import React from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
  return (
    <nav className="w-full bg-[#3B4CCA] text-white py-4 px-6 mb-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-[#FFDE00]">Pokédex</div>
        
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
                        Découvrez des faits fascinants sur vos Pokémon préférés
                      </p>
                    </span>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};

export default Navbar;
