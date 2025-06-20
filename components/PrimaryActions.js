import { useState } from 'react'

const PrimaryActions = ({ onTabChange }) => {
  return (
    <div className="hidden sm:flex gap-4 mb-6">
      {/* Bouton Mon Solde (maintenant à gauche) */}
      <button 
        onClick={() => onTabChange('dashboard')}
        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">🔵</span>
          <span>Mon Solde</span>
        </div>
        <div className="text-sm opacity-90 mt-1">
          Tableau de bord
        </div>
      </button>

      {/* Bouton + AJOUT (maintenant à droite) */}
      <button 
        onClick={() => onTabChange('add')}
        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">🟢</span>
          <span>+ AJOUT</span>
        </div>
        <div className="text-sm opacity-90 mt-1">
          Ajouter une transaction
        </div>
      </button>
    </div>
  )
}

export default PrimaryActions