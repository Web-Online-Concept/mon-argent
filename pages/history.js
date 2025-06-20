import { useState } from 'react';
import Head from 'next/head';
import TransactionList from '../components/Transactions/TransactionList';
import useCategoryStore from '../lib/store/categoryStore';
import useBudgetStore from '../lib/store/budgetStore';

export default function History() {
  const { categories } = useCategoryStore();
  const { getCurrentBudget } = useBudgetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const currentBudget = getCurrentBudget();

  return (
    <>
      <Head>
        <title>Historique - Mon Argent</title>
      </Head>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <span>📊</span>
          <span>Historique des transactions</span>
          <span className="text-lg font-normal text-gray-600">
            ({currentBudget?.icon} {currentBudget?.name})
          </span>
        </h1>
        
        {/* Filtres */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Filtres</h2>
          
          {/* Grille équilibrée pour tous les filtres */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Recherche */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Description..."
                className="w-full p-2 border rounded-lg"
              />
            </div>
            
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">Tous</option>
                <option value="income">Revenus</option>
                <option value="expense">Dépenses</option>
              </select>
            </div>
            
            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">Toutes</option>
                {categories
                  .filter(cat => filterType === 'all' || cat.type === filterType)
                  .map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
              </select>
            </div>
            
            {/* Période - conteneur pour les deux dates */}
            <div className="lg:col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full p-2 border rounded-lg text-sm"
                  placeholder="Du"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full p-2 border rounded-lg text-sm"
                  placeholder="Au"
                />
              </div>
            </div>
          </div>
          
          {/* Bouton de réinitialisation */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterCategory('all');
                setDateRange({ start: '', end: '' });
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>
        
        {/* Liste des transactions */}
        <div className="bg-white rounded-lg border p-6">
          <TransactionList 
            searchTerm={searchTerm}
            filterType={filterType}
            filterCategory={filterCategory}
            dateRange={dateRange}
          />
        </div>
      </div>
    </>
  );
}