import { useState, useRef, useEffect } from 'react'
import useTransactionStore from '../../lib/store/transactionStore'
import useCategoryStore from '../../lib/store/categoryStore'

export default function VoiceInput() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [processingResult, setProcessingResult] = useState('')
  
  const recognition = useRef(null)
  const addTransaction = useTransactionStore(state => state.addTransaction)
  const categories = useCategoryStore(state => state.getAllCategories())

  useEffect(() => {
    // Vérifier si la reconnaissance vocale est supportée
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true)
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognition.current = new SpeechRecognition()
      
      recognition.current.continuous = false
      recognition.current.interimResults = false
      recognition.current.lang = 'fr-FR'
      
      recognition.current.onresult = (event) => {
        const speechResult = event.results[0][0].transcript
        setTranscript(speechResult)
        processVoiceInput(speechResult)
      }
      
      recognition.current.onerror = (event) => {
        console.error('Erreur reconnaissance vocale:', event.error)
        setIsListening(false)
        setProcessingResult('❌ Erreur lors de la reconnaissance vocale')
      }
      
      recognition.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const startListening = () => {
    if (recognition.current && !isListening) {
      setTranscript('')
      setProcessingResult('')
      setIsListening(true)
      recognition.current.start()
    }
  }

  const stopListening = () => {
    if (recognition.current && isListening) {
      recognition.current.stop()
      setIsListening(false)
    }
  }

  const processVoiceInput = (text) => {
    setProcessingResult('⏳ Traitement en cours...')
    
    try {
      // Détecter le type (dépense par défaut)
      const creditWords = ['revenu', 'revenus', 'gagné', 'reçu', 'salaire', 'crédit']
      const isCredit = creditWords.some(word => 
        text.toLowerCase().includes(word)
      )
      
      // Extraire le montant
      const amountMatch = text.match(/(\d+(?:[,.]?\d+)?)/);
      const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '.')) : null
      
      if (!amount) {
        setProcessingResult('❌ Aucun montant détecté. Dites par exemple "Dépense 20 euros courses"')
        return
      }
      
      // Détecter la catégorie
      const detectedCategory = categories.find(cat => 
        text.toLowerCase().includes(cat.toLowerCase())
      )
      
      // Créer la description
      let description = text
        .replace(/(\d+(?:[,.]?\d+)?)/g, '') // Retirer le montant
        .replace(/(euro|euros|€)/gi, '') // Retirer "euro"
        .replace(/(dépense|revenu|gagné|reçu)/gi, '') // Retirer les mots-clés
        .trim()
      
      if (!description) {
        description = isCredit ? 'Revenu vocal' : 'Dépense vocale'
      }
      
      // Ajouter la transaction
      const transaction = {
        type: isCredit ? 'credit' : 'debit',
        amount: amount,
        category: detectedCategory || 'Autre',
        description: description
      }
      
      const result = addTransaction(transaction)
      
      if (result) {
        setProcessingResult(`✅ ${isCredit ? 'Revenu' : 'Dépense'} de ${amount}€ ajouté${detectedCategory ? ` (${detectedCategory})` : ''}`)
      } else {
        setProcessingResult('❌ Erreur lors de l\'ajout de la transaction')
      }
      
    } catch (error) {
      console.error('Erreur traitement vocal:', error)
      setProcessingResult('❌ Erreur lors du traitement vocal')
    }
  }

  const clearResults = () => {
    setTranscript('')
    setProcessingResult('')
  }

  if (!isSupported) {
    return (
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg" data-voice-section>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">🎤 Commande vocale</h2>
        <div className="text-center text-gray-500">
          <p>❌ La reconnaissance vocale n'est pas supportée par votre navigateur</p>
          <p className="text-sm mt-2">Utilisez Chrome ou Safari pour cette fonctionnalité</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg" data-voice-section>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">🎤 Commande vocale</h2>
      
      <div className="text-center space-y-4">
        {/* Bouton principal */}
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isListening ? '🔴 Arrêter l\'écoute' : '🎤 Commencer à parler'}
        </button>
        
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <p className="font-medium text-blue-800 mb-2">💡 Exemples de phrases :</p>
          <div className="text-blue-700 space-y-1 text-left">
            <p>• "Dépense 15 euros restaurant"</p>
            <p>• "Revenu 1200 euros salaire"</p>
            <p>• "25 euros courses Carrefour"</p>
          </div>
        </div>
        
        {/* Résultats */}
        {transcript && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="font-medium text-gray-700 mb-1">🎯 Texte détecté :</p>
            <p className="text-gray-600 italic">"{transcript}"</p>
          </div>
        )}
        
        {processingResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-700">{processingResult}</p>
          </div>
        )}
        
        {/* Bouton de nettoyage */}
        {(transcript || processingResult) && (
          <button
            onClick={clearResults}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            🧹 Effacer les résultats
          </button>
        )}
      </div>
    </div>
  )
}