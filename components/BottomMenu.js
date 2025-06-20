const BottomMenu = ({ activeTab, onTabChange }) => {
  
  const handleSoldeClick = () => {
    // Aller au dashboard
    onTabChange('dashboard')
    
    // Après un court délai, scroller vers le haut de la page
    setTimeout(() => {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      })
    }, 100)
  }

  const handleAjoutClick = () => {
    // Aller à la page d'ajout
    onTabChange('add')
    
    // Après un court délai, scroller vers le bas de la page
    setTimeout(() => {
      window.scrollTo({ 
        top: document.body.scrollHeight, 
        behavior: 'smooth' 
      })
    }, 100)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg sm:hidden z-50">
      <div className="flex">
        {/* MON SOLDE */}
        <button
          onClick={handleSoldeClick}
          className={`flex-1 py-3 px-1 transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">👛</span>
            <span className="text-xs font-medium">MON SOLDE</span>
          </div>
        </button>

        {/* + AJOUT */}
        <button
          onClick={handleAjoutClick}
          className={`flex-1 py-3 px-1 transition-colors ${
            activeTab === 'add'
              ? 'bg-green-50 text-green-600'
              : 'text-gray-600 hover:text-green-500'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">💵</span>
            <span className="text-xs font-medium">+ AJOUT</span>
          </div>
        </button>
      </div>
    </div>
  )
}

export default BottomMenu>
          </div>
        </button>

        {/* + AJOUT */}
        <button
          onClick={() => onTabChange('add')}
          className={`flex-1 py-3 px-1 transition-colors ${
            activeTab === 'add'
              ? 'bg-green-50 text-green-600'
              : 'text-gray-600 hover:text-green-500'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">💵</span>
            <span className="text-xs font-medium">+ AJOUT</span>
          </div>
        </button>
      </div>
    </div>
  )
}

export default BottomMenu