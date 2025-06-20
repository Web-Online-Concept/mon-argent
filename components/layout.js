import Navigation from './Navigation';
import BottomMenu from './BottomMenu';
import BudgetSelector from './BudgetSelector';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec navigation desktop */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">💰 Mon Argent</h1>
              <BudgetSelector />
            </div>
            
            {/* Navigation desktop */}
            <div className="hidden md:block">
              <Navigation />
            </div>
          </div>
        </div>
      </header>
      
      {/* Contenu principal */}
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      
      {/* Menu mobile en bas */}
      <div className="md:hidden">
        <BottomMenu />
      </div>
      
      {/* Footer desktop */}
      <footer className="hidden md:block bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2024 Mon Argent - Web Online Concept
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/legal/mentions" className="text-gray-600 hover:text-gray-900">
                Mentions légales
              </a>
              <a href="/legal/cgu" className="text-gray-600 hover:text-gray-900">
                CGU
              </a>
              <a href="/legal/confidentialite" className="text-gray-600 hover:text-gray-900">
                Confidentialité
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}