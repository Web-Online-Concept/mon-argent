import { useState, useEffect, useRef } from 'react'
import useTransactionStore from '../../lib/store/transactionStore'
import useCategoryStore from '../../lib/store/categoryStore'

export default function VoiceInput() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [status, setStatus] = useState('🎤 Cliquez sur le microphone pour commencer')
  const [recognition, setRecognition] = useState(null)
  const finalTranscriptRef = useRef('')

  const addTransaction = useTransactionStore(state => state.addTransaction)
  const getCategoryFromDescription = useCategoryStore(state => state.getCategoryFromDescription)

  // Fonction pour la synthèse vocale
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Annuler toute synthèse en cours
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'fr-FR'
      utterance.rate = 1.1 // Un peu plus rapide
      utterance.pitch = 1.0
      utterance.volume = 0.5 // Volume modéré
      
      window.speechSynthesis.speak(utterance)
    }
  }

  useEffect(() => {
    // Initialiser la reconnaissance vocale
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'fr-FR'
      recognitionInstance.maxAlternatives = 3

      recognitionInstance.onstart = () => {
        setIsListening(true)
        setStatus('🎤 En écoute... Cliquez à nouveau pour arrêter !')
        setTranscript('')
        finalTranscriptRef.current = ''
        speak('Je vous écoute')
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
        
        const finalText = finalTranscriptRef.current.trim()
        console.log('🎤 Texte final:', finalText)
        
        if (finalText) {
          setStatus(`⚡ Traitement: "${finalText}"`)
          setTimeout(() => {
            parseVoiceCommand(finalText.toLowerCase())
          }, 300)
        } else {
          setStatus('🔇 Aucune parole détectée - Réessayez')
          speak('Je n\'ai rien entendu')
        }
      }

      recognitionInstance.onresult = (event) => {
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript
          
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += transcriptPart + ' '
          } else {
            interimTranscript += transcriptPart
          }
        }
        
        const displayText = (finalTranscriptRef.current + interimTranscript).trim()
        if (displayText) {
          setTranscript(displayText)
          setStatus(`🎤 "${displayText}" - Cliquez STOP quand fini !`)
        }
      }

      recognitionInstance.onerror = (event) => {
        setIsListening(false)
        let errorMessage = ''
        let spokenMessage = ''
        
        switch(event.error) {
          case 'not-allowed':
            errorMessage = '❌ Accès microphone refusé'
            spokenMessage = 'Accès au microphone refusé'
            break
          case 'no-speech':
            errorMessage = '🔇 Aucune parole détectée'
            spokenMessage = 'Je n\'ai rien entendu'
            break
          default:
            errorMessage = `❓ Erreur: ${event.error}`
            spokenMessage = 'Une erreur est survenue'
        }
        
        setStatus(errorMessage)
        speak(spokenMessage)
      }

      setRecognition(recognitionInstance)
    } else {
      setStatus('❌ Reconnaissance vocale non supportée')
    }
  }, [])

  const toggleListening = () => {
    if (!recognition) return

    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
    }
  }

  const parseVoiceCommand = (command) => {
    console.log('🎤 Analyse:', command)
    
    // Nettoyage du texte
    let cleanCommand = command
      .replace(/vingt-deux/gi, '22')
      .replace(/trente/gi, '30')
      .replace(/quarante/gi, '40')
      .replace(/cinquante/gi, '50')
      .replace(/soixante/gi, '60')
      .replace(/soixante-dix/gi, '70')
      .replace(/quatre-vingts?/gi, '80')
      .replace(/quatre-vingt-dix/gi, '90')
      .replace(/cent/gi, '100')
      .replace(/mille/gi, '1000')
      .replace(/,(\d{1,2})(?!\d)/g, '.$1')
      .replace(/euros?\s+(\d{1,2})(?!\d)/gi, '€$1')
      .trim()

    console.log('🧹 Commande nettoyée:', cleanCommand)

    // Patterns de reconnaissance
    const patterns = [
      // Pattern dépense
      /(?:dépense|dépensé|acheté|payé|perdu)\s+(?:de\s+)?(\d+)(?:[.,](\d{1,2}))?\s*(?:€|euros?)?\s*(?:pour\s+|en\s+|de\s+|au\s+|aux\s+|chez\s+)?(.+)/i,
      // Pattern revenu
      /(?:gagné|reçu|touché|gain|salaire)\s+(?:de\s+)?(\d+)(?:[.,](\d{1,2}))?\s*(?:€|euros?)?\s*(.*)$/i,
      // Pattern montant d'abord
      /(\d+)(?:[.,](\d{1,2}))?\s*(?:€|euros?)\s+(.+)/i,
      // Pattern description puis montant
      /(.+?)\s+(\d+)(?:[.,](\d{1,2}))?\s*(?:€|euros?)$/i
    ]

    let matched = false
    
    for (let i = 0; i < patterns.length; i++) {
      const match = cleanCommand.match(patterns[i])
      
      if (match) {
        console.log(`✅ Pattern ${i + 1} matched:`, match)
        
        let amount = 0
        let description = ''
        let type = 'debit'
        
        if (i === 0) {
          // Dépense
          amount = parseInt(match[1]) + (parseInt(match[2] || 0) / 100)
          description = match[3] || 'Dépense vocale'
          type = 'debit'
        } else if (i === 1) {
          // Revenu
          amount = parseInt(match[1]) + (parseInt(match[2] || 0) / 100)
          description = match[3] || 'Revenu vocal'
          type = 'credit'
        } else if (i === 2) {
          // Montant puis description
          amount = parseInt(match[1]) + (parseInt(match[2] || 0) / 100)
          description = match[3] || 'Transaction vocale'
          type = /gagné|reçu|salaire|revenus?/i.test(command) ? 'credit' : 'debit'
        } else {
          // Description puis montant
          amount = parseInt(match[2]) + (parseInt(match[3] || 0) / 100)
          description = match[1] || 'Transaction vocale'
          type = /gagné|reçu|salaire|revenus?/i.test(description) ? 'credit' : 'debit'
        }

        if (amount > 0) {
          const category = getCategoryFromDescription(description)
          
          addTransaction({
            type,
            amount,
            category,
            description: description.trim()
          })

          setStatus(`✅ Ajouté: ${type === 'credit' ? '+' : '-'}${amount.toFixed(2)}€ (${category})`)
          setTranscript('')
          matched = true
          
          // Synthèse vocale de confirmation
          const typeText = type === 'credit' ? 'Revenu' : 'Dépense'
          speak(`${typeText} de ${amount} euros ajoutée. Catégorie: ${category}`)
          
          break
        }
      }
    }

    if (!matched) {
      console.log('❌ Aucun pattern ne correspond')
      setStatus(`❌ Non reconnu: "${command}". Essayez: "Dépense 25 euros courses"`)
      speak('Je n\'ai pas compris. Essayez par exemple: dépense 25 euros courses')
    }
  }

  return (
    <div className="bg-white rounded-lg p-8 shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-6">🎤 Commande vocale</h2>
      
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>Status :</strong> <span>{status}</span>
        </p>
      </div>

      <button 
        onClick={toggleListening}
        className={`w-24 h-24 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-105 mx-auto ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-blue-500 hover:bg-blue-600'
        } shadow-lg`}
      >
        <span className="text-3xl md:text-2xl">{isListening ? '🛑' : '🎤'}</span>
      </button>

      {transcript && (
        <p className="mt-4 text-gray-600 italic">"{transcript}"</p>
      )}

      <div className="mt-6 text-sm text-gray-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium mb-2">⚡ Mode rapide :</p>
            <div className="space-y-1 text-xs">
              <p><strong>1️⃣</strong> Cliquez le micro → Parlez</p>
              <p><strong>2️⃣</strong> Re-cliquez dès que fini</p>
              <p className="text-blue-600">💡 Validation instantanée !</p>
            </div>
          </div>
          <div>
            <p className="font-medium mb-2">💬 Exemples :</p>
            <div className="space-y-1 text-xs">
              <p>"Dépense 25 euros courses"</p>
              <p>"J'ai payé 50 euros restaurant"</p>
              <p>"Gagné 1500 euros salaire"</p>
              <p>"J'ai dépensé 22 euros 30 essence"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}