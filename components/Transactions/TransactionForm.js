import { useState } from 'react'
import useTransactionStore from '../../lib/store/transactionStore'
import useCategoryStore from '../../lib/store/categoryStore'

export default function TransactionForm() {
  const [type, setType] = useState('debit')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  
  const addTransaction = useTransactionStore(state => state.addTransaction)
  const categories = useCategoryStore(state => state.getAllCategories())

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!amount || !description) {
      alert('Veuillez remplir le montant et la description')
      return
    }

    addTransaction({
      type,
      amount: parseFloat(amount),
      category: category || 'Autre',
      description
    })

    // Reset form
    setAmount('')
    setCategory('')
    setDescription('')
    
    alert('✅ Transaction ajoutée avec succès !')
  }

  return (
    <div className="bg-white rounded-lg p-4 sm:p-8 shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">✏️ Saisie manuelle</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type - Ligne séparée sur mobile */}
        <div className="w-full">
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="debit">💸 Dépense</option>
            <option value="credit">💰 Revenus</option>
          </select>
        </div>
        
        {/* Montant - Ligne séparée */}
        <div className="w-full">
          <input 
            type="number" 
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Montant (€)" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" 
            required
          />
        </div>
        
        {/* Catégorie */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choisir une catégorie...</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        {/* Description */}
        <input 
          type="text" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description" 
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
          required
        />
        
        {/* Bouton Submit */}
        <button 
          type="submit" 
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 sm:px-6 rounded-lg transition-colors"
        >
          ➕ Ajouter la transaction
        </button>
      </form>
    </div>
  )
}