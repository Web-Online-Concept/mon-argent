import { useState, useEffect } from 'react';
import useTransactionStore from '../lib/store/transactionStore';
import useCategoryStore from '../lib/store/categoryStore';
import useBudgetStore from '../lib/store/budgetStore';
import Link from 'next/link';

export default function Dashboard() {
  const { getBalance, getStats, getTransactions } = useTransactionStore();
  const { currentBudgetId, getCurrentBudget, isMainBudget, budgets } = useBudgetStore();
  const { categories } = useCategoryStore();
  const [period, setPeriod] = useState('month');
  
  const currentBudget = getCurrentBudget();
  const balance = getBalance(currentBudgetId);
  const stats = getStats(currentBudgetId, period);
  const transactions = getTransactions(currentBudgetId);

  // Calculer les dépenses par catégorie
  const expensesByCategory = categories
    .filter(cat => cat.type === 'expense')
    .map(category => {
      const categoryTransactions = transactions.filter(t => 
        t.categoryId === category.id && 
        t.type === 'expense'
      );
      
      const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      return {
        ...category,
        total,
        percentage: stats.expenses > 0 ? (total / stats.expenses) * 100 : 0
      };
    })
    .filter(cat => cat.total > 0)
    .sort((a, b) => b.total - a.total);

  // Si on est sur le budget principal, afficher aussi les statistiques par budget
  const budgetStats = isMainBudget() ? budgets
    .filter(b => !b.isMain)
    .map(budget => ({
      ...budget,
      balance: getBalance(budget.id),
      stats: getStats(budget.id, period)
    }))
    .filter(b => b.stats.transactionCount > 0) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* En-tête avec sélecteur de période */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span>{currentBudget?.icon}</span>
            <span>{currentBudget?.name}</span>
          </h1>
          {isMainBudget() && (
            <p className="text-gray-600 mt-2">Vue d'ensemble de tous vos budgets</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              period === 'month'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ce mois
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              period === 'year'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cette année
          </button>
          <button
            onClick={() => setPeriod('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              period === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tout
          </button>
        </div>
      </div>

      {/* Carte du solde principal */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-100 text-lg">Solde total</p>
            <p className="text-5xl font-bold mt-2">
              {balance.toLocaleString('fr-FR', { 
                style: 'currency', 
                currency: 'EUR' 
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">
              {stats.transactionCount} transaction{stats.transactionCount > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques par budget (seulement pour le budget principal) */}
      {isMainBudget() && budgetStats.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Répartition par budget</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {budgetStats.map(budget => (
              <div key={budget.id} className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{budget.icon}</span>
                  <h3 className="font-medium">{budget.name}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Solde</span>
                    <span className={`font-semibold ${budget.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {budget.balance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenus</span>
                    <span className="text-green-600">
                      +{budget.stats.income.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Dépenses</span>
                    <span className="text-red-600">
                      -{budget.stats.expenses.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cartes de statistiques */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600">Revenus</h3>
            <span className="text-green-500 text-2xl">💰</span>
          </div>
          <p className="text-2xl font-semibold text-green-600">
            +{stats.income.toLocaleString('fr-FR', { 
              style: 'currency', 
              currency: 'EUR' 
            })}
          </p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600">Dépenses</h3>
            <span className="text-red-500 text-2xl">💸</span>
          </div>
          <p className="text-2xl font-semibold text-red-600">
            -{stats.expenses.toLocaleString('fr-FR', { 
              style: 'currency', 
              currency: 'EUR' 
            })}
          </p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600">Économies</h3>
            <span className="text-blue-500 text-2xl">🏦</span>
          </div>
          <p className={`text-2xl font-semibold ${stats.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {stats.balance.toLocaleString('fr-FR', { 
              style: 'currency', 
              currency: 'EUR' 
            })}
          </p>
        </div>
      </div>

      {/* Répartition des dépenses par catégorie */}
      {expensesByCategory.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-6">Répartition des dépenses</h2>
          <div className="space-y-4">
            {expensesByCategory.map(category => (
              <div key={category.id}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="text-gray-600">
                    {category.total.toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link 
          href="/add"
          className={`block text-center py-4 px-6 rounded-lg font-medium transition-colors ${
            isMainBudget() 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          onClick={(e) => {
            if (isMainBudget()) {
              e.preventDefault();
              alert('Sélectionnez un budget spécifique pour ajouter une transaction');
            }
          }}
        >
          Ajouter une transaction
        </Link>
        <Link 
          href="/history"
          className="block text-center py-4 px-6 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Voir l'historique
        </Link>
      </div>
    </div>
  );
}