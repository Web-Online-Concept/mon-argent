import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import useBudgetStore from './budgetStore'

const useTransactionStore = create(
  persist(
    (set, get) => ({
      // Structure: { budgetId: { transactions: [], initialBalance: 0 } }
      budgetData: {
        principal: {
          transactions: [],
          initialBalance: 1000
        }
      },

      // Obtenir les données du budget actif
      getCurrentBudgetData: () => {
        const activeBudget = useBudgetStore.getState().getActiveBudget()
        const budgetData = get().budgetData
        
        if (!budgetData[activeBudget.id]) {
          // Initialiser si n'existe pas
          set((state) => ({
            budgetData: {
              ...state.budgetData,
              [activeBudget.id]: {
                transactions: [],
                initialBalance: activeBudget.isPrincipal ? 0 : 0
              }
            }
          }))
          return { transactions: [], initialBalance: activeBudget.isPrincipal ? 0 : 0 }
        }
        
        return budgetData[activeBudget.id]
      },

      // Propriétés calculées pour compatibilité
      get transactions() {
        const currentData = get().getCurrentBudgetData()
        const activeBudget = useBudgetStore.getState().getActiveBudget()
        
        if (activeBudget.isPrincipal) {
          // Pour le budget principal, agréger toutes les transactions
          const budgetData = get().budgetData
          let allTransactions = []
          
          Object.entries(budgetData).forEach(([budgetId, data]) => {
            if (budgetId !== 'principal' && data.transactions) {
              const budget = useBudgetStore.getState().budgets.find(b => b.id === budgetId)
              const transactionsWithBudget = data.transactions.map(t => ({
                ...t,
                budgetName: budget?.name || 'Budget supprimé',
                budgetIcon: budget?.icon || '❓'
              }))
              allTransactions = [...allTransactions, ...transactionsWithBudget]
            }
          })
          
          return allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date))
        }
        
        return currentData.transactions || []
      },

      get initialBalance() {
        const currentData = get().getCurrentBudgetData()
        return currentData.initialBalance || 0
      },

      // Ajouter une transaction
      addTransaction: (transaction) => {
        const activeBudget = useBudgetStore.getState().getActiveBudget()
        
        if (activeBudget.isPrincipal) {
          alert('❌ Impossible d\'ajouter des transactions au Budget Principal.\n\nCréez un budget spécifique ou utilisez un budget existant.')
          return null
        }

        const newTransaction = {
          id: Date.now(),
          type: transaction.type,
          amount: parseFloat(transaction.amount),
          category: transaction.category,
          description: transaction.description,
          date: transaction.date || new Date().toISOString(),
          isRecurring: transaction.isRecurring || false,
          recurrenceId: transaction.recurrenceId || null
        }

        set((state) => {
          const currentBudgetData = state.budgetData[activeBudget.id] || { transactions: [], initialBalance: 0 }
          
          return {
            budgetData: {
              ...state.budgetData,
              [activeBudget.id]: {
                ...currentBudgetData,
                transactions: [newTransaction, ...currentBudgetData.transactions]
              }
            }
          }
        })

        return newTransaction
      },

      // Supprimer une transaction
      deleteTransaction: (id) => {
        const activeBudget = useBudgetStore.getState().getActiveBudget()
        
        if (activeBudget.isPrincipal) {
          alert('❌ Impossible de supprimer des transactions depuis le Budget Principal.')
          return
        }

        set((state) => {
          const currentBudgetData = state.budgetData[activeBudget.id] || { transactions: [], initialBalance: 0 }
          
          return {
            budgetData: {
              ...state.budgetData,
              [activeBudget.id]: {
                ...currentBudgetData,
                transactions: currentBudgetData.transactions.filter(t => t.id !== id)
              }
            }
          }
        })
      },

      // Modifier une transaction
      updateTransaction: (id, updates) => {
        const activeBudget = useBudgetStore.getState().getActiveBudget()
        
        if (activeBudget.isPrincipal) {
          alert('❌ Impossible de modifier des transactions depuis le Budget Principal.')
          return
        }

        set((state) => {
          const currentBudgetData = state.budgetData[activeBudget.id] || { transactions: [], initialBalance: 0 }
          
          return {
            budgetData: {
              ...state.budgetData,
              [activeBudget.id]: {
                ...currentBudgetData,
                transactions: currentBudgetData.transactions.map(t =>
                  t.id === id ? { ...t, ...updates } : t
                )
              }
            }
          }
        })
      },

      // Définir le solde initial
      setInitialBalance: (balance) => {
        const activeBudget = useBudgetStore.getState().getActiveBudget()
        
        if (activeBudget.isPrincipal) {
          alert('❌ Le solde du Budget Principal est calculé automatiquement.')
          return
        }

        set((state) => {
          const currentBudgetData = state.budgetData[activeBudget.id] || { transactions: [], initialBalance: 0 }
          
          return {
            budgetData: {
              ...state.budgetData,
              [activeBudget.id]: {
                ...currentBudgetData,
                initialBalance: parseFloat(balance)
              }
            }
          }
        })
      },

      // Réinitialiser les transactions
      resetTransactions: () => {
        const activeBudget = useBudgetStore.getState().getActiveBudget()
        
        if (activeBudget.isPrincipal) {
          if (confirm('⚠️ Réinitialiser TOUS les budgets ?')) {
            set({ budgetData: { principal: { transactions: [], initialBalance: 0 } } })
            alert('🗑️ Tous les budgets ont été réinitialisés')
          }
          return
        }

        set((state) => ({
          budgetData: {
            ...state.budgetData,
            [activeBudget.id]: { transactions: [], initialBalance: 0 }
          }
        }))
      },

      // Obtenir le solde actuel
      getCurrentBalance: () => {
        const activeBudget = useBudgetStore.getState().getActiveBudget()
        
        if (activeBudget.isPrincipal) {
          // Calculer la somme de tous les budgets
          const budgetData = get().budgetData
          let total = 0
          
          Object.entries(budgetData).forEach(([budgetId, data]) => {
            if (budgetId !== 'principal' && data) {
              const balance = data.initialBalance + (data.transactions || []).reduce((acc, t) => {
                return acc + (t.type === 'credit' ? t.amount : -t.amount)
              }, 0)
              total += balance
            }
          })
          
          return total
        }

        const currentData = get().getCurrentBudgetData()
        return currentData.initialBalance + currentData.transactions.reduce((acc, t) => {
          return acc + (t.type === 'credit' ? t.amount : -t.amount)
        }, 0)
      },

      // Supprimer un budget (appelé depuis budgetStore)
      deleteBudgetData: (budgetId) => {
        set((state) => {
          const newBudgetData = { ...state.budgetData }
          delete newBudgetData[budgetId]
          return { budgetData: newBudgetData }
        })
      }
    }),
    {
      name: 'budget-transactions-v2'
    }
  )
)

export default useTransactionStore