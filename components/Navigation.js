import { useState } from 'react'

export default function Navigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: '📊' },
    { id: 'add', label: 'Ajouter', icon: '➕' },
    { id: 'categories', label: 'Catégories', icon: '🏷️' },
    { id: 'history', label: 'Historique', icon: '📋' },
    { id: 'recurrences', label: 'Récurrences', icon: '🔄' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' },
    { id: 'export', label: 'Export', icon: '📤' },
    { id: 'tutorial', label: 'Aide', icon: '❓' }
  ]

  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-lg p-1 shadow-lg">
        <div className="flex flex-wrap justify-center gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-2 rounded-md font-medium transition-all text-sm ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}