import { useState } from 'react';
import useBudgetStore from '../lib/store/budgetStore';
import useTransactionStore from '../lib/store/transactionStore';

export default function BudgetSelector() {
  const { 
    budgets, 
    currentBudgetId, 
    setCurrentBudget, 
    addBudget, 
    updateBudget, 
    deleteBudget 
  } = useBudgetStore();
  const { deleteBudgetData } = useTransactionStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBudgetName, setNewBudgetName] = useState('');
  const [newBudgetIcon, setNewBudgetIcon] = useState('💼');
  const [editingBudget, setEditingBudget] = useState(null);
  
  const currentBudget = budgets.find(b => b.id === currentBudgetId);
  
  const emojis = ['💰', '🏠', '🚗', '✈️', '🎓', '💼', '🛒', '🏦', '💳', '🎯'];
  
  const handleAddBudget = (e) => {
    e.preventDefault();
    if (newBudgetName.trim()) {
      const newBudget = addBudget(newBudgetName.trim(), newBudgetIcon);
      setCurrentBudget(newBudget.id);
      setNewBudgetName('');
      setNewBudgetIcon('💼');
      setShowAddForm(false);
    }
  };
  
  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setNewBudgetName(budget.name);
    setNewBudgetIcon(budget.icon);
  };
  
  const handleUpdateBudget = (e) => {
    e.preventDefault();
    if (editingBudget && newBudgetName.trim()) {
      updateBudget(editingBudget.id, {
        name: newBudgetName.trim(),
        icon: newBudgetIcon
      });
      setEditingBudget(null);
      setNewBudgetName('');
      setNewBudgetIcon('💼');
    }
  };
  
  const handleDeleteBudget = (budgetId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce budget et toutes ses transactions ?')) {
      deleteBudget(budgetId);
      deleteBudgetData(budgetId);
    }
  };
  
  const handleSelectBudget = (budgetId) => {
    setCurrentBudget(budgetId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="text-xl">{currentBudget?.icon}</span>
        <span className="font-medium">{currentBudget?.name}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 w-72 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Mes budgets</h3>
            
            {/* Liste des budgets */}
            <div className="space-y-2 mb-4">
              {budgets.map(budget => (
                <div
                  key={budget.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    budget.id === currentBudgetId 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  } ${budget.isMain ? 'bg-gradient-to-r from-blue-50 to-purple-50' : ''}`}
                  onClick={() => handleSelectBudget(budget.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{budget.icon}</span>
                    <div>
                      <p className="font-medium">{budget.name}</p>
                      {budget.isMain && (
                        <p className="text-xs text-gray-600">Vue d'ensemble</p>
                      )}
                    </div>
                  </div>
                  
                  {!budget.isMain && budget.id !== 'budget-default' && (
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditBudget(budget);
                        }}
                        className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBudget(budget.id);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Formulaire d'ajout/édition */}
            {(showAddForm || editingBudget) && (
              <form onSubmit={editingBudget ? handleUpdateBudget : handleAddBudget} className="border-t pt-4">
                <h4 className="font-medium mb-3">
                  {editingBudget ? 'Modifier le budget' : 'Nouveau budget'}
                </h4>
                
                <input
                  type="text"
                  value={newBudgetName}
                  onChange={(e) => setNewBudgetName(e.target.value)}
                  placeholder="Nom du budget"
                  className="w-full p-2 border rounded-lg mb-3"
                  autoFocus
                  required
                />
                
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-2">Icône</label>
                  <div className="grid grid-cols-5 gap-2">
                    {emojis.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewBudgetIcon(emoji)}
                        className={`p-2 text-2xl rounded-lg transition-colors ${
                          newBudgetIcon === emoji 
                            ? 'bg-blue-100 ring-2 ring-blue-500' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {editingBudget ? 'Modifier' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingBudget(null);
                      setNewBudgetName('');
                      setNewBudgetIcon('💼');
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
            
            {/* Bouton d'ajout */}
            {!showAddForm && !editingBudget && (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                + Ajouter un budget
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Overlay pour fermer le menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}