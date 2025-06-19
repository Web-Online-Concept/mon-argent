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

        // Supprimer les données associées
        const budgetKey = `budget_${id}_`
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(budgetKey)) {
            localStorage.removeItem(key)
          }
        })

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

      // Obtenir le préfixe de stockage pour le budget actif
      getStoragePrefix: () => {
        const activeBudget = get().getActiveBudget()
        return activeBudget.id === 'default' ? '' : `budget_${activeBudget.id}_`
      }
    }),
    {
      name: 'budget-manager',
    }
  )
)

export default useBudgetStore