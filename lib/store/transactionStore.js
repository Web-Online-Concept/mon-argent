import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import useBudgetStore from './budgetStore'

// Fonction pour obtenir la clé de stockage selon le budget actif
const getStorageKey = () => {
  const activeBudget = useBudgetStore.getState().getActiveBudget()
  return `transactions_${activeBudget.id}`
}

const useTransactionStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      initialBalance: 0,

      // Ajouter une transaction
      addTransaction: (transaction) => {
        const activeBudget = useBudgetStore.getState().getActiveBudget()
        
        // Si c'est le budget principal, on ne peut pas ajouter de transactions directement
        if (activeBudget.isPrincipal) {
          alert('❌ Impossible d\'ajouter des transactions au Budget Principal.\n\nCréez un budget spécifique (Maison, Vacances, etc.) ou ajoutez vos transactions dans un budget existant.')
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

        set((state) => ({
          transactions: [newTransaction, ...state.transactions]
        }))

        return newTransaction
      },

      // Supprimer une transaction
      deleteTransaction: (id) => {
        const activeBudget = useBudgetStore.getState().getActiveBudget()
        
        if (activeBudget.isPrincipal) {
          alert('❌ Impossible de supprimer des transactions depuis le Budget Principal.\n\nAllez dans le budget spécifique pour modifier ses transactions.')
          return
        }

        set((state) => ({
          transactions: state.transactions.filter(t => t.id !== id)
        }))
      },

      // Modifier une transaction
      updateTransaction: (id, updates) => {
        const activeBudget = useBudgetStore.getState().getActiveBudget()
        
        if (activeBudget.isPrincipal) {
          alert('❌ Impossible de modifier des transactions depuis le Budget Principal.\n\nAllez dans le budget spécifique pour modifier ses transactions.')
          return
        }

        set((state) => ({
          transactions: state.transactions.map(t =>
            t.id === id ? { ...t, ...updates } : t
          )
        }))
      },

      // Définir le solde initial
      setInitialBalance: (balance) => {
        const activeBudget = useBudgetStore.getState().getActiveBudget()
        
        if (activeBudget.isPrincipal) {
          alert('❌ Le solde du Budget Principal est calculé automatiquement.\n\nModifiez les soldes initiaux des budgets individuels.')
          return
        }

        set({ initialBalance: parseFloat(balance) })
      },

      // Réinitialiser toutes les transactions
      resetTransactions: () => {
        const activeBudget = useBudgetStore.getState().getActiveBudget()
        
        if (activeBudget.isPrincipal) {
          if (confirm('⚠️ Réinitialiser TOUS les budgets ?\n\nCela supprimera toutes les transactions de tous vos budgets !')) {
            // Réinitialiser tous les budgets individuels
            const budgetStore = useBudgetStore.getState()
            const individualBudgets = budgetStore.getIndividualBudgets()
            
            individualBudgets.forEach(budget => {
              localStorage.removeItem(`transactions_${budget.id}`)
            })
            
            alert('🗑️ Tous les budgets ont été réinitialisés')
            window.location.reload()
          }
          return
        }

        set({ transactions: [] })
      },

      // Obtenir le solde actuel
      getCurrentBalance: () => {
        const activeBudget = useBudgetStore.getState().getActiveBudget()
        
        if (activeBudget.isPrincipal) {
          // Pour le budget principal, retourner la somme de tous les budgets
          return useBudgetStore.getState().getPrincipalTotal()
        }

        // Pour les budgets individuels, calculer normalement
        const { transactions, initialBalance } = get()
        return initialBalance + transactions.reduce((acc, t) => {
          return acc + (t.type === 'credit' ? t.amount : -t.amount)
        }, 0)
      },

      // Obtenir toutes les transactions (pour le budget principal)
      getAllTransactions: () => {
        const activeBudget = useBudgetStore.getState().getActiveBudget()
        
        if (activeBudget.isPrincipal) {
          // Pour le budget principal, retourner toutes les transactions de tous les budgets
          return useBudgetStore.getState().getAllTransactions()
        }

        // Pour les budgets individuels, retourner leurs propres transactions
        return get().transactions
      },

      // Forcer le rechargement des données du budget actuel
      refreshBudgetData: () => {
        const activeBudget = useBudgetStore.getState().getActiveBudget()
        
        if (activeBudget.isPrincipal) {
          // Pour le budget principal, pas de données propres à charger
          set({ transactions: [], initialBalance: 0 })
        } else {
          // Recharger les données du localStorage pour ce budget
          const storageKey = `transactions_${activeBudget.id}`
          const storedData = localStorage.getItem(storageKey)
          
          if (storedData) {
            try {
              const data = JSON.parse(storedData)
              const { transactions = [], initialBalance = 0 } = data.state || {}
              set({ transactions, initialBalance })
            } catch (error) {
              console.warn('Erreur rechargement données budget:', error)
              set({ transactions: [], initialBalance: 0 })
            }
          } else {
            set({ transactions: [], initialBalance: 0 })
          }
        }
      }
    }),
    {
      name: getStorageKey,
      // Désactiver la persistence pour le budget principal
      skipHydration: () => {
        const activeBudget = useBudgetStore.getState().getActiveBudget()
        return activeBudget.isPrincipal
      }
    }
  )
)

export default useTransactionStore