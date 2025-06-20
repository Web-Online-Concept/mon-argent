import TransactionForm from './TransactionForm'
import VoiceInput from '../Voice/VoiceInput'

export default function AddTransaction() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Layout Desktop : Côte à côte */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Saisie manuelle à gauche */}
            <div className="order-1">
              <TransactionForm />
            </div>
            
            {/* Commande vocale à droite */}
            <div className="order-2">
              <VoiceInput />
            </div>
          </div>
        </div>

        {/* Layout Mobile : Saisie manuelle en premier */}
        <div className="sm:hidden space-y-6">
          {/* Saisie manuelle en premier sur mobile */}
          <TransactionForm />
          
          {/* Commande vocale en second */}
          <VoiceInput />
        </div>
        
      </div>
    </div>
  )
}