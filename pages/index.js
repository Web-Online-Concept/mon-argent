import { useState } from 'react'
import Head from 'next/head'
import Navigation from '../components/Navigation'
import PrimaryActions from '../components/PrimaryActions'
import BottomMenu from '../components/BottomMenu'
import BudgetSelector from '../components/BudgetSelector'
import Dashboard from '../components/Dashboard/Dashboard'
import AddTransaction from '../components/Transactions/AddTransaction'
import TransactionList from '../components/Transactions/TransactionList'
import CategoryManager from '../components/Categories/CategoryManager'
import RecurrenceManager from '../components/Recurrences/RecurrenceManager'
import SettingsManager from '../components/Settings/SettingsManager'
import ExportManager from '../components/Export/ExportManager'
import Tutorial from '../components/Tutorial/Tutorial'
import Footer from '../components/Footer'
import useTransactionStore from '../lib/store/transactionStore'
import useCategoryStore from '../lib/store/categoryStore'
import useRecurrenceStore from '../lib/store/recurrenceStore'
import useBudgetStore from '../lib/store/budgetStore'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const activeBudget = useBudgetStore(state => state.getActiveBudget())

  // Fonction pour rendre le contenu selon l'onglet actif
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'add':
        return <AddTransaction />
      case 'categories':
        return <CategoryManager />
      case 'history':
        return <TransactionList />
      case 'recurrences':
        return <RecurrenceManager />
      case 'settings':
        return <SettingsManager />
      case 'export':
        return <ExportManager />
      case 'tutorial':
        return <Tutorial />
      default:
        return null
    }
  }

  return (
    <>
      <Head>
        <title>{activeBudget.name} - Mon Argent</title>
      </Head>
      
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        {/* Contenu principal */}
        <main className="flex-1">
          <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8 pb-24 sm:pb-8">
            {/* Header avec sélecteur de budgets */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex flex-col items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">💰 Mon Argent</h1>
                  <p className="text-sm sm:text-base text-gray-600">Gérez votre budget simplement</p>
                </div>
                <BudgetSelector />
              </div>
            </div>

            {/* Boutons principaux (Desktop uniquement) */}
            <PrimaryActions onTabChange={setActiveTab} />

            {/* Navigation principale */}
            <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Contenu dynamique */}
            <div className="w-full overflow-x-hidden">
              {renderContent()}
            </div>
          </div>
        </main>

        {/* Footer (Desktop uniquement) */}
        <div className="hidden sm:block">
          <Footer />
        </div>

        {/* Bottom Menu (Mobile uniquement) */}
        <BottomMenu activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </>
  )
}