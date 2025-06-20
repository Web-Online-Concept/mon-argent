import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultCategories = [
  // Catégories de dépenses
  { id: 'cat-1', name: 'Alimentation', icon: '🛒', type: 'expense' },
  { id: 'cat-2', name: 'Transport', icon: '🚗', type: 'expense' },
  { id: 'cat-3', name: 'Logement', icon: '🏠', type: 'expense' },
  { id: 'cat-4', name: 'Santé', icon: '🏥', type: 'expense' },
  { id: 'cat-5', name: 'Loisirs', icon: '🎮', type: 'expense' },
  { id: 'cat-6', name: 'Shopping', icon: '🛍️', type: 'expense' },
  { id: 'cat-7', name: 'Restaurants', icon: '🍽️', type: 'expense' },
  { id: 'cat-8', name: 'Abonnements', icon: '📱', type: 'expense' },
  { id: 'cat-9', name: 'Éducation', icon: '📚', type: 'expense' },
  { id: 'cat-10', name: 'Autres', icon: '📝', type: 'expense' },
  
  // Catégories de revenus
  { id: 'cat-11', name: 'Salaire', icon: '💰', type: 'income' },
  { id: 'cat-12', name: 'Freelance', icon: '💼', type: 'income' },
  { id: 'cat-13', name: 'Investissements', icon: '📈', type: 'income' },
  { id: 'cat-14', name: 'Remboursements', icon: '💸', type: 'income' },
  { id: 'cat-15', name: 'Cadeaux', icon: '🎁', type: 'income' },
  { id: 'cat-16', name: 'Autres revenus', icon: '💵', type: 'income' }
];

const useCategoryStore = create(
  persist(
    (set, get) => ({
      categories: defaultCategories,
      
      // Ajouter une catégorie
      addCategory: (category) => {
        const newCategory = {
          ...category,
          id: `cat-${Date.now()}`
        };
        
        set((state) => ({
          categories: [...state.categories, newCategory]
        }));
        
        return newCategory;
      },
      
      // Mettre à jour une catégorie
      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map(cat =>
            cat.id === id ? { ...cat, ...updates } : cat
          )
        }));
      },
      
      // Supprimer une catégorie
      deleteCategory: (id) => {
        // Ne pas supprimer les catégories par défaut
        const category = get().categories.find(cat => cat.id === id);
        if (category && defaultCategories.some(dc => dc.id === category.id)) {
          console.error('Cannot delete default category');
          return;
        }
        
        set((state) => ({
          categories: state.categories.filter(cat => cat.id !== id)
        }));
      },
      
      // Obtenir une catégorie par ID
      getCategoryById: (id) => {
        return get().categories.find(cat => cat.id === id);
      },
      
      // Obtenir les catégories par type
      getCategoriesByType: (type) => {
        return get().categories.filter(cat => cat.type === type);
      },
      
      // Réinitialiser les catégories
      resetCategories: () => {
        set({ categories: defaultCategories });
      }
    }),
    {
      name: 'category-storage',
      version: 1
    }
  )
);

export default useCategoryStore;