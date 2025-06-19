export default function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Solde actuel',
      value: `${stats.balance.toFixed(2)}€`,
      icon: '💰',
      color: stats.balance >= 0 ? 'text-green-500' : 'text-red-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Revenus',
      value: `+${stats.totalRevenues.toFixed(2)}€`,
      icon: '📈',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Dépenses',
      value: `-${stats.totalExpenses.toFixed(2)}€`,
      icon: '📉',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Transactions',
      value: stats.transactionCount,
      icon: '📊',
      color: 'text-blue-500',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{card.title}</p>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            </div>
            <div className="text-2xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}