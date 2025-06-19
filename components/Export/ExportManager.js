import { useState } from 'react'
import useTransactionStore from '../../lib/store/transactionStore'
import useCategoryStore from '../../lib/store/categoryStore'
import useRecurrenceStore from '../../lib/store/recurrenceStore'

export default function ExportManager() {
  const [importStatus, setImportStatus] = useState('')
  
  const transactions = useTransactionStore(state => state.transactions)
  const initialBalance = useTransactionStore(state => state.initialBalance)
  const categories = useCategoryStore(state => state.categories)
  const recurrences = useRecurrenceStore(state => state.recurrences)

  // Export JSON
  const handleExportJSON = () => {
    const data = {
      version: '2.0.0',
      exportDate: new Date().toISOString(),
      initialBalance,
      transactions,
      categories,
      recurrences
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `mon-budget-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Export CSV
  const handleExportCSV = () => {
    let csv = 'Date,Type,Montant,Catégorie,Description,Récurrent\n'
    
    transactions.forEach(t => {
      const date = new Date(t.date).toLocaleDateString('fr-FR')
      const type = t.type === 'credit' ? 'Crédit' : 'Débit'
      const amount = t.amount.toFixed(2)
      const category = t.category
      const description = `"${t.description.replace(/"/g, '""')}"`
      const recurring = t.isRecurring ? 'Oui' : 'Non'
      
      csv += `${date},${type},${amount},${category},${description},${recurring}\n`
    })

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `mon-budget-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Import JSON
  const handleImportJSON = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        // Validation basique
        if (!data.version || !data.transactions || !Array.isArray(data.transactions)) {
          throw new Error('Format de fichier invalide')
        }

        // Confirmation
        const confirmMessage = `📁 Importer ces données ?\n\n` +
          `📊 ${data.transactions.length} transaction(s)\n` +
          `🏷️ ${data.categories.length} catégorie(s)\n` +
          `🔄 ${data.recurrences ? data.recurrences.length : 0} récurrence(s)\n` +
          `📅 Export du ${new Date(data.exportDate).toLocaleDateString('fr-FR')}\n\n` +
          `⚠️ Cela remplacera vos données actuelles !`

        if (confirm(confirmMessage)) {
          // Réinitialiser et importer
          localStorage.clear()
          
          // Importer les données
          if (data.initialBalance !== undefined) {
            useTransactionStore.setState({ initialBalance: data.initialBalance })
          }
          if (data.transactions) {
            useTransactionStore.setState({ transactions: data.transactions })
          }
          if (data.categories) {
            useCategoryStore.setState({ categories: data.categories })
          }
          if (data.recurrences) {
            useRecurrenceStore.setState({ recurrences: data.recurrences })
          }

          setImportStatus('✅ Import réussi ! La page va se recharger...')
          
          // Recharger après 2 secondes
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        }
      } catch (error) {
        console.error('Erreur import:', error)
        setImportStatus(`❌ Erreur : ${error.message}`)
      }
    }

    reader.readAsText(file)
    // Reset l'input
    event.target.value = ''
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">📤 Export et Import</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Export */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">💾 Sauvegarder vos données</h2>
              <p className="text-gray-600 mb-6">
                Exportez vos données pour les sauvegarder ou les transférer sur un autre appareil.
              </p>
              
              <div className="space-y-4">
                <button 
                  onClick={handleExportJSON}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  📄 Télécharger JSON
                  <span className="text-sm opacity-75">(complet)</span>
                </button>
                
                <button 
                  onClick={handleExportCSV}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  📊 Télécharger CSV
                  <span className="text-sm opacity-75">(Excel)</span>
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Conseils</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• JSON : Format complet avec toutes les données</li>
                <li>• CSV : Pour ouvrir dans Excel ou Google Sheets</li>
                <li>• Sauvegardez régulièrement vos données !</li>
              </ul>
            </div>
          </div>

          {/* Import */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">📁 Restaurer vos données</h2>
              <p className="text-gray-600 mb-6">
                Importez un fichier JSON précédemment exporté pour restaurer vos données.
              </p>
              
              <div className="space-y-4">
                <input 
                  type="file" 
                  id="import-file" 
                  accept=".json"
                  onChange={handleImportJSON}
                  style={{ display: 'none' }}
                />
                
                <button 
                  onClick={() => document.getElementById('import-file').click()}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  📁 Importer JSON
                </button>
              </div>
              
              {importStatus && (
                <div className={`mt-4 p-4 rounded-lg ${
                  importStatus.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {importStatus}
                </div>
              )}
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">⚠️ Attention</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• L'import remplace TOUTES vos données actuelles</li>
                <li>• Exportez d'abord vos données actuelles par sécurité</li>
                <li>• Seuls les fichiers JSON sont acceptés pour l'import</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-semibold mb-4">📊 Données actuelles</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-700">{transactions.length}</p>
              <p className="text-sm text-gray-600">Transactions</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-700">{categories.length}</p>
              <p className="text-sm text-gray-600">Catégories</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-700">{recurrences.length}</p>
              <p className="text-sm text-gray-600">Récurrences</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-700">
                {((JSON.stringify({ transactions, categories, recurrences }).length / 1024)).toFixed(1)} KB
              </p>
              <p className="text-sm text-gray-600">Taille estimée</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}