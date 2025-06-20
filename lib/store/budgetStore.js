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
          isPrincipal: true // Nouveau flag pour identifier le budget principal
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
        
        // Initialiser le stockage vide pour ce nouveau budget
        const storageKey = `transactions_${newBudget.id}`
        const initialData = {
          state: {
            transactions: [],
            initialBalance: 0
          },
          version: 0
        }
        localStorage.setItem(storageKey, JSON.stringify(initialData))
        
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

        // Supprimer les données de stockage de ce budget
        localStorage.removeItem(`transactions_${id}`)
        localStorage.removeItem(`categories_${id}`)
        localStorage.removeItem(`recurrences_${id}`)
        
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
      },

      // Calculer le total de tous les budgets individuels
      getPrincipalTotal: () => {
        const individualBudgets = get().getIndividualBudgets()
        let total = 0

        individualBudgets.forEach(budget => {
          const storageKey = `transactions_${budget.id}`
          const storedData = localStorage.getItem(storageKey)
          
          if (storedData) {
            try {
              const data = JSON.parse(storedData)
              const { transactions = [], initialBalance = 0 } = data.state || {}
              
              const budgetBalance = initialBalance + transactions.reduce((acc, t) => {
                return acc + (t.type === 'credit' ? t.amount : -t.amount)
              }, 0)
              
              total += budgetBalance
            } catch (error) {
              console.warn(`Erreur lecture budget ${budget.name}:`, error)
            }
          }
        })

        return total
      },

      // Obtenir toutes les transactions de tous les budgets (pour le principal)
      getAllTransactions: () => {
        const individualBudgets = get().getIndividualBudgets()
        let allTransactions = []

        individualBudgets.forEach(budget => {
          const storageKey = `transactions_${budget.id}`
          const storedData = localStorage.getItem(storageKey)
          
          if (storedData) {
            try {
              const data = JSON.parse(storedData)
              const { transactions = [] } = data.state || {}
              
              // Ajouter le nom du budget à chaque transaction
              const transactionsWithBudget = transactions.map(t => ({
                ...t,
                budgetName: budget.name,
                budgetIcon: budget.icon
              }))
              
              allTransactions = [...allTransactions, ...transactionsWithBudget]
            } catch (error) {
              console.warn(`Erreur lecture transactions budget ${budget.name}:`, error)
            }
          }
        })

        // Trier par date (plus récent en premier)
        return allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date))
      }
    }),
    {
      name: 'budget-manager',
    }
  )
)

export default useBudgetStore