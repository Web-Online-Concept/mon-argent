import { useEffect, useState } from 'react';
import useTransactionStore from '../lib/store/transactionStore';
import useBudgetStore from '../lib/store/budgetStore';

export default function DataMigration({ children }) {
  const [migrationDone, setMigrationDone] = useState(false);
  const { transactionsByBudget } = useTransactionStore();
  const { budgets } = useBudgetStore();
  
  useEffect(() => {
    // Vérifier si la migration a déjà été effectuée
    const migrationKey = 'mon-argent-migration-v2';
    const hasMigrated = localStorage.getItem(migrationKey);
    
    if (!hasMigrated) {
      // Récupérer les anciennes données du localStorage
      const oldData = localStorage.getItem('transaction-storage');
      
      if (oldData) {
        try {
          const parsed = JSON.parse(oldData);
          
          // Si on a des transactions dans l'ancien format
          if (parsed.state && parsed.state.transactions && Array.isArray(parsed.state.transactions)) {
            const oldTransactions = parsed.state.transactions;
            
            // Créer la nouvelle structure
            const newData = {
              state: {
                transactionsByBudget: {
                  'budget-default': oldTransactions.map(t => ({
                    ...t,
                    budgetId: 'budget-default'
                  }))
                }
              },
              version: 2
            };
            
            // Sauvegarder dans le nouveau format
            localStorage.setItem('transaction-storage', JSON.stringify(newData));
            
            // Marquer la migration comme effectuée
            localStorage.setItem(migrationKey, 'done');
            
            console.log('Migration des données effectuée avec succès');
            
            // Recharger la page pour que les stores se mettent à jour
            window.location.reload();
          }
        } catch (error) {
          console.error('Erreur lors de la migration:', error);
        }
      }
      
      // Marquer comme migré même s'il n'y avait pas de données
      localStorage.setItem(migrationKey, 'done');
    }
    
    setMigrationDone(true);
  }, []);
  
  // Afficher un loader pendant la migration
  if (!migrationDone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Migration des données en cours...</p>
        </div>
      </div>
    );
  }
  
  return children;
}