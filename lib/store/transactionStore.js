import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTransactionStore = create(
  persist(
    (set, get) => ({
      // Structure multi-budgets : { budgetId: [transactions] }
      transactionsByBudget: {},
      
      // Migration des anciennes données au premier chargement
      migrateOldData: (oldTransactions) => {
        if (Array.isArray(oldTransactions) && oldTransactions.length > 0) {
          // Migrer toutes les anciennes transactions vers le budget principal
          set((state) => ({
            transactionsByBudget: {
              ...state.transactionsByBudget,
              'main': oldTransactions.map(t => ({ ...t, budgetId: 'main' }))
            }
          }));
        }
      },

      // Obtenir les transactions du budget actuel (ou toutes pour le budget principal)
      getTransactions: (budgetId) => {
        const state = get();
        
        // Si c'est le budget principal, on agrège toutes les transactions
        if (budgetId === 'main') {
          const allTransactions = [];
          Object.entries(state.transactionsByBudget).forEach(([bId, transactions]) => {
            if (bId !== 'main') { // Éviter la duplication
              allTransactions.push(...transactions);
            }
          });
          return allTransactions;
        }
        
        // Sinon, retourner les transactions du budget spécifique
        return state.transactionsByBudget[budgetId] || [];
      },

      // Ajouter une transaction
      addTransaction: (transaction, budgetId) => {
        if (!budgetId || budgetId === 'main') {
          console.error('Cannot add transaction directly to main budget');
          return;
        }

        const newTransaction = {
          ...transaction,
          id: Date.now().toString(),
          budgetId,
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          transactionsByBudget: {
            ...state.transactionsByBudget,
            [budgetId]: [...(state.transactionsByBudget[budgetId] || []), newTransaction]
          }
        }));
      },

      // Mettre à jour une transaction
      updateTransaction: (id, updates, budgetId) => {
        if (!budgetId || budgetId === 'main') {
          console.error('Cannot update transaction in main budget');
          return;
        }

        set((state) => ({
          transactionsByBudget: {
            ...state.transactionsByBudget,
            [budgetId]: (state.transactionsByBudget[budgetId] || []).map(t =>
              t.id === id ? { ...t, ...updates } : t
            )
          }
        }));
      },

      // Supprimer une transaction
      deleteTransaction: (id, budgetId) => {
        if (!budgetId || budgetId === 'main') {
          console.error('Cannot delete transaction from main budget');
          return;
        }

        set((state) => ({
          transactionsByBudget: {
            ...state.transactionsByBudget,
            [budgetId]: (state.transactionsByBudget[budgetId] || []).filter(t => t.id !== id)
          }
        }));
      },

      // Supprimer toutes les transactions d'un budget
      clearTransactions: (budgetId) => {
        if (!budgetId || budgetId === 'main') {
          console.error('Cannot clear main budget transactions');
          return;
        }

        set((state) => ({
          transactionsByBudget: {
            ...state.transactionsByBudget,
            [budgetId]: []
          }
        }));
      },

      // Calculer le solde total d'un budget
      getBalance: (budgetId) => {
        const transactions = get().getTransactions(budgetId);
        return transactions.reduce((sum, t) => {
          return t.type === 'income' ? sum + t.amount : sum - t.amount;
        }, 0);
      },

      // Obtenir les statistiques d'un budget
      getStats: (budgetId, period = 'month') => {
        const transactions = get().getTransactions(budgetId);
        const now = new Date();
        
        let filteredTransactions = transactions;
        
        if (period === 'month') {
          filteredTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === now.getMonth() &&
                   transactionDate.getFullYear() === now.getFullYear();
          });
        } else if (period === 'year') {
          filteredTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getFullYear() === now.getFullYear();
          });
        }

        const income = filteredTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
          
        const expenses = filteredTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          income,
          expenses,
          balance: income - expenses,
          transactionCount: filteredTransactions.length
        };
      },

      // Obtenir les transactions par catégorie
      getTransactionsByCategory: (budgetId, categoryId) => {
        const transactions = get().getTransactions(budgetId);
        return transactions.filter(t => t.categoryId === categoryId);
      },

      // Rechercher des transactions
      searchTransactions: (budgetId, query) => {
        const transactions = get().getTransactions(budgetId);
        const searchTerm = query.toLowerCase();
        
        return transactions.filter(t => 
          t.description?.toLowerCase().includes(searchTerm) ||
          t.amount.toString().includes(searchTerm)
        );
      },

      // Supprimer toutes les données d'un budget spécifique
      deleteBudgetData: (budgetId) => {
        if (budgetId === 'main') {
          console.error('Cannot delete main budget data');
          return;
        }

        set((state) => {
          const newState = { ...state.transactionsByBudget };
          delete newState[budgetId];
          return { transactionsByBudget: newState };
        });
      }
    }),
    {
      name: 'transaction-storage',
      version: 2, // Nouvelle version pour forcer la migration
      migrate: (persistedState, version) => {
        if (version < 2) {
          // Migration depuis l'ancienne structure
          const oldTransactions = persistedState.transactions || [];
          const newState = {
            transactionsByBudget: {}
          };
          
          if (oldTransactions.length > 0) {
            // Placer toutes les anciennes transactions dans un budget par défaut
            newState.transactionsByBudget['budget-default'] = oldTransactions.map(t => ({
              ...t,
              budgetId: 'budget-default'
            }));
          }
          
          return newState;
        }
        
        return persistedState;
      }
    }
  )
);

export default useTransactionStore;