import { useState } from 'react';
import useTransactionStore from '../lib/store/transactionStore';
import useCategoryStore from '../lib/store/categoryStore';
import useBudgetStore from '../lib/store/budgetStore';
import useRecurrenceStore from '../lib/store/recurrenceStore';

export default function ExportData() {
  const { getTransactions } = useTransactionStore();
  const { categories } = useCategoryStore();
  const { currentBudgetId, getCurrentBudget, budgets, isMainBudget } = useBudgetStore();
  const { recurrences } = useRecurrenceStore();
  const [format, setFormat] = useState('json');
  const [exportScope, setExportScope] = useState('current'); // 'current' ou 'all'

  const currentBudget = getCurrentBudget();

  const exportData = () => {
    let dataToExport = {};
    
    if (exportScope === 'current') {
      // Exporter uniquement le budget actuel
      const transactions = getTransactions(currentBudgetId);
      
      if (format === 'json') {
        dataToExport = {
          budget: currentBudget,
          transactions,
          categories,
          recurrences,
          exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mon-argent-${currentBudget.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        const csvRows = ['Date,Type,Montant,Catégorie,Description,Budget'];
        
        transactions.forEach(transaction => {
          const category = categories.find(c => c.id === transaction.categoryId);
          const sourceBudget = budgets.find(b => b.id === transaction.budgetId);
          const row = [
            transaction.date,
            transaction.type === 'income' ? 'Revenu' : 'Dépense',
            transaction.amount.toFixed(2),
            category ? category.name : 'Sans catégorie',
            `"${(transaction.description || '').replace(/"/g, '""')}"`,
            sourceBudget ? sourceBudget.name : currentBudget.name
          ].join(',');
          csvRows.push(row);
        });
        
        const csvContent = '\ufeff' + csvRows.join('\n'); // BOM pour Excel
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mon-argent-${currentBudget.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } else {
      // Exporter tous les budgets
      const allData = {
        budgets: budgets,
        transactionsByBudget: {},
        categories,
        recurrences,
        exportDate: new Date().toISOString()
      };
      
      // Collecter les transactions de chaque budget
      budgets.forEach(budget => {
        if (!budget.isMain) {
          allData.transactionsByBudget[budget.id] = getTransactions(budget.id);
        }
      });
      
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mon-argent-complet-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        const csvRows = ['Date,Type,Montant,Catégorie,Description,Budget'];
        
        Object.entries(allData.transactionsByBudget).forEach(([budgetId, transactions]) => {
          const budget = budgets.find(b => b.id === budgetId);
          transactions.forEach(transaction => {
            const category = categories.find(c => c.id === transaction.categoryId);
            const row = [
              transaction.date,
              transaction.type === 'income' ? 'Revenu' : 'Dépense',
              transaction.amount.toFixed(2),
              category ? category.name : 'Sans catégorie',
              `"${(transaction.description || '').replace(/"/g, '""')}"`,
              budget ? budget.name : 'Budget inconnu'
            ].join(',');
            csvRows.push(row);
          });
        });
        
        const csvContent = '\ufeff' + csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mon-argent-complet-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Exporter les données</h2>
      
      {/* Scope d'export */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Données à exporter
        </label>
        <select
          value={exportScope}
          onChange={(e) => setExportScope(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="current">
            {isMainBudget() ? 'Toutes les transactions (vue agrégée)' : `Budget actuel (${currentBudget?.name})`}
          </option>
          <option value="all">Tous les budgets (export complet)</option>
        </select>
      </div>
      
      {/* Format */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Format d'export
        </label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="json">JSON (sauvegarde complète)</option>
          <option value="csv">CSV (pour Excel)</option>
        </select>
      </div>
      
      <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        {format === 'json' ? (
          <p>Le format JSON contient toutes les données et peut être réimporté ultérieurement.</p>
        ) : (
          <p>Le format CSV peut être ouvert dans Excel ou Google Sheets pour analyse.</p>
        )}
      </div>
      
      <button
        onClick={exportData}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        Télécharger ({format.toUpperCase()})
      </button>
    </div>
  );
}