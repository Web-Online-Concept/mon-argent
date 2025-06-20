import { useState, useEffect } from 'react'
import useBudgetStore from '../lib/store/budgetStore'

export default function BudgetSelector() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [budgetToRename, setBudgetToRename] = useState(null)
  const [newBudgetName, setNewBudgetName] = useState('')
  const [renameBudgetName, setRenameBudgetName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('💼')
  const [isClient, setIsClient] = useState(false)
  
  const budgets = useBudgetStore(state => state.budgets)
  const activeBudget = useBudgetStore(state => state.getActiveBudget())
  const setActiveBudget = useBudgetStore(state => state.setActiveBudget)
  const createBudget = useBudgetStore(state => state.createBudget)
  const deleteBudget = useBudgetStore(state => state.deleteBudget)
  const renameBudget = useBudgetStore(state => state.renameBudget)
  const getPrincipalTotal = useBudgetStore(state => state.getPrincipalTotal)
  const getIndividualBudgets = useBudgetStore(state => state.getIndividualBudgets)

  const budgetIcons = ['💰', '💼', '🏠', '✈️', '🎯', '💳', '🏦', '💸', '🎓', '🏥', '🚗', '👨‍👩‍👧‍👦']

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleCreateBudget = () => {
    if (newBudgetName.trim()) {
      const newBudget = createBudget(newBudgetName, selectedIcon)
      setNewBudgetName('')
      setSelectedIcon('💼')
      setShowCreateModal(false)
      setShowDropdown(false)
      
      // Basculer sur le nouveau budget
      if (confirm('Voulez-vous basculer sur le nouveau budget maintenant ?')) {
        setActiveBudget(newBudget.id)
      }
    }
  }

  const handleDeleteBudget = (budget) => {
    if (budget.isPrincipal) {
      alert('❌ Impossible de supprimer le Budget Principal')
      return
    }

    if (confirm(`Supprimer le budget "${budget.name}" ?\n\nToutes les données associées seront perdues !`)) {
      deleteBudget(budget.id)
    }
  }

  const handleStartRename = (budget) => {
    setBudgetToRename(budget)
    setRenameBudgetName(budget.name)
    setShowRenameModal(true)
    setShowDropdown(false)
  }

  const handleRenameBudget = () => {
    if (renameBudgetName.trim() && budgetToRename) {
      renameBudget(budgetToRename.id, renameBudgetName)
      setShowRenameModal(false)
      setBudgetToRename(null)
      setRenameBudgetName('')
    }
  }

  // Calculer les totaux pour l'affichage
  const getBudgetDisplayInfo = (budget) => {
    if (budget.isPrincipal) {
      const total = getPrincipalTotal()
      const individualBudgets = getIndividualBudgets()
      return {
        balance: total,
        subtitle: `${individualBudgets.length} budget(s) • Total agrégé`
      }
    } else {
      // Pour les budgets individuels, calculer leur solde
      const storageKey = `transactions_${budget.id}`
      const storedData = localStorage.getItem(storageKey)
      
      if (storedData) {
        try {
          const data = JSON.parse(storedData)
          const { transactions = [], initialBalance = 0 } = data.state || {}
          const balance = initialBalance + transactions.reduce((acc, t) => {
            return acc + (t.type === 'credit' ? t.amount : -t.amount)
          }, 0)
          return {
            balance,
            subtitle: `${transactions.length} transaction(s)`
          }
        } catch (error) {
          return { balance: 0, subtitle: 'Erreur de lecture' }
        }
      }
      
      return { balance: 0, subtitle: 'Aucune transaction' }
    }
  }

  // Affichage temporaire pendant l'hydratation
  if (!isClient) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md">
        <span className="text-xl">💰</span>
        <span className="font-medium">Chargement...</span>
      </div>
    )
  }

  const currentBudgetInfo = getBudgetDisplayInfo(activeBudget)

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow min-w-[280px]"
        >
          <span className="text-xl">{activeBudget.icon}</span>
          <div className="flex-1 text-left">
            <div className="font-medium">{activeBudget.name}</div>
            <div className="text-sm text-gray-500">
              {currentBudgetInfo.balance.toFixed(2)}€ • {currentBudgetInfo.subtitle}
            </div>
          </div>
          <span className="text-gray-400">▼</span>
        </button>

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-50 min-w-[350px]">
            <div className="max-h-80 overflow-y-auto">
              {budgets.map(budget => {
                const budgetInfo = getBudgetDisplayInfo(budget)
                return (
                  <div
                    key={budget.id}
                    className={`flex items-center justify-between p-4 hover:bg-gray-50 ${
                      budget.id === activeBudget.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <button
                      onClick={() => {
                        setActiveBudget(budget.id)
                        setShowDropdown(false)
                      }}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <span className="text-xl">{budget.icon}</span>
                      <div>
                        <div className={`${budget.id === activeBudget.id ? 'font-semibold' : ''} ${budget.isPrincipal ? 'text-blue-700' : ''}`}>
                          {budget.name}
                          {budget.isPrincipal && <span className="text-xs ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded">TOTAL</span>}
                        </div>
                        <div className="text-sm text-gray-500">
                          {budgetInfo.balance.toFixed(2)}€ • {budgetInfo.subtitle}
                        </div>
                      </div>
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {!budget.isPrincipal && (
                        <button
                          onClick={() => handleStartRename(budget)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          title="Renommer"
                        >
                          ✏️
                        </button>
                      )}
                      
                      {!budget.isPrincipal && (
                        <button
                          onClick={() => handleDeleteBudget(budget)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="border-t p-3">
              <button
                onClick={() => {
                  setShowCreateModal(true)
                  setShowDropdown(false)
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                ➕ Nouveau budget
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">➕ Créer un nouveau budget</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du budget
                </label>
                <input
                  type="text"
                  value={newBudgetName}
                  onChange={(e) => setNewBudgetName(e.target.value)}
                  placeholder="Ex: Budget Vacances, Budget Maison..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choisir une icône
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {budgetIcons.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setSelectedIcon(icon)}
                      className={`text-2xl p-2 rounded-lg transition-all ${
                        selectedIcon === icon 
                          ? 'bg-blue-100 ring-2 ring-blue-500' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  💡 <strong>Nouveau :</strong> Chaque budget aura ses propres transactions, complètement séparées. Le "Budget Principal" affichera automatiquement la somme de tous vos budgets.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewBudgetName('')
                    setSelectedIcon('💼')
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateBudget}
                  disabled={!newBudgetName.trim()}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                    newBudgetName.trim()
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  ✅ Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de renommage */}
      {showRenameModal && budgetToRename && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">✏️ Renommer le budget</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau nom pour "{budgetToRename.name}"
                </label>
                <input
                  type="text"
                  value={renameBudgetName}
                  onChange={(e) => setRenameBudgetName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowRenameModal(false)
                    setBudgetToRename(null)
                    setRenameBudgetName('')
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={handleRenameBudget}
                  disabled={!renameBudgetName.trim()}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                    renameBudgetName.trim()
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  ✅ Renommer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}