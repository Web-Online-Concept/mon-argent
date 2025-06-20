import { useState, useMemo } from 'react';
import useTransactionStore from '../../lib/store/transactionStore';
import useCategoryStore from '../../lib/store/categoryStore';
import useBudgetStore from '../../lib/store/budgetStore';
import TransactionCard from './TransactionCard';
import EditTransactionModal from './EditTransactionModal';

export default function TransactionList({ 
  searchTerm = '', 
  filterType = 'all', 
  filterCategory = 'all',
  dateRange = { start: '', end: '' }
}) {
  const { getTransactions, deleteTransaction, updateTransaction } = useTransactionStore();
  const { currentBudgetId, isMainBudget } = useBudgetStore();
  const { categories } = useCategoryStore();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  // Récupérer les transactions du budget actuel
  const transactions = getTransactions(currentBudgetId);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Filtre par terme de recherche
      if (searchTerm && !transaction.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filtre par type
      if (filterType !== 'all' && transaction.type !== filterType) {
        return false;
      }
      
      // Filtre par catégorie
      if (filterCategory !== 'all' && transaction.categoryId !== filterCategory) {
        return false;
      }
      
      // Filtre par plage de dates
      if (dateRange.start && new Date(transaction.date) < new Date(dateRange.start)) {
        return false;
      }
      if (dateRange.end && new Date(transaction.date) > new Date(dateRange.end)) {
        return false;
      }
      
      return true;
    });
  }, [transactions, searchTerm, filterType, filterCategory, dateRange]);

  // Grouper les transactions par date
  const groupedTransactions = useMemo(() => {
    const groups = {};
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      
      groups[date].push(transaction);
    });
    
    // Trier les dates de la plus récente à la plus ancienne
    const sortedDates = Object.keys(groups).sort((a, b) => {
      return new Date(b.split(' ').slice(1).join(' ')) - new Date(a.split(' ').slice(1).join(' '));
    });
    
    return sortedDates.map(date => ({
      date,
      transactions: groups[date].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }));
  }, [filteredTransactions]);

  const handleEdit = (transaction) => {
    // Empêcher l'édition sur le budget principal
    if (isMainBudget()) {
      alert('Vous ne pouvez pas modifier les transactions depuis le Budget Principal. Sélectionnez le budget spécifique.');
      return;
    }
    setEditingTransaction(transaction);
  };

  const handleDelete = (id, budgetId) => {
    // Empêcher la suppression sur le budget principal
    if (isMainBudget()) {
      alert('Vous ne pouvez pas supprimer les transactions depuis le Budget Principal. Sélectionnez le budget spécifique.');
      return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      deleteTransaction(id, budgetId);
    }
  };

  const handleUpdate = (id, updates, budgetId) => {
    updateTransaction(id, updates, budgetId);
    setEditingTransaction(null);
  };

  const handleToggleSelect = (transactionId) => {
    setSelectedTransactions(prev => 
      prev.includes(transactionId)
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTransactions.length === filteredTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(filteredTransactions.map(t => t.id));
    }
  };

  const handleDeleteSelected = () => {
    if (isMainBudget()) {
      alert('Vous ne pouvez pas supprimer les transactions depuis le Budget Principal.');
      return;
    }
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedTransactions.length} transactions ?`)) {
      selectedTransactions.forEach(id => {
        const transaction = transactions.find(t => t.id === id);
        if (transaction) {
          deleteTransaction(id, transaction.budgetId);
        }
      });
      setSelectedTransactions([]);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {isMainBudget() 
            ? "Aucune transaction dans vos budgets. Sélectionnez un budget spécifique pour ajouter des transactions."
            : "Aucune transaction pour le moment"
          }
        </p>
      </div>
    );
  }

  if (filteredTransactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune transaction ne correspond à vos critères</p>
      </div>
    );
  }

  return (
    <>
      {/* Barre d'actions pour la sélection multiple */}
      {selectedTransactions.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg flex justify-between items-center">
          <span className="text-blue-700">
            {selectedTransactions.length} transaction{selectedTransactions.length > 1 ? 's' : ''} sélectionnée{selectedTransactions.length > 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
            >
              {selectedTransactions.length === filteredTransactions.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              disabled={isMainBudget()}
            >
              Supprimer
            </button>
          </div>
        </div>
      )}

      {/* Liste des transactions groupées par date */}
      <div className="space-y-6">
        {groupedTransactions.map(group => (
          <div key={group.date}>
            <h3 className="text-sm font-medium text-gray-500 mb-3">{group.date}</h3>
            <div className="space-y-3">
              {group.transactions.map(transaction => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  category={categories.find(c => c.id === transaction.categoryId)}
                  onEdit={() => handleEdit(transaction)}
                  onDelete={() => handleDelete(transaction.id, transaction.budgetId)}
                  isSelected={selectedTransactions.includes(transaction.id)}
                  onToggleSelect={() => handleToggleSelect(transaction.id)}
                  showBudgetInfo={isMainBudget()} // Afficher le budget d'origine si on est sur le principal
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'édition */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={(updates) => handleUpdate(editingTransaction.id, updates, editingTransaction.budgetId)}
        />
      )}
    </>
  );
}