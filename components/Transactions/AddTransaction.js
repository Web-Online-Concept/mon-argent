import TransactionForm from './TransactionForm'
import VoiceInput from '../Voice/VoiceInput'

export default function AddTransaction() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Section reconnaissance vocale */}
      <VoiceInput />

      {/* Formulaire manuel */}
      <TransactionForm />
    </div>
  )
}