import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useRecurrenceStore = create(
  persist(
    (set, get) => ({
      recurrences: [],
      
      // Ajouter une récurrence
      addRecurrence: (recurrence) => {
        const newRecurrence = {
          ...recurrence,
          id: `rec-${Date.now()}`,
          lastExecuted: null,
          isActive: true,
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          recurrences: [...state.recurrences, newRecurrence]
        }));
        
        return newRecurrence;
      },
      
      // Mettre à jour une récurrence
      updateRecurrence: (id, updates) => {
        set((state) => ({
          recurrences: state.recurrences.map(rec =>
            rec.id === id ? { ...rec, ...updates } : rec
          )
        }));
      },
      
      // Supprimer une récurrence
      deleteRecurrence: (id) => {
        set((state) => ({
          recurrences: state.recurrences.filter(rec => rec.id !== id)
        }));
      },
      
      // Activer/désactiver une récurrence
      toggleRecurrence: (id) => {
        set((state) => ({
          recurrences: state.recurrences.map(rec =>
            rec.id === id ? { ...rec, isActive: !rec.isActive } : rec
          )
        }));
      },
      
      // Mettre à jour la dernière exécution
      updateLastExecuted: (id, date) => {
        set((state) => ({
          recurrences: state.recurrences.map(rec =>
            rec.id === id ? { ...rec, lastExecuted: date } : rec
          )
        }));
      },
      
      // Obtenir les récurrences actives
      getActiveRecurrences: () => {
        return get().recurrences.filter(rec => rec.isActive);
      },
      
      // Obtenir les récurrences par type
      getRecurrencesByType: (type) => {
        return get().recurrences.filter(rec => rec.type === type);
      },
      
      // Obtenir les récurrences à exécuter
      getRecurrencesToExecute: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return get().recurrences.filter(rec => {
          if (!rec.isActive) return false;
          
          if (!rec.lastExecuted) return true;
          
          const lastExecuted = new Date(rec.lastExecuted);
          lastExecuted.setHours(0, 0, 0, 0);
          
          switch (rec.frequency) {
            case 'daily':
              return lastExecuted < today;
            
            case 'weekly':
              const weekDiff = Math.floor((today - lastExecuted) / (7 * 24 * 60 * 60 * 1000));
              return weekDiff >= 1;
            
            case 'monthly':
              return lastExecuted.getMonth() !== today.getMonth() ||
                     lastExecuted.getFullYear() !== today.getFullYear();
            
            case 'yearly':
              return lastExecuted.getFullYear() !== today.getFullYear();
            
            default:
              return false;
          }
        });
      },
      
      // Propriété calculée pour les récurrences actives
      activeRecurrences: [],
      
      // Initialiser le store
      initialize: () => {
        const state = get();
        set({ activeRecurrences: state.getActiveRecurrences() });
      }
    }),
    {
      name: 'recurrence-storage',
      version: 1,
      onRehydrateStorage: () => (state) => {
        // Mettre à jour les récurrences actives après réhydratation
        if (state) {
          state.initialize();
        }
      }
    }
  )
);

export default useRecurrenceStore;