const BottomMenu = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg sm:hidden z-50">
      <div className="flex">
        {/* TUTO */}
        <button
          onClick={() => onTabChange('tutorial')}
          className={`flex-1 py-3 px-2 transition-colors ${
            activeTab === 'tutorial'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">📚</span>
            <span className="text-xs font-medium">TUTO</span>
          </div>
        </button>

        {/* MON SOLDE */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex-1 py-3 px-2 transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg">🔵</span>
            <span className="text-xs font-medium">MON SOLDE</span>
          </div>
        </button>

        {/* + AJOUT */}
        <button
          onClick={() => onTabChange('add')}
          className={`flex-1 py-3 px-2 transition-colors ${
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
      </div>
    </div>
  )
}

export default BottomMenu