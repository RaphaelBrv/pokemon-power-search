import React from "react";
import { PokemonCard } from "@/types/pokemon";
import {
  ArrowsMaximize,
  HelpCircle,
  SplitSquareVertical,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CardComparisonProps {
  cards: PokemonCard[];
  removeCard: (cardId: string) => void;
  clearComparison: () => void;
  maxCards: number;
}

const CardComparison: React.FC<CardComparisonProps> = ({
  cards,
  removeCard,
  clearComparison,
  maxCards,
}) => {
  const hasCards = cards.length > 0;
  const canCompare = cards.length >= 2;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={!canCompare}
        >
          <SplitSquareVertical className="h-4 w-4" />
          <span>
            Comparer ({cards.length}/{maxCards})
          </span>
        </Button>
      </DialogTrigger>
      {canCompare && (
        <DialogContent className="max-w-[90vw] w-fit">
          <DialogHeader>
            <DialogTitle>Comparaison de cartes</DialogTitle>
            <DialogDescription>
              Comparez les caractéristiques de vos cartes Pokémon sélectionnées.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="visual" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="visual">Comparaison visuelle</TabsTrigger>
              <TabsTrigger value="table">Tableau comparatif</TabsTrigger>
            </TabsList>

            {/* Comparaison visuelle */}
            <TabsContent value="visual">
              <div className="flex flex-wrap justify-center gap-4 p-2">
                {cards.map((card) => (
                  <div key={card.id} className="relative">
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-1 right-1 z-10 bg-white rounded-full w-6 h-6 p-1"
                      onClick={() => removeCard(card.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <img
                      src={card.image}
                      alt={card.name}
                      className="h-80 w-auto object-contain rounded-lg border border-gray-200"
                    />
                    <div className="text-center mt-2 font-medium text-sm">
                      {card.name}
                    </div>
                    {card.rarity && (
                      <div className="text-center mt-1">
                        <Badge variant="outline">{card.rarity}</Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Tableau comparatif */}
            <TabsContent value="table">
              <ScrollArea className="h-[60vh]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">
                        Caractéristique
                      </TableHead>
                      {cards.map((card) => (
                        <TableHead
                          key={card.id}
                          className="relative min-w-[150px]"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1"
                            onClick={() => removeCard(card.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          {card.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Image */}
                    <TableRow>
                      <TableCell className="font-medium">Image</TableCell>
                      {cards.map((card) => (
                        <TableCell key={card.id}>
                          <img
                            src={card.image}
                            alt={card.name}
                            className="h-28 w-auto object-contain mx-auto"
                          />
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Extension */}
                    <TableRow>
                      <TableCell className="font-medium">Extension</TableCell>
                      {cards.map((card) => (
                        <TableCell key={card.id}>
                          {card.set?.name || "-"}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Rareté */}
                    <TableRow>
                      <TableCell className="font-medium">Rareté</TableCell>
                      {cards.map((card) => (
                        <TableCell key={card.id}>
                          {card.rarity || "-"}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Types */}
                    <TableRow>
                      <TableCell className="font-medium">Types</TableCell>
                      {cards.map((card) => (
                        <TableCell key={card.id}>
                          {card.types && card.types.length > 0
                            ? card.types.join(", ")
                            : "-"}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* HP */}
                    <TableRow>
                      <TableCell className="font-medium">HP</TableCell>
                      {cards.map((card) => (
                        <TableCell key={card.id}>{card.hp || "-"}</TableCell>
                      ))}
                    </TableRow>

                    {/* Illustrateur */}
                    <TableRow>
                      <TableCell className="font-medium">
                        Illustrateur
                      </TableCell>
                      {cards.map((card) => (
                        <TableCell key={card.id}>
                          {card.illustrator || "-"}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Prix */}
                    <TableRow>
                      <TableCell className="font-medium">
                        Prix du marché
                      </TableCell>
                      {cards.map((card) => (
                        <TableCell key={card.id}>
                          {card.marketPrices ? (
                            <div className="space-y-1">
                              <div>
                                <span className="font-medium">Marché:</span>{" "}
                                {card.marketPrices.market}€
                              </div>
                              <div>
                                <span className="font-medium">Min:</span>{" "}
                                {card.marketPrices.low}€
                              </div>
                              <div>
                                <span className="font-medium">Max:</span>{" "}
                                {card.marketPrices.high}€
                              </div>
                            </div>
                          ) : (
                            "Non disponible"
                          )}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Attaques - Nom */}
                    <TableRow>
                      <TableCell className="font-medium">Attaques</TableCell>
                      {cards.map((card) => (
                        <TableCell key={card.id}>
                          {card.attacks && card.attacks.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-1">
                              {card.attacks.map((attack, index) => (
                                <li key={index}>
                                  <span className="font-medium">
                                    {attack.name}
                                  </span>
                                  {attack.damage && ` - ${attack.damage}`}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "Aucune attaque"
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="destructive" onClick={clearComparison}>
              Tout effacer
            </Button>
            <Button variant="outline">Fermer</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default CardComparison;
