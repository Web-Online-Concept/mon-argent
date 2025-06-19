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

  // Affichage temporaire pendant l'hydratation
  if (!isClient) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md">
        <span className="text-xl">💰</span>
        <span className="font-medium">Chargement...</span>
      </div>
    )
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <span className="text-xl">{activeBudget.icon}</span>
          <span className="font-medium">{activeBudget.name}</span>
          <span className="text-gray-400">▼</span>
        </button>

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-50 min-w-[300px]">
            <div className="max-h-64 overflow-y-auto">
              {budgets.map(budget => (
                <div
                  key={budget.id}
                  className={`flex items-center justify-between p-3 hover:bg-gray-50 ${
                    budget.id === activeBudget.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <button
                    onClick={() => {
                      setActiveBudget(budget.id)
                      setShowDropdown(false)
                    }}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    <span className="text-xl">{budget.icon}</span>
                    <span className={budget.id === activeBudget.id ? 'font-semibold' : ''}>
                      {budget.name}
                    </span>
                  </button>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartRename(budget)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Renommer"
                    >
                      ✏️
                    </button>
                    
                    {budget.id !== 'default' && (
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
              ))}
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
                  placeholder="Ex: Budget Vacances, Budget Pro..."
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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 Chaque budget a ses propres transactions, catégories et récurrences séparées.
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