import React from "react";
import { useSearchHistory } from "@/contexts/SearchHistoryContext";
import { Clock, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SearchHistoryProps {
  onSearchAgain: (query: string) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ onSearchAgain }) => {
  const { searchHistory, clearHistory, removeSearchItem } = useSearchHistory();

  if (searchHistory.length === 0) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Clock className="h-4 w-4" />
            <span>Historique</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Historique des recherches</DrawerTitle>
            <DrawerDescription>
              Vous n'avez pas encore effectué de recherche.
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
          <Clock className="h-4 w-4" />
          <span>Historique ({searchHistory.length})</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex justify-between items-start">
          <div>
            <DrawerTitle>Historique des recherches</DrawerTitle>
            <DrawerDescription>
              Vos {searchHistory.length} dernières recherches.
            </DrawerDescription>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={clearHistory}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Effacer tout</span>
          </Button>
        </DrawerHeader>

        <ScrollArea className="h-[60vh] px-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recherche</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Résultats</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.query}</TableCell>
                  <TableCell>
                    {format(item.timestamp, "dd MMM yyyy HH:mm", {
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell>
                    {item.resultCount > 0 ? (
                      <Badge variant="outline" className="bg-green-50">
                        {item.resultCount} carte(s)
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-600"
                      >
                        Aucune carte
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSearchAgain(item.query)}
                        title="Rechercher à nouveau"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSearchItem(item.id)}
                        title="Supprimer"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

export default SearchHistory;
