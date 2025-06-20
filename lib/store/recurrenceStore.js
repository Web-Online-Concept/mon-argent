import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import useBudgetStore from './budgetStore'

const useRecurrenceStore = create(
  persist(
    (set, get) => ({
      recurrences: [],
      lastProcessedDate: null,

      // Créer une récurrence (ID corrigé avec timestamp unique)
      createRecurrence: (data) => {
        const recurrence = {
          id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: data.type,
          amount: parseFloat(data.amount),
          category: data.category,
          description: data.description,
          frequency: data.frequency,
          customMonths: data.customMonths || null,
          startDate: new Date(data.startDate).toISOString(),
          endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
          isActive: true,
          createdAt: new Date().toISOString(),
          totalGenerated: 0,
          lastGenerated: null,
          nextDue: null
        }

        recurrence.nextDue = get().calculateNextDue(
          new Date(recurrence.startDate),
          recurrence.frequency,
          recurrence.customMonths
        )

        set((state) => ({
          recurrences: [...state.recurrences, recurrence]
        }))

        return recurrence
      },

      // Supprimer une récurrence (bug fix avec comparaison stricte)
      deleteRecurrence: (id) => {
        set((state) => {
          const newRecurrences = state.recurrences.filter(r => r.id !== id)
          
          if (newRecurrences.length === state.recurrences.length) {
            console.error(`Récurrence ${id} non trouvée`)
            return state
          }
          
          return { recurrences: newRecurrences }
        })
      },

      // Mettre à jour une récurrence
      updateRecurrence: (id, updates) => {
        set((state) => ({
          recurrences: state.recurrences.map(r => {
            if (r.id === id) {
              const updated = { ...r, ...updates }
              
              // Recalculer nextDue si nécessaire
              if (updates.frequency || updates.customMonths || updates.startDate) {
                const baseDate = updated.lastGenerated 
                  ? new Date(updated.lastGenerated) 
                  : new Date(updated.startDate)
                updated.nextDue = get().calculateNextDue(
                  baseDate,
                  updated.frequency,
                  updated.customMonths
                )
              }
              
              return updated
            }
            return r
          })
        }))
      },

      // Traiter les récurrences échues
      processRecurrences: () => {
        const today = new Date()
        const todayStr = today.toDateString()
        
        if (get().lastProcessedDate === todayStr) {
          return { processed: 0, transactions: [] }
        }

        const transactions = []
        
        set((state) => {
          const updatedRecurrences = state.recurrences.map(recurrence => {
            if (!recurrence.isActive || !recurrence.nextDue) return recurrence
            
            const updatedRec = { ...recurrence }
            let nextDueDate = new Date(recurrence.nextDue)
            
            while (nextDueDate <= today) {
              if (recurrence.endDate && nextDueDate > new Date(recurrence.endDate)) {
                updatedRec.isActive = false
                break
              }

              // Générer la transaction
              transactions.push({
                id: Date.now() + Math.random(),
                type: recurrence.type,
                amount: recurrence.amount,
                category: recurrence.category,
                description: `🔄 ${recurrence.description}`,
                date: nextDueDate.toISOString(),
                isRecurring: true,
                recurrenceId: recurrence.id
              })

              updatedRec.totalGenerated++
              updatedRec.lastGenerated = nextDueDate.toISOString()
              
              // Calculer la prochaine échéance
              nextDueDate = new Date(get().calculateNextDue(
                nextDueDate,
                recurrence.frequency,
                recurrence.customMonths
              ))
              updatedRec.nextDue = nextDueDate.toISOString()
            }
            
            return updatedRec
          })

          return {
            recurrences: updatedRecurrences,
            lastProcessedDate: todayStr
          }
        })

        return { processed: transactions.length, transactions }
      },

      // Calculer la prochaine échéance
      calculateNextDue: (fromDate, frequency, customMonths = null) => {
        const nextDate = new Date(fromDate)

        switch (frequency) {
          case 'weekly':
            nextDate.setDate(nextDate.getDate() + 7)
            break
          case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + 1)
            break
          case 'quarterly':
            nextDate.setMonth(nextDate.getMonth() + 3)
            break
          case 'yearly':
            nextDate.setFullYear(nextDate.getFullYear() + 1)
            break
          case 'custom':
            if (customMonths && customMonths > 0) {
              nextDate.setMonth(nextDate.getMonth() + customMonths)
            }
            break
        }

        return nextDate.toISOString()
      }
    }),
    {
      name: () => {
        const prefix = useBudgetStore.getState().getStoragePrefix()
        return `${prefix}budget-recurrences`
      },
    }
  )
)

export default useRecurrenceStore