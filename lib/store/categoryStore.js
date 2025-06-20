import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import useBudgetStore from './budgetStore'

const DEFAULT_CATEGORIES = [
  'Courses', 'Restaurant', 'Transport', 'Logement', 'Salaire', 
  'Casino/Jeux', 'Télécom', 'Santé', 'Vêtements', 'Loisirs', 'Autre'
]

const useCategoryStore = create(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,

      // Ajouter une catégorie
      addCategory: (category) => {
        const normalized = category.trim()
        const categories = get().categories
        
        if (!categories.includes(normalized)) {
          set({ categories: [...categories, normalized] })
          return true
        }
        return false
      },

      // Supprimer une catégorie
      deleteCategory: (category) => {
        set((state) => ({
          categories: state.categories.filter(c => c !== category)
        }))
      },

      // Obtenir toutes les catégories
      getAllCategories: () => {
        return [...get().categories].sort()
      },

      // Détecter la catégorie depuis une description
      getCategoryFromDescription: (description) => {
        const desc = description.toLowerCase()
        
        if (desc.includes('course') || desc.includes('supermarché') || desc.includes('leclerc') || desc.includes('carrefour')) {
          return 'Courses'
        }
        if (desc.includes('restaurant') || desc.includes('resto') || desc.includes('repas') || desc.includes('déjeuner')) {
          return 'Restaurant'
        }
        if (desc.includes('transport') || desc.includes('essence') || desc.includes('métro') || desc.includes('bus')) {
          return 'Transport'
        }
        if (desc.includes('loyer') || desc.includes('électricité') || desc.includes('gaz') || desc.includes('eau')) {
          return 'Logement'
        }
        if (desc.includes('salaire') || desc.includes('paie') || desc.includes('paye') || desc.includes('prime')) {
          return 'Salaire'
        }
        if (desc.includes('casino') || desc.includes('jeu') || desc.includes('pari') || desc.includes('loto')) {
          return 'Casino/Jeux'
        }
        if (desc.includes('téléphone') || desc.includes('internet') || desc.includes('mobile') || desc.includes('sfr')) {
          return 'Télécom'
        }
        if (desc.includes('médecin') || desc.includes('pharmacie') || desc.includes('dentiste') || desc.includes('santé')) {
          return 'Santé'
        }
        if (desc.includes('vêtement') || desc.includes('habit') || desc.includes('chaussure') || desc.includes('zara')) {
          return 'Vêtements'
        }
        if (desc.includes('cinéma') || desc.includes('sport') || desc.includes('loisir') || desc.includes('sortie')) {
          return 'Loisirs'
        }
        
        return 'Autre'
      }
    }),
    {
      name: () => {
        const prefix = useBudgetStore.getState().getStoragePrefix()
        return `${prefix}budget-categories`
      },
    }
  )
)

export default useCategoryStore