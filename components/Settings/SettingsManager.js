import { useState, useEffect } from 'react'
import useTransactionStore from '../../lib/store/transactionStore'

export default function SettingsManager() {
  const initialBalance = useTransactionStore(state => state.initialBalance)
  const setInitialBalance = useTransactionStore(state => state.setInitialBalance)
  const resetTransactions = useTransactionStore(state => state.resetTransactions)
  
  const [balance, setBalance] = useState(initialBalance)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setBalance(initialBalance)
  }, [initialBalance])

  const handleBalanceChange = (e) => {
    setBalance(e.target.value)
    setHasChanges(true)
  }

  const handleSave = () => {
    const newBalance = parseFloat(balance) || 0
    setInitialBalance(newBalance)
    setHasChanges(false)
    alert('✅ Solde initial mis à jour !')
  }

  const handleReset = () => {
    if (confirm('⚠️ Supprimer TOUTES les transactions ?\n\nCette action est irréversible !')) {
      if (confirm('Êtes-vous vraiment sûr ? Toutes vos données seront perdues !')) {
        resetTransactions()
        alert('🗑️ Toutes les transactions ont été supprimées')
      }
    }
  }

  const handleFullReset = () => {
    if (confirm('🚨 RÉINITIALISATION COMPLÈTE ?\n\nCela supprimera :\n- Toutes les transactions\n- Toutes les récurrences\n- Toutes les catégories personnalisées\n\nContinuer ?')) {
      if (confirm('DERNIÈRE CHANCE !\n\nÊtes-vous absolument certain de vouloir tout effacer ?')) {
        // Reset tous les stores
        localStorage.clear()
        window.location.reload()
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">⚙️ Paramètres</h2>
        
        <div className="space-y-6">
          {/* Solde initial */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              💰 Solde initial (€)
            </label>
            <div className="flex gap-4">
              <input 
                type="number" 
                step="0.01"
                value={balance}
                onChange={handleBalanceChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={handleSave}
                disabled={!hasChanges}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  hasChanges 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                💾 Sauvegarder
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Ce montant sera votre point de départ pour calculer votre solde actuel
            </p>
          </div>

          {/* Informations */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">📊 Informations</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Version : 2.0.0</p>
              <p>• Stockage : Local (sur votre appareil)</p>
              <p>• Données : 100% privées et sécurisées</p>
            </div>
          </div>

          {/* Zone de danger */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-red-600">⚠️ Zone de danger</h3>
            <div className="space-y-4">
              <div>
                <button 
                  onClick={handleReset}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  🗑️ Effacer les transactions
                </button>
                <p className="text-sm text-gray-500 mt-1">
                  Supprime toutes les transactions mais garde les catégories et récurrences
                </p>
              </div>
              
              <div>
                <button 
                  onClick={handleFullReset}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  💣 Réinitialisation complète
                </button>
                <p className="text-sm text-gray-500 mt-1">
                  Remet l'application à zéro (TOUT sera supprimé)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}