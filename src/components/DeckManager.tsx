import React, { useState } from "react";
import { useDecks } from "@/contexts/DeckContext";
import { PokemonCard, PokemonDeck } from "@/types/pokemon";
import { Album, BookPlus, Folders, Plus, Share2, Trash2 } from "lucide-react";
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DeckManagerProps {
  onViewCard: (card: PokemonCard) => void;
}

const DeckManager: React.FC<DeckManagerProps> = ({ onViewCard }) => {
  const { decks, createDeck, updateDeck, deleteDeck, getDeckById } = useDecks();
  const [newDeckName, setNewDeckName] = useState("");
  const [newDeckDescription, setNewDeckDescription] = useState("");
  const [selectedDeck, setSelectedDeck] = useState<PokemonDeck | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editDeckName, setEditDeckName] = useState("");
  const [editDeckDescription, setEditDeckDescription] = useState("");

  const handleCreateDeck = () => {
    if (newDeckName.trim()) {
      createDeck(newDeckName.trim(), newDeckDescription.trim());
      setNewDeckName("");
      setNewDeckDescription("");
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditDeck = () => {
    if (selectedDeck && editDeckName.trim()) {
      updateDeck({
        ...selectedDeck,
        name: editDeckName.trim(),
        description: editDeckDescription.trim(),
      });
      setIsEditDialogOpen(false);
    }
  };

  const handleOpenEditDialog = (deck: PokemonDeck) => {
    setSelectedDeck(deck);
    setEditDeckName(deck.name);
    setEditDeckDescription(deck.description);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDeck = (deckId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce deck ?")) {
      deleteDeck(deckId);
      if (selectedDeck?.id === deckId) {
        setSelectedDeck(null);
      }
    }
  };

  const handleSelectDeck = (deck: PokemonDeck) => {
    setSelectedDeck(deck);
  };

  const renderDeckCards = () => {
    if (!selectedDeck) return null;

    const deck = getDeckById(selectedDeck.id);
    if (!deck) return null;

    if (deck.cards.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Ce deck ne contient pas encore de cartes.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Ajoutez des cartes à partir de la recherche.
          </p>
        </div>
      );
    }

    // Ici, on devrait récupérer les informations complètes des cartes
    // Comme c'est un exemple, nous affichons simplement les IDs
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Cartes dans ce deck</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deck.cards.map((card) => (
              <TableRow key={card.cardId}>
                <TableCell className="font-medium">{card.cardId}</TableCell>
                <TableCell>{card.quantity}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Voir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Folders className="h-4 w-4" />
            <span>Mes Decks ({decks.length})</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Mes Decks Pokémon</DrawerTitle>
            <DrawerDescription>
              Créez et gérez vos decks personnalisés de cartes Pokémon.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4">
            <div className="flex justify-end mb-4">
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Nouveau Deck</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer un nouveau deck</DialogTitle>
                    <DialogDescription>
                      Donnez un nom et une description à votre nouveau deck
                      Pokémon.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="deck-name">Nom du deck</Label>
                      <Input
                        id="deck-name"
                        placeholder="Ex: Mon deck Pikachu"
                        value={newDeckName}
                        onChange={(e) => setNewDeckName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deck-description">
                        Description (optionnelle)
                      </Label>
                      <Textarea
                        id="deck-description"
                        placeholder="Décrivez votre deck..."
                        value={newDeckDescription}
                        onChange={(e) => setNewDeckDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button onClick={handleCreateDeck}>Créer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs defaultValue="list">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">Liste</TabsTrigger>
                <TabsTrigger value="cards" disabled={!selectedDeck}>
                  Cartes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="list">
                <ScrollArea className="h-[60vh]">
                  {decks.length === 0 ? (
                    <div className="text-center py-10">
                      <Album className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium">Aucun deck</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Vous n'avez pas encore créé de deck. Commencez par en
                        créer un !
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                      {decks.map((deck) => (
                        <Card
                          key={deck.id}
                          className={`overflow-hidden ${
                            selectedDeck?.id === deck.id
                              ? "ring-2 ring-primary"
                              : ""
                          }`}
                        >
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-base">
                              {deck.name}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {new Date(deck.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {deck.description || "Pas de description"}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {deck.cards.length} carte(s)
                            </p>
                          </CardContent>
                          <CardFooter className="p-4 pt-2 flex justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSelectDeck(deck)}
                            >
                              Voir le deck
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                  >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="19" cy="12" r="1" />
                                    <circle cx="5" cy="12" r="1" />
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleOpenEditDialog(deck)}
                                >
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteDeck(deck.id)}
                                >
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="cards">
                <ScrollArea className="h-[60vh]">
                  {selectedDeck && (
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold">
                            {selectedDeck.name}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {selectedDeck.description}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Share2 className="h-4 w-4" />
                          <span>Partager</span>
                        </Button>
                      </div>

                      {renderDeckCards()}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Fermer</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Dialog pour modifier un deck */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le deck</DialogTitle>
            <DialogDescription>
              Modifiez les informations de votre deck Pokémon.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-deck-name">Nom du deck</Label>
              <Input
                id="edit-deck-name"
                value={editDeckName}
                onChange={(e) => setEditDeckName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-deck-description">Description</Label>
              <Textarea
                id="edit-deck-description"
                value={editDeckDescription}
                onChange={(e) => setEditDeckDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleEditDeck}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeckManager;
