import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePokedex } from "@/contexts/PokedexContext";
import { UserPokemonCard } from "@/lib/supabase";
import { Trash2, Edit3, BookOpen, Plus, Minus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function UserPokedex() {
  const {
    userCards,
    loading,
    removeCardFromPokedex,
    updateCardInPokedex,
    totalCards,
    uniqueCards,
  } = usePokedex();
  const [editingCard, setEditingCard] = useState<UserPokemonCard | null>(null);
  const [editForm, setEditForm] = useState({ quantity: 1, notes: "" });

  const handleEditCard = (card: UserPokemonCard) => {
    setEditingCard(card);
    setEditForm({ quantity: card.quantity, notes: card.notes || "" });
  };

  const handleUpdateCard = async () => {
    if (!editingCard) return;

    const success = await updateCardInPokedex(editingCard.id, {
      quantity: editForm.quantity,
      notes: editForm.notes,
    });

    if (success) {
      setEditingCard(null);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (
      confirm(
        "Êtes-vous sûr de vouloir supprimer cette carte de votre pokédx ?"
      )
    ) {
      await removeCardFromPokedex(cardId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <BookOpen className="w-4 h-4 mr-2" />
          Mon Pokédex
          {totalCards > 0 && (
            <Badge variant="secondary" className="ml-2">
              {totalCards}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-lg sm:text-xl">Mon Pokédex</span>
            <div className="text-sm text-muted-foreground">
              {uniqueCards} cartes uniques • {totalCards} cartes au total
            </div>
          </DialogTitle>
        </DialogHeader>

        {userCards.length === 0 ? (
          <div className="text-center py-8 px-4">
            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Votre pokédex est vide
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Commencez à ajouter des cartes à votre collection en cliquant sur
              le bouton "+" sur les cartes que vous trouvez !
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {userCards.map((card) => (
              <Card key={card.id} className="relative">
                <div className="absolute top-2 right-2 flex gap-1 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCard(card)}
                    className="h-8 w-8 p-0 bg-white/80 hover:bg-white/90 backdrop-blur-sm"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCard(card.card_id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive bg-white/80 hover:bg-white/90 backdrop-blur-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-sm sm:text-base truncate pr-16">
                    {card.card_name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex justify-center">
                    {card.card_image_url ? (
                      <img
                        src={card.card_image_url}
                        alt={card.card_name}
                        className="w-20 h-28 sm:w-24 sm:h-32 object-contain rounded shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-20 h-28 sm:w-24 sm:h-32 bg-gray-100 rounded flex items-center justify-center ${
                        card.card_image_url ? "hidden" : ""
                      }`}
                    >
                      <div className="text-center text-gray-400">
                        <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1" />
                        <span className="text-xs">Pas d'image</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        Quantité:
                      </span>
                      <Badge variant="outline">{card.quantity}</Badge>
                    </div>

                    {card.card_set && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          Set:
                        </span>
                        <span className="text-xs sm:text-sm truncate max-w-16 sm:max-w-24">
                          {card.card_set}
                        </span>
                      </div>
                    )}

                    {card.card_rarity && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          Rareté:
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {card.card_rarity}
                        </Badge>
                      </div>
                    )}

                    {card.hp && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          HP:
                        </span>
                        <span className="text-xs sm:text-sm font-bold">
                          {card.hp}
                        </span>
                      </div>
                    )}

                    {card.market_price && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          Prix:
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-green-600">
                          ${card.market_price}
                        </span>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Ajoutée{" "}
                      {formatDistanceToNow(new Date(card.added_at), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </div>

                    {card.notes && (
                      <div className="pt-2 border-t">
                        <p className="text-xs sm:text-sm text-muted-foreground italic">
                          "{card.notes}"
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal d'édition */}
        {editingCard && (
          <Dialog
            open={!!editingCard}
            onOpenChange={() => setEditingCard(null)}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Modifier {editingCard.card_name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Quantité</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditForm((prev) => ({
                          ...prev,
                          quantity: Math.max(1, prev.quantity - 1),
                        }))
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={editForm.quantity}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          quantity: Math.max(1, parseInt(e.target.value) || 1),
                        }))
                      }
                      className="w-20 text-center"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditForm((prev) => ({
                          ...prev,
                          quantity: prev.quantity + 1,
                        }))
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    placeholder="Ajoutez des notes sur cette carte..."
                    value={editForm.notes}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className="min-h-[80px]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingCard(null)}
                    className="w-full sm:w-auto"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleUpdateCard}
                    className="w-full sm:w-auto"
                  >
                    Sauvegarder
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
