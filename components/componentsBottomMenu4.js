const BottomMenu4 = ({ activeTab, onTabChange }) => {
  
  const handleVocalClick = () => {
    // Aller à la page d'ajout
    onTabChange('add')
    
    // Après un court délai, scroller vers la section vocale
    setTimeout(() => {
      const voiceSection = document.querySelector('[data-voice-section]')
      if (voiceSection) {
        voiceSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        })
      }
    }, 100)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg sm:hidden z-50">
      <div className="flex">
        {/* Tuto */}
        <button
          onClick={() => onTabChange('tutorial')}
          className={`flex-1 py-2 px-1 transition-colors ${
            activeTab === 'tutorial'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">📚</span>
            <span className="text-xs font-medium">Tuto</span>
          </div>
        </button>

        {/* Mon Solde */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex-1 py-2 px-1 transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">🔵</span>
            <span className="text-xs font-medium">Mon Solde</span>
          </div>
        </button>

        {/* + AJOUT */}
        <button
          onClick={() => onTabChange('add')}
          className={`flex-1 py-2 px-1 transition-colors ${
            activeTab === 'add'
              ? 'bg-green-50 text-green-600'
              : 'text-gray-600 hover:text-green-500'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">🟢</span>
            <span className="text-xs font-medium">+ AJOUT</span>
          </div>
        </button>

        {/* + VOCAL */}
        <button
          onClick={handleVocalClick}
          className="flex-1 py-2 px-1 text-gray-600 hover:text-purple-500 transition-colors"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">🎤</span>
            <span className="text-xs font-medium">+ VOCAL</span>
          </div>
        </button>
      </div>
    </div>
  )
}

export default BottomMenu4