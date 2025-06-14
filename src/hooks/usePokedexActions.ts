import { useState } from 'react'
import { usePokedex } from '@/contexts/PokedexContext'
import { useAuth } from '@/contexts/AuthContext'
import { PokemonCard } from '@/types/pokemon'
import { useToast } from '@/hooks/use-toast'

export const usePokedexActions = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const { user } = useAuth()
    const { addCardToPokedex, isCardInPokedex, getCardFromPokedex } = usePokedex()
    const { toast } = useToast()

    const handleAddCard = async (card: PokemonCard, quantity = 1, notes = '') => {
        if (!user) {
            toast({
                title: "Connexion requise",
                description: "Vous devez être connecté pour ajouter des cartes à votre pokédex",
                variant: "destructive"
            })
            setIsAuthModalOpen(true)
            return false
        }

        return await addCardToPokedex(card, quantity, notes)
    }

    const getCardStatus = (cardId: string) => {
        const isInPokedex = isCardInPokedex(cardId)
        const cardInPokedex = getCardFromPokedex(cardId)

        return {
            isInPokedex,
            quantity: cardInPokedex?.quantity || 0,
            notes: cardInPokedex?.notes || ''
        }
    }

    return {
        handleAddCard,
        getCardStatus,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAuthenticated: !!user
    }
}

export default usePokedexActions 