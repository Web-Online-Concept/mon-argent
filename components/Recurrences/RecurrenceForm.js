import { useState, useEffect } from 'react'
import useRecurrenceStore from '../../lib/store/recurrenceStore'
import useCategoryStore from '../../lib/store/categoryStore'

export default function RecurrenceForm({ onClose, recurrenceToEdit = null }) {
  const [type, setType] = useState(recurrenceToEdit?.type || 'debit')
  const [amount, setAmount] = useState(recurrenceToEdit?.amount || '')
  const [category, setCategory] = useState(recurrenceToEdit?.category || '')
  const [description, setDescription] = useState(recurrenceToEdit?.description || '')
  const [frequency, setFrequency] = useState(recurrenceToEdit?.frequency || 'monthly')
  const [customMonths, setCustomMonths] = useState(recurrenceToEdit?.customMonths || '')
  const [startDate, setStartDate] = useState(
    recurrenceToEdit?.startDate 
      ? new Date(recurrenceToEdit.startDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState(
    recurrenceToEdit?.endDate 
      ? new Date(recurrenceToEdit.endDate).toISOString().split('T')[0]
      : ''
  )

  const categories = useCategoryStore(state => state.getAllCategories())
  const createRecurrence = useRecurrenceStore(state => state.createRecurrence)
  const updateRecurrence = useRecurrenceStore(state => state.updateRecurrence)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!amount || !description) {
      alert('Veuillez remplir le montant et la description')
      return
    }

    if (frequency === 'custom' && (!customMonths || customMonths < 1)) {
      alert('Veuillez spécifier le nombre de mois pour la fréquence personnalisée')
      return
    }

    const recurrenceData = {
      type,
      amount: parseFloat(amount),
      category: category || 'Autre',
      description,
      frequency,
      customMonths: frequency === 'custom' ? parseInt(customMonths) : null,
      startDate,
      endDate: endDate || null
    }

    if (recurrenceToEdit) {
      updateRecurrence(recurrenceToEdit.id, recurrenceData)
      alert('✅ Récurrence modifiée avec succès !')
    } else {
      createRecurrence(recurrenceData)
      alert('✅ Récurrence créée avec succès !')
    }

    onClose()
  }

  const getFrequencyLabel = () => {
    switch (frequency) {
      case 'weekly': return 'chaque semaine'
      case 'monthly': return 'chaque mois'
      case 'quarterly': return 'tous les 3 mois'
      case 'yearly': return 'chaque année'
      case 'custom': return customMonths ? `tous les ${customMonths} mois` : 'personnalisée'
      default: return frequency
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-6">
          {recurrenceToEdit ? '✏️ Modifier la récurrence' : '➕ Nouvelle récurrence'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="debit">💸 Dépense</option>
              <option value="credit">💰 Revenus</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Montant (€)</label>
            <input 
              type="number" 
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
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
              <option value="">Choisir une catégorie...</option>
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
              placeholder="Ex: Loyer, Salaire..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fréquence</label>
            <select 
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="weekly">📅 Hebdomadaire</option>
              <option value="monthly">📅 Mensuelle</option>
              <option value="quarterly">📅 Trimestrielle</option>
              <option value="yearly">📅 Annuelle</option>
              <option value="custom">📅 Personnalisée</option>
            </select>
          </div>

          {frequency === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tous les combien de mois ?</label>
              <input 
                type="number" 
                min="1"
                max="24"
                value={customMonths}
                onChange={(e) => setCustomMonths(e.target.value)}
                placeholder="Ex: 2 pour tous les 2 mois"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de fin (optionnelle)
            </label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Aperçu */}
          {amount && description && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">🔍 Aperçu</h4>
              <div className="text-sm text-blue-700">
                <p>{type === 'credit' ? '💰 Revenus' : '💸 Dépense'} de <strong>{amount}€</strong></p>
                <p>📅 Fréquence : {getFrequencyLabel()}</p>
                <p>🚀 Première échéance : {new Date(startDate).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
            >
              Annuler
            </button>
            <button 
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              {recurrenceToEdit ? '✅ Modifier' : '✅ Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}