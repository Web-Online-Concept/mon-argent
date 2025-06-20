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
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg h-full flex flex-col">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">✏️ Saisie manuelle</h2>
      
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          {/* Type */}
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
          
          {/* Montant */}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" 
            required
          />

          {/* Zone d'exemples pour égaliser la hauteur */}
          <div className="hidden lg:block bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            <p className="font-medium text-blue-800 mb-2">💡 Exemples de saisie :</p>
            <div className="text-blue-700 space-y-1">
              <p>• <strong>Dépense :</strong> 15€ - Restaurant midi - Alimentation</p>
              <p>• <strong>Dépense :</strong> 45€ - Plein essence - Transport</p>
              <p>• <strong>Revenus :</strong> 2500€ - Salaire février - Revenus</p>
              <p>• <strong>Dépense :</strong> 89€ - Courses Carrefour - Alimentation</p>
            </div>
            <div className="mt-3 text-blue-600 text-xs">
              <p><strong>Astuce :</strong> Utilisez des descriptions claires pour un meilleur suivi de vos finances.</p>
            </div>
          </div>
        </div>
        
        {/* Bouton Submit - Aligné avec le bouton vocal */}
        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg transition-all text-lg"
          >
            ➕ Ajouter la transaction
          </button>
        </div>
      </form>
    </div>
  )
}