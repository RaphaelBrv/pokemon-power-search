import React from "react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { PokemonCard } from "@/types/pokemon";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FavoritesListProps {
  onCardClick: (card: PokemonCard) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ onCardClick }) => {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Heart className="h-4 w-4" />
            <span>Favoris (0)</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Vos cartes favorites</DrawerTitle>
            <DrawerDescription>
              Vous n'avez pas encore ajouté de cartes à vos favoris.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Fermer</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Heart className="h-4 w-4 text-red-500" fill="currentColor" />
          <span>Favoris ({favorites.length})</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Vos cartes favorites</DrawerTitle>
          <DrawerDescription>
            Vous avez {favorites.length} carte(s) dans vos favoris.
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="h-[60vh] px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-2">
            {favorites.map((card) => (
              <Card key={card.id} className="overflow-hidden">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm font-medium truncate">
                    {card.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {card.set?.name || "Set inconnu"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div
                    className="overflow-hidden rounded-md cursor-pointer"
                    onClick={() => onCardClick(card)}
                  >
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-auto object-cover transition-transform hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-3 pt-0 flex justify-between">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(card.id);
                    }}
                  >
                    Retirer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCardClick(card)}
                  >
                    Détails
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Fermer</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default FavoritesList;
