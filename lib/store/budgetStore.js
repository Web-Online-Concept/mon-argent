import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useBudgetStore = create(
  persist(
    (set, get) => ({
      budgets: [
        {
          id: 'default',
          name: 'Mon Budget Principal',
          icon: '💰',
          createdAt: new Date().toISOString()
        }
      ],
      activeBudgetId: 'default',

      // Créer un nouveau budget
      createBudget: (name, icon = '💼') => {
        const newBudget = {
          id: `budget_${Date.now()}`,
          name: name.trim(),
          icon,
          createdAt: new Date().toISOString()
        }
        
        set((state) => ({
          budgets: [...state.budgets, newBudget]
        }))
        
        return newBudget
      },

      // Supprimer un budget
      deleteBudget: (id) => {
        if (id === 'default') {
          alert('❌ Impossible de supprimer le budget principal')
          return false
        }

        if (get().activeBudgetId === id) {
          set({ activeBudgetId: 'default' })
        }

        set((state) => ({
          budgets: state.budgets.filter(b => b.id !== id)
        }))
        
        return true
      },

      // Changer de budget actif
      setActiveBudget: (id) => {
        const budget = get().budgets.find(b => b.id === id)
        if (budget) {
          set({ activeBudgetId: id })
          // Note: Pour l'instant, pas de rechargement automatique
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
      }
    }),
    {
      name: 'budget-manager'
    }
  )
)

export default useBudgetStore