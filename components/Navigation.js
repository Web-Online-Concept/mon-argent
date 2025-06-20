const Navigation = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'categories', icon: '🏷️', label: 'Catégories' },
    { id: 'history', icon: '📋', label: 'Historique' },
    { id: 'recurrences', icon: '🔄', label: 'Récurrences' },
    { id: 'settings', icon: '⚙️', label: 'Paramètres' },
    { id: 'export', icon: '📊', label: 'Export' },
    { id: 'tutorial', icon: '📚', label: 'Tuto' },
  ]

  return (
    <nav className="mb-8">
      {/* Menu desktop - Grille agrandie */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                activeTab === item.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Menu mobile - Scroll horizontal */}
      <div className="sm:hidden mb-20">
        <div className="flex gap-3 overflow-x-auto pb-2 px-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-shrink-0 p-3 rounded-lg border-2 transition-all min-w-[80px] ${
                activeTab === item.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-medium text-center">{item.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation