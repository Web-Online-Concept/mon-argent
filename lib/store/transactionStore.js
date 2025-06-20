import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useTransactionStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      initialBalance: 1000,

      // Ajouter une transaction
      addTransaction: (transaction) => {
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
        set((state) => ({
          transactions: state.transactions.filter(t => t.id !== id)
        }))
      },

      // Modifier une transaction
      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map(t =>
            t.id === id ? { ...t, ...updates } : t
          )
        }))
      },

      // Définir le solde initial
      setInitialBalance: (balance) => {
        set({ initialBalance: parseFloat(balance) })
      },

      // Réinitialiser toutes les transactions
      resetTransactions: () => {
        set({ transactions: [] })
      },

      // Obtenir le solde actuel
      getCurrentBalance: () => {
        const { transactions, initialBalance } = get()
        return initialBalance + transactions.reduce((acc, t) => {
          return acc + (t.type === 'credit' ? t.amount : -t.amount)
        }, 0)
      }
    }),
    {
      name: 'budget-transactions'
    }
  )
)

export default useTransactionStore