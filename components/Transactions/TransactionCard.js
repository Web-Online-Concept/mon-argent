import useBudgetStore from '../../lib/store/budgetStore';

export default function TransactionCard({ 
  transaction, 
  category, 
  onEdit, 
  onDelete,
  isSelected,
  onToggleSelect,
  showBudgetInfo = false
}) {
  const { budgets } = useBudgetStore();
  
  // Trouver le budget d'origine si nécessaire
  const sourceBudget = showBudgetInfo ? 
    budgets.find(b => b.id === transaction.budgetId) : null;

  return (
    <div className={`bg-white rounded-lg border p-4 hover:shadow-md transition-shadow ${
      isSelected ? 'ring-2 ring-blue-500' : ''
    }`}>
      <div className="flex items-center gap-4">
        {/* Checkbox de sélection */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        
        {/* Icône de catégorie */}
        <div className="text-3xl">
          {category?.icon || '📝'}
        </div>
        
        {/* Informations principales */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">
              {transaction.description || category?.name || 'Sans description'}
            </h3>
            {showBudgetInfo && sourceBudget && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {sourceBudget.icon} {sourceBudget.name}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {category?.name} • {new Date(transaction.date).toLocaleDateString('fr-FR')}
          </p>
        </div>
        
        {/* Montant */}
        <div className={`text-xl font-semibold ${
          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
        }`}>
          {transaction.type === 'income' ? '+' : '-'}
          {transaction.amount.toLocaleString('fr-FR', { 
            style: 'currency', 
            currency: 'EUR' 
          })}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Modifier"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}