import { useState, useEffect } from 'react'
import useTransactionStore from '../../lib/store/transactionStore'
import useCategoryStore from '../../lib/store/categoryStore'

export default function EditTransactionModal({ transaction, onClose }) {
  const [type, setType] = useState(transaction.type)
  const [amount, setAmount] = useState(transaction.amount)
  const [category, setCategory] = useState(transaction.category)
  const [description, setDescription] = useState(transaction.description)
  
  const updateTransaction = useTransactionStore(state => state.updateTransaction)
  const categories = useCategoryStore(state => state.getAllCategories())

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!amount || !description) {
      alert('Veuillez remplir le montant et la description')
      return
    }

    updateTransaction(transaction.id, {
      type,
      amount: parseFloat(amount),
      category: category || 'Autre',
      description
    })

    alert('✅ Transaction modifiée avec succès !')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-6">✏️ Modifier la transaction</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setType('debit')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  type === 'debit' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                💸 Dépense
              </button>
              <button
                type="button"
                onClick={() => setType('credit')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  type === 'credit' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                💰 Revenu
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Montant (€)</label>
            <input 
              type="number" 
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="border-t pt-4 mt-6">
            <div className="text-sm text-gray-500 mb-4">
              <p>📅 Date : {new Date(transaction.date).toLocaleDateString('fr-FR')}</p>
              {transaction.isRecurring && (
                <p className="text-orange-600">🔄 Transaction récurrente</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              ✅ Modifier
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}