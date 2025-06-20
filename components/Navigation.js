const Navigation = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'categories', icon: '🏷️', label: 'Catégories' },
    { id: 'history', icon: '📋', label: 'Historique' },
    { id: 'recurrences', icon: '🔄', label: 'Récurrences' },
    { id: 'settings', icon: '⚙️', label: 'Paramètres' },
    { id: 'export', icon: '📊', label: 'Export' },
    { id: 'tutorial', icon: '📚', label: 'Tuto' },
  ]

  // Filtrer le tutorial pour mobile (déjà dans le bottom menu)
  const mobileMenuItems = menuItems.filter(item => item.id !== 'tutorial')const Navigation = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'categories', icon: '🏷️', label: 'Catégories' },
    { id: 'history', icon: '📋', label: 'Historique' },
    { id: 'recurrences', icon: '🔄', label: 'Récurrences' },
    { id: 'settings', icon: '⚙️', label: 'Paramètres' },
    { id: 'export', icon: '📊', label: 'Export' },
    { id: 'tutorial', icon: '📚', label: 'Tuto' },
  ]

  // Filtrer le tutorial pour mobile (déjà dans le bottom menu)
  const mobileMenuItems = menuItems.filter(item => item.id !== 'tutorial')

  return (
    <nav className="mb-6 sm:mb-8">
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

      {/* Menu mobile - 2 lignes (5 boutons sans TUTO) */}
      <div className="sm:hidden mb-6">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {/* Première ligne - 3 premiers éléments */}
          {mobileMenuItems.slice(0, 3).map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                activeTab === item.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
              </div>
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {/* Deuxième ligne - 2 derniers éléments */}
          {mobileMenuItems.slice(3, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                activeTab === item.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation