import { useState } from 'react'
import useCategoryStore from '../../lib/store/categoryStore'
import useTransactionStore from '../../lib/store/transactionStore'

export default function CategoryManager() {
  const [newCategory, setNewCategory] = useState('')
  const categories = useCategoryStore(state => state.categories)
  const addCategory = useCategoryStore(state => state.addCategory)
  const deleteCategory = useCategoryStore(state => state.deleteCategory)
  const transactions = useTransactionStore(state => state.transactions)

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      if (addCategory(newCategory.trim())) {
        alert(`✅ Catégorie "${newCategory.trim()}" ajoutée !`)
        setNewCategory('')
      } else {
        alert('❌ Cette catégorie existe déjà !')
      }
    }
  }

  const handleDeleteCategory = (category) => {
    const isUsed = transactions.some(t => t.category === category)
    const transactionCount = transactions.filter(t => t.category === category).length

    const message = isUsed 
      ? `⚠️ La catégorie "${category}" est utilisée dans ${transactionCount} transaction(s).\n\nSi vous la supprimez, ces transactions seront transférées vers "Autre".\n\nContinuer ?`
      : `Supprimer la catégorie "${category}" ?`

    if (confirm(message)) {
      deleteCategory(category)
      if (isUsed) {
        // Mettre à jour les transactions
        transactions.forEach(t => {
          if (t.category === category) {
            useTransactionStore.getState().updateTransaction(t.id, { category: 'Autre' })
          }
        })
        alert(`✅ Catégorie supprimée. ${transactionCount} transaction(s) transférée(s) vers "Autre".`)
      } else {
        alert('✅ Catégorie supprimée.')
      }
    }
  }

  const getCategoryStats = (category) => {
    const used = transactions.filter(t => t.category === category)
    return {
      count: used.length,
      total: used.reduce((sum, t) => sum + (t.type === 'debit' ? -t.amount : t.amount), 0),
      isUsed: used.length > 0
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">🏷️ Gestion des catégories</h2>
        
        {/* Ajouter catégorie */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">➕ Ajouter une catégorie</h3>
          
          {/* Input - Responsive */}
          <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-4">
            <input 
              type="text" 
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              placeholder="Nom de la nouvelle catégorie" 
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleAddCategory}
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg whitespace-nowrap"
            >
              Ajouter
            </button>
          </div>
        </div>

        {/* Liste des catégories */}
        <div>
          <h3 className="text-lg font-semibold mb-3">📋 Catégories existantes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((category) => {
              const stats = getCategoryStats(category)
              return (
                <div 
                  key={category} 
                  className={`p-4 rounded-lg border-2 transition-all ${
                    stats.isUsed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800 truncate mr-2">{category}</h4>
                    <button 
                      onClick={() => handleDeleteCategory(category)}
                      className={`text-sm hover:scale-110 transition-transform flex-shrink-0 ${
                        stats.isUsed ? 'text-orange-600 hover:text-red-600' : 'text-red-500 hover:text-red-700'
                      }`}
                      title={stats.isUsed ? 'Supprimer (avec transfert)' : 'Supprimer'}
                    >
                      {stats.isUsed ? '⚠️' : '✕'}
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    {stats.isUsed ? (
                      <>
                        <p>{stats.count} transaction(s)</p>
                        <p className={stats.total >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {stats.total >= 0 ? '+' : ''}{stats.total.toFixed(2)}€
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-400">Non utilisée</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Stats globales */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">📊 Statistiques des catégories</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
            <p className="text-sm text-gray-600">Catégories totales</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {categories.filter(c => getCategoryStats(c).isUsed).length}
            </p>
            <p className="text-sm text-gray-600">Catégories utilisées</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {categories.filter(c => !getCategoryStats(c).isUsed).length}
            </p>
            <p className="text-sm text-gray-600">Catégories vides</p>
          </div>
        </div>
      </div>
    </div>
  )
}