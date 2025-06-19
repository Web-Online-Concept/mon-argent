import { useEffect, useState } from 'react'
import StatsCards from './StatsCards'
import Charts from './Charts'
import useTransactionStore from '../../lib/store/transactionStore'

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false)
  const transactions = useTransactionStore(state => state.transactions)
  const balance = useTransactionStore(state => state.getCurrentBalance())
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Calculer les statistiques
  const totalRevenues = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0)
    
  const totalExpenses = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0)

  const stats = {
    balance: isClient ? balance : 1000,
    totalRevenues: isClient ? totalRevenues : 0,
    totalExpenses: isClient ? totalExpenses : 0,
    transactionCount: isClient ? transactions.length : 0
  }

  return (
    <div className="space-y-6">
      {/* Cartes de statistiques */}
      <StatsCards stats={stats} />
      
      {/* Graphiques */}
      {isClient && <Charts />}
      
      {/* Section informative */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          ✨ Pourquoi Mon Budget Pro ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div className="text-center">
            <div className="text-2xl mb-2">🎤</div>
            <h4 className="font-medium text-gray-800 mb-2">Saisie vocale ultra-rapide</h4>
            <p>Ajoutez vos dépenses en parlant. Simple et naturel !</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📱</div>
            <h4 className="font-medium text-gray-800 mb-2">Optimisé mobile</h4>
            <p>Interface pensée pour votre smartphone.</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🔒</div>
            <h4 className="font-medium text-gray-800 mb-2">Données privées</h4>
            <p>Tout reste sur votre appareil.</p>
          </div>
        </div>
      </div>
    </div>
  )
}