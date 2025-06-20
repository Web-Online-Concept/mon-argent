import { useState } from 'react'
import useTransactionStore from '../../lib/store/transactionStore'
import useCategoryStore from '../../lib/store/categoryStore'
import EditTransactionModal from './EditTransactionModal'

export default function TransactionList() {
  const transactions = useTransactionStore(state => state.transactions)
  const deleteTransaction = useTransactionStore(state => state.deleteTransaction)
  const categories = useCategoryStore(state => state.getAllCategories())
  
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [editingTransaction, setEditingTransaction] = useState(null)

  // Filtrer les transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Filtre par type
    if (filterType !== 'all' && transaction.type !== filterType) return false
    
    // Filtre par catégorie
    if (filterCategory !== 'all' && transaction.category !== filterCategory) return false
    
    // Filtre par recherche
    if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) return false
    
    // Filtre par dates
    if (startDate) {
      const transactionDate = new Date(transaction.date).setHours(0,0,0,0)
      const filterStartDate = new Date(startDate).setHours(0,0,0,0)
      if (transactionDate < filterStartDate) return false
    }
    
    if (endDate) {
      const transactionDate = new Date(transaction.date).setHours(23,59,59,999)
      const filterEndDate = new Date(endDate).setHours(23,59,59,999)
      if (transactionDate > filterEndDate) return false
    }
    
    return true
  })

  const handleDelete = (id) => {
    if (confirm('Supprimer cette transaction ?')) {
      deleteTransaction(id)
    }
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
  }

  const resetFilters = () => {
    setFilterType('all')
    setFilterCategory('all')
    setSearchTerm('')
    setStartDate('')
    setEndDate('')
  }

  // Calcul du total filtré
  const filteredStats = filteredTransactions.reduce((acc, t) => {
    if (t.type === 'credit') {
      acc.totalCredits += t.amount
    } else {
      acc.totalDebits += t.amount
    }
    return acc
  }, { totalCredits: 0, totalDebits: 0 })

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold">📋 Historique des transactions</h2>
          <p className="text-gray-600 mt-1">{filteredTransactions.length} transaction(s)</p>
          
          {/* Statistiques des transactions filtrées */}
          {filteredTransactions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <span className="text-green-600 font-medium">
                Revenus: +{filteredStats.totalCredits.toFixed(2)}€
              </span>
              <span className="text-red-600 font-medium">
                Dépenses: -{filteredStats.totalDebits.toFixed(2)}€
              </span>
              <span className={`font-bold ${(filteredStats.totalCredits - filteredStats.totalDebits) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Solde: {(filteredStats.totalCredits - filteredStats.totalDebits).toFixed(2)}€
              </span>
            </div>
          )}
          
          {/* Filtres */}
          <div className="mt-4 space-y-3">
            {/* Première ligne de filtres - CORRIGÉE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Filtre Type - Largeur fixe */}
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">Tous types</option>
                <option value="credit">💰 Revenus</option>
                <option value="debit">💸 Dépenses</option>
              </select>
              
              {/* Filtre Catégorie - Largeur fixe */}
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">Toutes catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              {/* Recherche - Prend 2 colonnes sur large écran */}
              <div className="sm:col-span-1 lg:col-span-2">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="🔍 Rechercher..." 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            
            {/* Deuxième ligne : filtres de dates */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:inline">Période :</span>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Date début"
              />
              <span className="text-sm text-gray-600">au</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Date fin"
              />
              
              {/* Boutons de période rapide */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const today = new Date()
                    const lastWeek = new Date(today)
                    lastWeek.setDate(today.getDate() - 7)
                    setStartDate(lastWeek.toISOString().split('T')[0])
                    setEndDate(today.toISOString().split('T')[0])
                  }}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                >
                  7j
                </button>
                <button
                  onClick={() => {
                    const today = new Date()
                    const lastMonth = new Date(today)
                    lastMonth.setMonth(today.getMonth() - 1)
                    setStartDate(lastMonth.toISOString().split('T')[0])
                    setEndDate(today.toISOString().split('T')[0])
                  }}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                >
                  30j
                </button>
                <button
                  onClick={() => {
                    const today = new Date()
                    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
                    setStartDate(thisMonth.toISOString().split('T')[0])
                    setEndDate(today.toISOString().split('T')[0])
                  }}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                >
                  Ce mois
                </button>
              </div>
              
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm ml-auto"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Aucune transaction trouvée</p>
              {(filterType !== 'all' || filterCategory !== 'all' || searchTerm || startDate || endDate) && (
                <button
                  onClick={resetFilters}
                  className="mt-4 text-blue-500 hover:text-blue-700 underline"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            filteredTransactions.map(transaction => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`text-lg ${transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                        {transaction.type === 'credit' ? '💰' : '💸'}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {transaction.category} • {new Date(transaction.date).toLocaleDateString('fr-FR')}
                          {transaction.isRecurring && <span className="ml-2 text-orange-600">🔄</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-lg ${transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toFixed(2)}€
                    </span>
                    
                    <button 
                      onClick={() => handleEdit(transaction)}
                      className="text-blue-500 hover:text-blue-700 p-1" 
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-500 hover:text-red-700 p-1" 
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal d'édition */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </>
  )
}