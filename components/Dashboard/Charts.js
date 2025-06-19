import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import useTransactionStore from '../../lib/store/transactionStore'

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#14B8A6', '#F97316']

export default function Charts() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const transactions = useTransactionStore(state => state.transactions)
  const initialBalance = useTransactionStore(state => state.initialBalance)

  const periods = [
    { value: '7d', label: '7 jours' },
    { value: '15d', label: '15 jours' },
    { value: '1m', label: '1 mois' },
    { value: '3m', label: '3 mois' },
    { value: '6m', label: '6 mois' },
    { value: '1y', label: '1 an' }
  ]

  // Calculer le nombre de jours selon la période
  const getDaysFromPeriod = (period) => {
    switch(period) {
      case '7d': return 7
      case '15d': return 15
      case '1m': return 30
      case '3m': return 90
      case '6m': return 180
      case '1y': return 365
      default: return 7
    }
  }

  // Données pour le graphique d'évolution du solde
  const getEvolutionData = () => {
    const data = []
    const today = new Date()
    const days = getDaysFromPeriod(selectedPeriod)
    
    // Calculer le solde de départ pour la période
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - days)
    
    // Obtenir toutes les transactions triées par date
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    )
    
    // Calculer le solde au début de la période
    let runningBalance = initialBalance
    sortedTransactions.forEach(t => {
      if (new Date(t.date) < startDate) {
        runningBalance += t.type === 'credit' ? t.amount : -t.amount
      }
    })
    
    // Créer les points de données jour par jour
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      // Ajouter les transactions du jour au solde
      const dayTransactions = sortedTransactions.filter(t => 
        t.date.split('T')[0] === dateStr
      )
      
      dayTransactions.forEach(t => {
        runningBalance += t.type === 'credit' ? t.amount : -t.amount
      })
      
      data.push({
        date: date,
        jour: days <= 15 
          ? date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
          : date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        solde: runningBalance,
        color: runningBalance >= 0 ? '#10B981' : '#EF4444'
      })
    }
    
    return data
  }

  // Données pour les barres horizontales
  const getCategoryData = (type) => {
    const categoryTotals = {}
    
    transactions
      .filter(t => t.type === type)
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
      })
    
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ 
        name: name.length > 15 ? name.substring(0, 15) + '...' : name, 
        value,
        fullName: name
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5) // Top 5 catégories
  }

  const evolutionData = getEvolutionData()
  const expenseData = getCategoryData('debit')
  const incomeData = getCategoryData('credit')

  // Tooltip personnalisé pour le graphique
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">
            {new Date(data.date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className={`text-lg font-bold ${data.solde >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Solde: {data.solde.toFixed(2)}€
          </p>
        </div>
      )
    }
    return null
  }

  // Rendu personnalisé des barres de catégories
  const CategoryBars = ({ data, color }) => {
    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>Aucune donnée</p>
        </div>
      )
    }

    const maxValue = Math.max(...data.map(d => d.value))

    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-24 text-sm text-gray-700 font-medium truncate" title={item.fullName}>
              {item.fullName}
            </div>
            <div className="flex-1 relative">
              <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 ease-out relative"
                  style={{ 
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                >
                  <span className="absolute right-2 top-0 h-6 flex items-center text-xs font-bold text-white drop-shadow-md">
                    {item.value.toFixed(0)}€
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Graphique d'évolution du solde */}
      <div className="bg-white rounded-lg p-6 shadow-lg lg:col-span-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">📈 Évolution du solde</h3>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
        <div className="h-64">
          {evolutionData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolutionData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="jour" 
                  tick={{ fontSize: 12 }}
                  interval={evolutionData.length > 15 ? 'preserveStartEnd' : 0}
                  angle={evolutionData.length > 15 ? -45 : 0}
                  textAnchor={evolutionData.length > 15 ? "end" : "middle"}
                  height={evolutionData.length > 15 ? 60 : 30}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="solde"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#colorPositive)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Pas de données sur cette période</p>
            </div>
          )}
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          Solde actuel : <span className={`font-bold text-lg ${evolutionData[evolutionData.length - 1]?.solde >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {evolutionData[evolutionData.length - 1]?.solde.toFixed(2)}€
          </span>
        </div>
      </div>

      {/* Barres horizontales des dépenses */}
      <div className="bg-white rounded-lg p-6 shadow-lg lg:col-span-1">
        <h3 className="text-lg font-semibold mb-4">💸 Top dépenses</h3>
        <div className="h-48">
          <CategoryBars data={expenseData} color="#EF4444" />
        </div>
      </div>

      {/* Barres horizontales des revenus */}
      <div className="bg-white rounded-lg p-6 shadow-lg lg:col-span-1">
        <h3 className="text-lg font-semibold mb-4">💰 Top revenus</h3>
        <div className="h-48">
          <CategoryBars data={incomeData} color="#10B981" />
        </div>
      </div>

      {/* Résumé rapide */}
      <div className="bg-white rounded-lg p-6 shadow-lg lg:col-span-1">
        <h3 className="text-lg font-semibold mb-4">📊 Résumé rapide</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Plus grosse dépense</span>
            <span className="font-semibold text-red-600">
              {expenseData[0] ? `${expenseData[0].value.toFixed(0)}€` : '-'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Plus gros revenu</span>
            <span className="font-semibold text-green-600">
              {incomeData[0] ? `${incomeData[0].value.toFixed(0)}€` : '-'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Catégories actives</span>
            <span className="font-semibold">
              {new Set(transactions.map(t => t.category)).size}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Moyenne/transaction</span>
            <span className="font-semibold">
              {transactions.length > 0 
                ? `${(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length).toFixed(0)}€`
                : '-'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}