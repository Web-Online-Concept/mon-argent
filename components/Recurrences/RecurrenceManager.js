import { useState, useEffect } from 'react'
import RecurrenceForm from './RecurrenceForm'
import useRecurrenceStore from '../../lib/store/recurrenceStore'
import useTransactionStore from '../../lib/store/transactionStore'

export default function RecurrenceManager() {
  const [showForm, setShowForm] = useState(false)
  const [editingRecurrence, setEditingRecurrence] = useState(null)
  const [isClient, setIsClient] = useState(false)
  
  const recurrences = useRecurrenceStore(state => state.recurrences)
  const deleteRecurrence = useRecurrenceStore(state => state.deleteRecurrence)
  const processRecurrences = useRecurrenceStore(state => state.processRecurrences)
  const addTransaction = useTransactionStore(state => state.addTransaction)

  useEffect(() => {
    setIsClient(true)
    // Traiter les récurrences au chargement
    if (typeof window !== 'undefined') {
      const result = processRecurrences()
      if (result.transactions && result.transactions.length > 0) {
        result.transactions.forEach(t => addTransaction(t))
        alert(`✅ ${result.transactions.length} transaction(s) récurrente(s) générée(s)`)
      }
    }
  }, [])

  const handleDelete = (id) => {
    const recurrence = recurrences.find(r => r.id === id)
    if (!recurrence) return

    if (confirm(`Supprimer la récurrence "${recurrence.description}" ?`)) {
      deleteRecurrence(id)
      alert('✅ Récurrence supprimée')
    }
  }

  const handleEdit = (recurrence) => {
    setEditingRecurrence(recurrence)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingRecurrence(null)
  }

  const formatFrequency = (frequency, customMonths) => {
    switch (frequency) {
      case 'weekly': return 'Hebdomadaire'
      case 'monthly': return 'Mensuelle'
      case 'quarterly': return 'Trimestrielle'
      case 'yearly': return 'Annuelle'
      case 'custom': return `Tous les ${customMonths} mois`
      default: return frequency
    }
  }

  const formatNextDue = (nextDue) => {
    if (!nextDue) return 'N/A'
    const date = new Date(nextDue)
    const today = new Date()
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'En retard'
    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return 'Demain'
    if (diffDays <= 7) return `Dans ${diffDays} jours`
    
    return date.toLocaleDateString('fr-FR')
  }

  if (!isClient) {
    return <div className="bg-white rounded-lg p-8 shadow-lg">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      {/* En-tête et bouton d'ajout */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">🔄 Transactions récurrentes</h2>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            ➕ Nouvelle récurrence
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{recurrences.length}</p>
            <p className="text-sm text-blue-800">Total</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {recurrences.filter(r => r.isActive).length}
            </p>
            <p className="text-sm text-green-800">Actives</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {recurrences.reduce((sum, r) => sum + r.totalGenerated, 0)}
            </p>
            <p className="text-sm text-purple-800">Générées</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {recurrences.filter(r => r.isActive && r.nextDue).length}
            </p>
            <p className="text-sm text-orange-800">En attente</p>
          </div>
        </div>
      </div>

      {/* Liste des récurrences */}
      <div className="space-y-4">
        {recurrences.length === 0 ? (
          <div className="bg-white rounded-lg p-8 shadow-lg text-center text-gray-500">
            <p className="mb-4">Aucune récurrence configurée</p>
            <button 
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              ➕ Créer votre première récurrence
            </button>
          </div>
        ) : (
          recurrences.map(recurrence => (
            <div 
              key={recurrence.id} 
              className={`bg-white rounded-lg p-6 shadow-lg border-l-4 ${
                recurrence.isActive ? 'border-green-400' : 'border-gray-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xl ${recurrence.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                      {recurrence.type === 'credit' ? '💰' : '💸'}
                    </span>
                    <div>
                      <h3 className="font-bold text-lg">{recurrence.description}</h3>
                      <p className="text-sm text-gray-600">{recurrence.category}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Montant</p>
                      <p className={`font-bold ${recurrence.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {recurrence.type === 'credit' ? '+' : '-'}{recurrence.amount.toFixed(2)}€
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fréquence</p>
                      <p className="font-medium">{formatFrequency(recurrence.frequency, recurrence.customMonths)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Prochaine échéance</p>
                      <p className="font-medium">{formatNextDue(recurrence.nextDue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Générées</p>
                      <p className="font-medium">{recurrence.totalGenerated}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      recurrence.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {recurrence.isActive ? '✅ Active' : '⏸️ Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <button 
                    onClick={() => handleEdit(recurrence)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(recurrence.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulaire modal */}
      {showForm && (
        <RecurrenceForm 
          onClose={handleCloseForm}
          recurrenceToEdit={editingRecurrence}
        />
      )}
    </div>
  )
}