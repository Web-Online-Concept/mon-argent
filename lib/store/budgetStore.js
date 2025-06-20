import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useBudgetStore = create(
  persist(
    (set, get) => ({
      budgets: [
        { id: 'main', name: 'Budget Principal', icon: '🏦', isMain: true },
        { id: 'budget-default', name: 'Mon Budget', icon: '💰' }
      ],
      currentBudgetId: 'budget-default', // Par défaut on sélectionne le budget normal, pas le principal
      
      // Obtenir le budget actuel
      getCurrentBudget: () => {
        const state = get();
        return state.budgets.find(b => b.id === state.currentBudgetId) || state.budgets[1];
      },
      
      // Changer de budget
      setCurrentBudget: (budgetId) => {
        const state = get();
        const budget = state.budgets.find(b => b.id === budgetId);
        if (budget) {
          set({ currentBudgetId: budgetId });
        }
      },
      
      // Ajouter un nouveau budget
      addBudget: (name, icon = '💼') => {
        const newBudget = {
          id: `budget-${Date.now()}`,
          name,
          icon,
          isMain: false
        };
        
        set((state) => ({
          budgets: [...state.budgets, newBudget]
        }));
        
        return newBudget;
      },
      
      // Mettre à jour un budget
      updateBudget: (id, updates) => {
        // On ne peut pas modifier le budget principal
        if (id === 'main') {
          console.error('Cannot update main budget');
          return;
        }
        
        set((state) => ({
          budgets: state.budgets.map(b =>
            b.id === id ? { ...b, ...updates } : b
          )
        }));
      },
      
      // Supprimer un budget
      deleteBudget: (id) => {
        // On ne peut pas supprimer le budget principal ni le budget par défaut
        if (id === 'main' || id === 'budget-default') {
          console.error('Cannot delete main or default budget');
          return;
        }
        
        const state = get();
        
        // Si on supprime le budget actuel, on revient au budget par défaut
        if (state.currentBudgetId === id) {
          set({ currentBudgetId: 'budget-default' });
        }
        
        set((state) => ({
          budgets: state.budgets.filter(b => b.id !== id)
        }));
        
        // Nettoyer les données associées
        // Cela sera fait dans les autres stores
      },
      
      // Obtenir tous les budgets sauf le principal (pour certains affichages)
      getNonMainBudgets: () => {
        const state = get();
        return state.budgets.filter(b => !b.isMain);
      },
      
      // Vérifier si on est sur le budget principal
      isMainBudget: () => {
        const state = get();
        return state.currentBudgetId === 'main';
      },
      
      // Réinitialiser les budgets
      resetBudgets: () => {
        set({
          budgets: [
            { id: 'main', name: 'Budget Principal', icon: '🏦', isMain: true },
            { id: 'budget-default', name: 'Mon Budget', icon: '💰' }
          ],
          currentBudgetId: 'budget-default'
        });
      }
    }),
    {
      name: 'budget-storage',
      version: 2,
      migrate: (persistedState, version) => {
        if (version < 2) {
          // S'assurer que le budget principal existe toujours
          const budgets = persistedState.budgets || [];
          const hasMainBudget = budgets.some(b => b.id === 'main');
          
          if (!hasMainBudget) {
            budgets.unshift({ 
              id: 'main', 
              name: 'Budget Principal', 
              icon: '🏦', 
              isMain: true 
            });
          }
          
          // S'assurer qu'il y a au moins un budget normal
          const hasNormalBudget = budgets.some(b => !b.isMain);
          if (!hasNormalBudget) {
            budgets.push({ 
              id: 'budget-default', 
              name: 'Mon Budget', 
              icon: '💰' 
            });
          }
          
          return {
            ...persistedState,
            budgets,
            currentBudgetId: persistedState.currentBudgetId || 'budget-default'
          };
        }
        
        return persistedState;
      }
    }
  )
);

export default useBudgetStore;