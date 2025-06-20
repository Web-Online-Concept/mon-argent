import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useBudgetStore = create(
  persist(
    (set, get) => ({
      budgets: [
        {
          id: 'principal',
          name: 'Budget Principal',
          icon: '💰',
          createdAt: new Date().toISOString(),
          isPrincipal: true
        }
      ],
      activeBudgetId: 'principal',

      // Créer un nouveau budget
      createBudget: (name, icon = '💼') => {
        const newBudget = {
          id: `budget_${Date.now()}`,
          name: name.trim(),
          icon,
          createdAt: new Date().toISOString(),
          isPrincipal: false
        }
        
        set((state) => ({
          budgets: [...state.budgets, newBudget]
        }))
        
        return newBudget
      },

      // Supprimer un budget
      deleteBudget: (id) => {
        if (id === 'principal') {
          alert('❌ Impossible de supprimer le budget principal')
          return false
        }

        const budgetToDelete = get().budgets.find(b => b.id === id)
        if (!budgetToDelete) return false

        if (get().activeBudgetId === id) {
          set({ activeBudgetId: 'principal' })
        }

        set((state) => ({
          budgets: state.budgets.filter(b => b.id !== id)
        }))

        // Informer le transactionStore de supprimer les données
        setTimeout(() => {
          const useTransactionStore = require('./transactionStore').default
          useTransactionStore.getState().deleteBudgetData(id)
        }, 100)
        
        return true
      },

      // Changer de budget actif
      setActiveBudget: (id) => {
        const budget = get().budgets.find(b => b.id === id)
        if (budget) {
          set({ activeBudgetId: id })
          // Recharger pour appliquer le nouveau contexte
          window.location.reload()
        }
      },

      // Renommer un budget
      renameBudget: (id, newName) => {
        set((state) => ({
          budgets: state.budgets.map(b =>
            b.id === id ? { ...b, name: newName.trim() } : b
          )
        }))
      },

      // Obtenir le budget actif
      getActiveBudget: () => {
        const { budgets, activeBudgetId } = get()
        return budgets.find(b => b.id === activeBudgetId) || budgets[0]
      },

      // Obtenir tous les budgets non-principaux
      getIndividualBudgets: () => {
        const { budgets } = get()
        return budgets.filter(b => !b.isPrincipal)
      }
    }),
    {
      name: 'budget-manager-v2',
    }
  )
)

export default useBudgetStore