import { useState, useEffect } from 'react';
import useCategoryStore from '../../lib/store/categoryStore';
import useBudgetStore from '../../lib/store/budgetStore';

export default function EditTransactionModal({ transaction, onClose, onSave }) {
  const { categories } = useCategoryStore();
  const { budgets } = useBudgetStore();
  
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [description, setDescription] = useState(transaction.description || '');
  const [type, setType] = useState(transaction.type);
  const [date, setDate] = useState(transaction.date);
  const [categoryId, setCategoryId] = useState(transaction.categoryId);
  
  // Trouver le budget d'origine
  const sourceBudget = budgets.find(b => b.id === transaction.budgetId);

  useEffect(() => {
    // Fermer avec Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    onSave({
      amount: parseFloat(amount),
      description,
      type,
      date,
      categoryId
    });
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    // Réinitialiser la catégorie lors du changement de type
    const defaultCategory = categories.find(c => 
      newType === 'expense' ? c.name === 'Autres' : c.name === 'Salaire'
    );
    if (defaultCategory) {
      setCategoryId(defaultCategory.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Modifier la transaction</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Afficher le budget d'origine */}
          {sourceBudget && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
              <span className="text-sm text-gray-600">Budget :</span>
              <span className="font-medium">{sourceBudget.icon} {sourceBudget.name}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type de transaction */}
            <div>
              <label className="block text-sm font-medium mb-3">Type de transaction</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeChange('expense')}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                    type === 'expense'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  💸 Dépense
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('income')}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                    type === 'income'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  💰 Revenu
                </button>
              </div>
            </div>

            {/* Montant */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Montant (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="0.00"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
                placeholder="Ajouter une description..."
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Catégorie
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              >
                {categories
                  .filter(cat => cat.type === type)
                  .map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Enregistrer les modifications
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}