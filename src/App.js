import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Download, Upload, TrendingUp, Home, History, X, Check, Trash2, Edit, Settings, FileText, HelpCircle } from 'lucide-react';

// Composant formulaire manuel séparé pour éviter les problèmes de focus
const ManualTransactionForm = ({ categories, addTransaction, manualType, setManualType }) => {
  const [manualAmount, setManualAmount] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualCategory, setManualCategory] = useState('Autres');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (manualAmount && manualDescription) {
      addTransaction(manualAmount, manualDescription, manualCategory, manualType);
      
      // Réinitialiser le formulaire
      setManualAmount('');
      setManualDescription('');
      setManualCategory('Autres');
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Saisie manuelle</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setManualType('debit')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                manualType === 'debit' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Débit
            </button>
            <button
              type="button"
              onClick={() => setManualType('credit')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                manualType === 'credit' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Crédit
            </button>
          </div>
          
          <input
            type="text"
            inputMode="decimal"
            placeholder="Montant (€)"
            value={manualAmount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                setManualAmount(value);
              }
            }}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={manualDescription}
            onChange={(e) => setManualDescription(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={manualCategory}
            onChange={(e) => setManualCategory(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Valider
          </button>
        </div>
      </form>
    </div>
  );
};

const App = () => {
  // États globaux
  const [currentPage, setCurrentPage] = useState('home');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(['Courses', 'Transport', 'Loisirs', 'Santé', 'Logement', 'Autres']);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [filter, setFilter] = useState({ period: 'all', category: 'all', startDate: '', endDate: '' });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [initialBalance, setInitialBalance] = useState(0);
  const [notification, setNotification] = useState('');
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Traiter le transcript quand il change et que l'enregistrement est arrêté
  useEffect(() => {
    if (!isRecording && transcript && currentPage === 'home') {
      console.log('Processing transcript:', transcript, 'Page:', currentPage); // DEBUG
      const timer = setTimeout(() => {
        processVoiceTransaction(transcript);
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, transcript, currentPage]);

  // Chargement des données au démarrage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    const savedCategories = localStorage.getItem('categories');
    const savedBalance = localStorage.getItem('initialBalance');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
    if (savedBalance) setInitialBalance(parseFloat(savedBalance));
  }, []);

  // Sauvegarde automatique
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('initialBalance', initialBalance.toString());
  }, [initialBalance]);

  // Réinitialiser la transcription quand on change de page
  useEffect(() => {
    if (currentPage !== 'home') {
      setTranscript('');
      setIsRecording(false);
    }
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Initialisation de la reconnaissance vocale
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false; // Important pour mobile
        recognitionRef.current.interimResults = false; // Évite les répétitions
        recognitionRef.current.lang = 'fr-FR';

        recognitionRef.current.onresult = (event) => {
          // Prendre seulement le dernier résultat
          const lastResult = event.results[event.results.length - 1];
          if (lastResult.isFinal) {
            setTranscript(lastResult[0].transcript);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Erreur de reconnaissance vocale:', event.error);
          if (event.error !== 'no-speech') {
            setIsRecording(false);
          }
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ajouter une transaction
  const addTransaction = (amount, description, category, type, date = new Date().toISOString()) => {
    const newTransaction = {
      id: Date.now(),
      amount: parseFloat(amount),
      description,
      category,
      type,
      date
    };
    setTransactions(prev => [...prev, newTransaction]);
    
    // Déclencher la notification
    const message = `✓ ${type === 'credit' ? 'Crédit' : 'Débit'} de ${amount}€ enregistré !`;
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  // Traitement de la transaction vocale avec détection automatique du type
  const processVoiceTransaction = (text) => {
    const amountMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:€|euros?)?/i);
    if (amountMatch) {
      const amount = parseFloat(amountMatch[1].replace(',', '.'));
      const description = text.replace(amountMatch[0], '').trim() || 'Transaction vocale';
      
      // Détection automatique du type (crédit/débit)
      const lowerText = text.toLowerCase();
      let type = 'debit'; // Par défaut
      
      if (lowerText.includes('salaire') || lowerText.includes('virement') || 
          lowerText.includes('remboursement') || lowerText.includes('crédit') ||
          lowerText.includes('reçu') || lowerText.includes('gagné')) {
        type = 'credit';
      }
      
      // Détection automatique de la catégorie
      let detectedCategory = 'Autres';
      if (lowerText.includes('courses') || lowerText.includes('auchan') || lowerText.includes('carrefour') || lowerText.includes('leclerc')) {
        detectedCategory = 'Courses';
      } else if (lowerText.includes('essence') || lowerText.includes('train') || lowerText.includes('bus') || lowerText.includes('métro')) {
        detectedCategory = 'Transport';
      } else if (lowerText.includes('restaurant') || lowerText.includes('cinéma') || lowerText.includes('sortie')) {
        detectedCategory = 'Loisirs';
      } else if (lowerText.includes('médecin') || lowerText.includes('pharmacie') || lowerText.includes('docteur')) {
        detectedCategory = 'Santé';
      } else if (lowerText.includes('loyer') || lowerText.includes('électricité') || lowerText.includes('eau')) {
        detectedCategory = 'Logement';
      }

      addTransaction(amount, description, detectedCategory, type);
      
      // Confirmation vocale
      const utterance = new SpeechSynthesisUtterance(`Transaction enregistrée : ${type === 'credit' ? 'crédit' : 'débit'} de ${amount} euros pour ${description}`);
      utterance.lang = 'fr-FR';
      window.speechSynthesis.speak(utterance);
    } else {
      const utterance = new SpeechSynthesisUtterance("Je n'ai pas détecté de montant. Veuillez réessayer en disant par exemple : 50 euros courses");
      utterance.lang = 'fr-FR';
      window.speechSynthesis.speak(utterance);
    }
    
    setTranscript('');
  };

  // Démarrer l'enregistrement
  const startRecording = () => {
    console.log('Starting recording on page:', currentPage); // DEBUG
    if (recognitionRef.current) {
      setIsRecording(true);
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Erreur au démarrage de la reconnaissance vocale:', error);
      }
    }
  };

  // Arrêter l'enregistrement
  const stopRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(false);
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Erreur à l\'arrêt de la reconnaissance vocale:', error);
      }
    }
  };

  // Mettre à jour une transaction
  const updateTransaction = (id, updatedData) => {
    setTransactions(transactions.map(t => 
      t.id === id 
        ? { ...t, ...updatedData, amount: parseFloat(updatedData.amount) }
        : t
    ));
    setEditingTransaction(null);
  };

  // Export des données
  const exportData = () => {
    const data = {
      transactions,
      categories,
      initialBalance,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mon-argent-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import des données
  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.transactions) setTransactions(data.transactions);
          if (data.categories) setCategories(data.categories);
          if (data.initialBalance !== undefined) setInitialBalance(data.initialBalance);
          alert('Données importées avec succès !');
        } catch (error) {
          alert('Erreur lors de l\'import des données');
        }
      };
      reader.readAsText(file);
    }
  };

  // Export PDF
  const exportPDF = async () => {
    // Charger jsPDF seulement quand nécessaire
    const { default: jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    const filteredTransactions = getFilteredTransactions();
    
    // Couleurs
    const greenColor = [16, 185, 129];
    const redColor = [239, 68, 68];
    const grayColor = [107, 114, 128];
    
    // En-tête
    doc.setFontSize(24);
    doc.setTextColor(...greenColor);
    doc.text('Mon-Argent.pro', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(...grayColor);
    doc.text(`Export du ${new Date().toLocaleDateString('fr-FR')}`, 105, 30, { align: 'center' });
    
    // Ligne de séparation
    doc.setDrawColor(...grayColor);
    doc.line(20, 35, 190, 35);
    
    // Calculs globaux
    const allCredits = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
    const allDebits = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
    const totalBalance = initialBalance + allCredits - allDebits;
    
    // Solde total
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('SOLDE TOTAL DU COMPTE', 20, 50);
    doc.setFontSize(20);
    doc.setTextColor(totalBalance >= 0 ? greenColor[0] : redColor[0], 
                     totalBalance >= 0 ? greenColor[1] : redColor[1], 
                     totalBalance >= 0 ? greenColor[2] : redColor[2]);
    doc.text(`${totalBalance.toFixed(2)} €`, 190, 50, { align: 'right' });
    
    // Détails du solde
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.text(`Solde initial: ${initialBalance.toFixed(2)} € | Crédits: +${allCredits.toFixed(2)} € | Débits: -${allDebits.toFixed(2)} €`, 20, 58);
    
    // Période sélectionnée
    let yPosition = 70;
    if (filter.period !== 'all') {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      let periodText = '';
      if (filter.period === 'custom' && filter.startDate && filter.endDate) {
        periodText = `Du ${new Date(filter.startDate).toLocaleDateString('fr-FR')} au ${new Date(filter.endDate).toLocaleDateString('fr-FR')}`;
      } else {
        periodText = filter.period === 'today' ? "Aujourd'hui" : 
                     filter.period === 'week' ? 'Cette semaine' : 
                     filter.period === 'month' ? 'Ce mois' : 'Cette année';
      }
      doc.text(`Période: ${periodText}`, 20, yPosition);
      
      // Résumé de la période
      const credits = filteredTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
      const debits = filteredTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
      
      yPosition += 8;
      doc.setFontSize(10);
      doc.setTextColor(...greenColor);
      doc.text(`Crédits: +${credits.toFixed(2)} €`, 20, yPosition);
      doc.setTextColor(...redColor);
      doc.text(`Débits: -${debits.toFixed(2)} €`, 80, yPosition);
      doc.setTextColor(0, 0, 0);
      doc.text(`Solde période: ${(credits - debits).toFixed(2)} €`, 140, yPosition);
      
      yPosition += 10;
    }
    
    // Ligne de séparation
    doc.setDrawColor(...grayColor);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    
    // Titre des transactions
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`TRANSACTIONS (${filteredTransactions.length})`, 20, yPosition);
    yPosition += 10;
    
    // En-têtes du tableau
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Date', 20, yPosition);
    doc.text('Description', 45, yPosition);
    doc.text('Catégorie', 110, yPosition);
    doc.text('Montant', 190, yPosition, { align: 'right' });
    
    // Ligne sous les en-têtes
    yPosition += 2;
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 5;
    
    // Transactions
    doc.setFont(undefined, 'normal');
    filteredTransactions.forEach(t => {
      // Vérifier si on a besoin d'une nouvelle page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
        
        // Ré-afficher les en-têtes sur la nouvelle page
        doc.setFont(undefined, 'bold');
        doc.text('Date', 20, yPosition);
        doc.text('Description', 45, yPosition);
        doc.text('Catégorie', 110, yPosition);
        doc.text('Montant', 190, yPosition, { align: 'right' });
        yPosition += 2;
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 5;
        doc.setFont(undefined, 'normal');
      }
      
      doc.setTextColor(...grayColor);
      doc.text(new Date(t.date).toLocaleDateString('fr-FR'), 20, yPosition);
      
      doc.setTextColor(0, 0, 0);
      // Tronquer la description si trop longue
      const maxDescLength = 30;
      const description = t.description.length > maxDescLength 
        ? t.description.substring(0, maxDescLength) + '...' 
        : t.description;
      doc.text(description, 45, yPosition);
      
      doc.setTextColor(...grayColor);
      doc.text(t.category, 110, yPosition);
      
      doc.setTextColor(t.type === 'credit' ? greenColor[0] : redColor[0],
                       t.type === 'credit' ? greenColor[1] : redColor[1],
                       t.type === 'credit' ? greenColor[2] : redColor[2]);
      doc.text(`${t.type === 'credit' ? '+' : '-'}${t.amount.toFixed(2)} €`, 190, yPosition, { align: 'right' });
      
      yPosition += 7;
    });
    
    // Pied de page sur la dernière page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(...grayColor);
      doc.text(`Page ${i}/${pageCount}`, 105, 290, { align: 'center' });
      doc.text('Mon-Argent.pro - Application gratuite de gestion budgétaire', 105, 295, { align: 'center' });
    }
    
    // Sauvegarder le PDF
    doc.save(`mon-argent-export-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Partage sur les réseaux sociaux
  const shareApp = (platform) => {
    const url = 'https://mon-argent.pro';
    const text = 'Découvrez Mon-Argent.pro, l\'application gratuite pour gérer simplement votre budget ! 💰📊';
    const hashtags = 'budget,finance,gestion,argent';
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent('Mon-Argent.pro')}&summary=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  // Filtrer les transactions
  const getFilteredTransactions = () => {
    let filtered = [...transactions];
    
    if (filter.category !== 'all') {
      filtered = filtered.filter(t => t.category === filter.category);
    }
    
    const now = new Date();
    switch (filter.period) {
      case 'today':
        filtered = filtered.filter(t => new Date(t.date).toDateString() === now.toDateString());
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
        break;
      case 'month':
        filtered = filtered.filter(t => {
          const tDate = new Date(t.date);
          return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
        });
        break;
      case 'year':
        filtered = filtered.filter(t => new Date(t.date).getFullYear() === now.getFullYear());
        break;
      case 'custom':
        if (filter.startDate && filter.endDate) {
          const start = new Date(filter.startDate);
          const end = new Date(filter.endDate);
          end.setHours(23, 59, 59, 999);
          filtered = filtered.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= start && tDate <= end;
          });
        }
        break;
      default:
        break;
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Page d'accueil
  const HomePage = () => {
    const [manualType, setManualType] = useState('debit');

    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 pb-24">
        <h1 className="text-3xl font-bold mb-8">Mon-Argent.pro</h1>
        
        {/* Bouton unique pour transaction vocale */}
        <button
          onClick={() => {
            if (isRecording) {
              stopRecording();
            } else {
              startRecording();
            }
          }}
          className={`w-full max-w-md py-6 rounded-lg font-semibold text-xl flex items-center justify-center gap-3 transition-all transform mb-8 ${
            isRecording 
              ? 'bg-red-500 text-white scale-95' 
              : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105'
          }`}
        >
          {isRecording ? <MicOff size={28} /> : <Mic size={28} />}
          {isRecording ? 'Arrêter l\'enregistrement' : 'Ajouter une transaction vocale'}
        </button>

        {transcript && (
          <div className="w-full max-w-md mb-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="font-semibold mb-1">Transcription :</p>
              <p>{transcript}</p>
            </div>
          </div>
        )}

        {/* Formulaire manuel toujours visible */}
        <ManualTransactionForm 
          categories={categories} 
          addTransaction={addTransaction}
          manualType={manualType}
          setManualType={setManualType}
        />

        {/* Publicité */}
        <div className="mt-8 w-full max-w-md mb-8 sm:mb-20">
          <a href="https://n26.com/r/florentr5832" target="_blank" rel="noopener noreferrer" className="block">
            {/* Format desktop */}
            <div className="hidden sm:block w-full h-[90px] bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src="/pub-desktop.jpg" 
                alt="N26 - La banque mobile" 
                className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            
            {/* Format mobile */}
            <div className="sm:hidden w-full h-[50px] bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src="/pub-mobile.jpg" 
                alt="N26 - La banque mobile" 
                className="w-full h-full object-cover cursor-pointer"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </a>
        </div>
      </div>
    );
  };

  // Page historique
  const HistoryPage = () => {
    const filteredTransactions = getFilteredTransactions();
    const totalCredit = filteredTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
    const totalDebit = filteredTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalCredit - totalDebit;
    
    // Calculs pour le solde total (toutes les transactions)
    const allCredits = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
    const allDebits = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
    const totalBalance = initialBalance + allCredits - allDebits;

    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Historique</h1>
        
        {/* Résumé */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="text-center p-4 bg-gray-50">
            <p className="text-sm text-gray-600 mb-1">Solde total du compte</p>
            <p className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalBalance.toFixed(2)} €
            </p>
            <p className="text-xs text-gray-500 mt-1">(Solde initial + tous mouvements)</p>
          </div>
          <div className="p-4">
            {filter.period !== 'all' && (
              <p className="text-center text-sm font-medium text-gray-700 mb-3">
                {filter.period === 'today' ? "Aujourd'hui" : 
                 filter.period === 'week' ? 'Cette semaine' : 
                 filter.period === 'month' ? 'Ce mois' : 
                 filter.period === 'year' ? 'Cette année' :
                 filter.period === 'custom' ? 'Période personnalisée' : ''}
              </p>
            )}
            {filter.period !== 'all' ? (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">Crédits période</p>
                  <p className="text-lg font-semibold text-green-600">+{totalCredit.toFixed(2)} €</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Débits période</p>
                  <p className="text-lg font-semibold text-red-600">-{totalDebit.toFixed(2)} €</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Solde période</p>
                  <p className={`text-lg font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {balance >= 0 ? '+' : ''}{balance.toFixed(2)} €
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">Total des crédits</p>
                  <p className="text-lg font-semibold text-green-600">+{totalCredit.toFixed(2)} €</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total des débits</p>
                  <p className="text-lg font-semibold text-red-600">-{totalDebit.toFixed(2)} €</p>
                </div>
              </div>
            )}
            {filter.period === 'custom' && filter.startDate && filter.endDate && (
              <p className="text-center text-sm text-gray-600 mt-3 pt-3 border-t">
                Du {new Date(filter.startDate).toLocaleDateString('fr-FR')} au {new Date(filter.endDate).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <select
              value={filter.period}
              onChange={(e) => setFilter({...filter, period: e.target.value})}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les périodes</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
              <option value="custom">Période personnalisée</option>
            </select>
            
            <select
              value={filter.category}
              onChange={(e) => setFilter({...filter, category: e.target.value})}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          {filter.period === 'custom' && (
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Date de début</label>
                <input
                  type="date"
                  value={filter.startDate}
                  onChange={(e) => setFilter({...filter, startDate: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Date de fin</label>
                <input
                  type="date"
                  value={filter.endDate}
                  onChange={(e) => setFilter({...filter, endDate: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {filter.startDate && filter.endDate && (
                <button
                  onClick={() => setFilter({...filter, startDate: '', endDate: ''})}
                  className="self-end px-4 py-2 text-gray-600 hover:text-gray-800 whitespace-nowrap"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          )}
        </div>

        {/* Gestion des catégories */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="font-semibold mb-3">Catégories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <div key={cat} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-sm">{cat}</span>
                {categories.length > 1 && (
                  <button
                    onClick={() => setCategories(categories.filter(c => c !== cat))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setShowAddCategory(true)}
              className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-200"
            >
              + Ajouter
            </button>
          </div>
          
          {showAddCategory && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Nouvelle catégorie"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  if (newCategory && !categories.includes(newCategory)) {
                    setCategories([...categories, newCategory]);
                    setNewCategory('');
                    setShowAddCategory(false);
                  }
                }}
                className="text-green-600 hover:text-green-800"
              >
                <Check size={20} />
              </button>
              <button
                onClick={() => {
                  setNewCategory('');
                  setShowAddCategory(false);
                }}
                className="text-red-600 hover:text-red-800"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Liste des transactions */}
        <div className="space-y-2">
          {filteredTransactions.map(transaction => (
            <div key={transaction.id} className="bg-white rounded-lg shadow p-4">
              {editingTransaction === transaction.id ? (
                // Mode édition
                <div className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type de transaction</label>
                      <select
                        defaultValue={transaction.type}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white"
                        id={`type-${transaction.id}`}
                      >
                        <option value="debit">Débit (dépense)</option>
                        <option value="credit">Crédit (revenu)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Montant (€)</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        defaultValue={transaction.amount}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        id={`amount-${transaction.id}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        defaultValue={transaction.description}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        id={`desc-${transaction.id}`}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                      <select
                        defaultValue={transaction.category}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white"
                        id={`cat-${transaction.id}`}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        defaultValue={new Date(transaction.date).toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        id={`date-${transaction.id}`}
                      />
                    </div>
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => {
                          const amount = document.getElementById(`amount-${transaction.id}`).value;
                          const description = document.getElementById(`desc-${transaction.id}`).value;
                          const category = document.getElementById(`cat-${transaction.id}`).value;
                          const date = document.getElementById(`date-${transaction.id}`).value;
                          const type = document.getElementById(`type-${transaction.id}`).value;
                          updateTransaction(transaction.id, { amount, description, category, type, date: new Date(date).toISOString() });
                        }}
                        className="flex-1 flex items-center justify-center gap-2 text-white bg-green-600 hover:bg-green-700 rounded-lg px-4 py-3 font-semibold text-base"
                      >
                        <Check size={24} />
                        Valider
                      </button>
                      <button
                        onClick={() => setEditingTransaction(null)}
                        className="flex-1 flex items-center justify-center gap-2 text-white bg-gray-600 hover:bg-gray-700 rounded-lg px-4 py-3 font-semibold text-base"
                      >
                        <X size={24} />
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Mode affichage normal
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex-1">
                    <p className="font-semibold break-words">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('fr-FR')} • {transaction.category}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <p className={`text-lg sm:text-xl font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toFixed(2)} €
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingTransaction(transaction.id)}
                        className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
                            setTransactions(transactions.filter(t => t.id !== transaction.id));
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune transaction trouvée
            </div>
          )}
        </div>
      </div>
    );
  };

  // Page Statistiques
  const StatsPage = () => {
    // Calculs pour les statistiques
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Transactions du mois en cours
    const currentMonthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });
    
    // Transactions du mois précédent
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === lastMonth && tDate.getFullYear() === lastMonthYear;
    });
    
    // Dépenses par catégorie (mois en cours)
    const expensesByCategory = {};
    currentMonthTransactions.filter(t => t.type === 'debit').forEach(t => {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
    });
    
    // Tri des catégories par montant décroissant
    const sortedCategories = Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5
    
    // Total des dépenses et revenus
    const currentMonthDebits = currentMonthTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const currentMonthCredits = currentMonthTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastMonthDebits = lastMonthTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Moyenne quotidienne
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysPassed = now.getDate();
    const dailyAverage = currentMonthDebits / daysPassed;
    const projectedMonthly = dailyAverage * daysInMonth;
    
    // Top 5 dépenses du mois
    const topExpenses = currentMonthTransactions
      .filter(t => t.type === 'debit')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    
    // Évolution sur 6 mois
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentYear, currentMonth - i, 1);
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === month.getMonth() && 
               tDate.getFullYear() === month.getFullYear();
      });
      const monthDebits = monthTransactions
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + t.amount, 0);
      
      last6Months.push({
        month: month.toLocaleDateString('fr-FR', { month: 'short' }),
        amount: monthDebits
      });
    }
    
    // Calcul du max pour l'échelle
    const maxCategory = sortedCategories.length > 0 ? sortedCategories[0][1] : 1;
    const maxMonth = Math.max(...last6Months.map(m => m.amount), 1);

    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Statistiques</h1>
        
        {/* Résumé du mois */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Dépenses</p>
              <p className="text-2xl font-bold text-red-600">-{currentMonthDebits.toFixed(2)}€</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Revenus</p>
              <p className="text-2xl font-bold text-green-600">+{currentMonthCredits.toFixed(2)}€</p>
            </div>
          </div>
          
          {/* Comparaison avec le mois précédent */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Vs mois dernier</p>
            <div className="flex items-center justify-between">
              <span className="text-sm">Dépenses {lastMonth === 11 ? 'déc.' : new Date(2024, lastMonth).toLocaleDateString('fr-FR', { month: 'short' })}</span>
              <span className="text-sm font-medium">{lastMonthDebits.toFixed(2)}€</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-medium">Différence</span>
              <span className={`text-sm font-bold ${currentMonthDebits > lastMonthDebits ? 'text-red-600' : 'text-green-600'}`}>
                {currentMonthDebits > lastMonthDebits ? '+' : ''}{(currentMonthDebits - lastMonthDebits).toFixed(2)}€
              </span>
            </div>
          </div>
        </div>

        {/* Moyenne quotidienne et projection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Analyse quotidienne</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Moyenne/jour</p>
              <p className="text-xl font-bold">{dailyAverage.toFixed(2)}€</p>
              <p className="text-xs text-gray-500">sur {daysPassed} jours</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Projection fin de mois</p>
              <p className="text-xl font-bold text-orange-600">{projectedMonthly.toFixed(2)}€</p>
              <p className="text-xs text-gray-500">{daysInMonth - daysPassed} jours restants</p>
            </div>
          </div>
        </div>

        {/* Dépenses par catégorie */}
        {sortedCategories.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Top catégories du mois</h2>
            <div className="space-y-3">
              {sortedCategories.map(([category, amount]) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{category}</span>
                    <span className="text-sm font-bold">{amount.toFixed(2)}€</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div 
                      className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(amount / maxCategory) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {((amount / currentMonthDebits) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Évolution sur 6 mois */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Évolution des dépenses</h2>
          <div className="flex items-end justify-between h-32 mb-2">
            {last6Months.map((month, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full px-1">
                  <div 
                    className="rounded-t mx-auto transition-all duration-300"
                    style={{ 
                      height: `${(month.amount / maxMonth) * 100}px`,
                      width: '85%',
                      backgroundColor: index === 5 ? '#ef4444' : '#9ca3af'
                    }}
                  ></div>
                </div>
                <span className="text-xs mt-1">{month.month}</span>
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-gray-500">
            Moyenne: {(last6Months.reduce((sum, m) => sum + m.amount, 0) / 6).toFixed(2)}€/mois
          </div>
        </div>

        {/* Top 5 dépenses */}
        {topExpenses.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Top 5 dépenses du mois</h2>
            <div className="space-y-3">
              {topExpenses.map((t, index) => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-sm">{t.description}</p>
                      <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <span className="text-red-600 font-bold">{t.amount.toFixed(2)}€</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Page Paramètres
  const SettingsPage = () => (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Paramètres</h1>
      
      {/* Section Solde initial */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Solde initial</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 mb-1">Définir le solde de départ de votre compte</p>
            <p className="text-2xl font-bold">{initialBalance.toFixed(2)} €</p>
          </div>
          <button
            onClick={() => {
              const newBalance = prompt('Définir le solde initial :', initialBalance);
              if (newBalance !== null && !isNaN(newBalance)) {
                setInitialBalance(parseFloat(newBalance));
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Modifier
          </button>
        </div>
      </div>
      
      {/* Section Import/Export */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Sauvegarde et Restauration</h2>
        <div className="space-y-4">
          <button
            onClick={exportData}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download size={20} />
            Exporter les données (JSON)
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Upload size={20} />
            Importer des données
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={importData}
            className="hidden"
          />
          <button
            onClick={() => exportPDF()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <FileText size={20} />
            Exporter en PDF (selon filtres actuels)
          </button>
        </div>
      </div>

      {/* Section Partage */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Partager l'application</h2>
        <p className="text-gray-600 mb-4">Aidez-nous à faire connaître Mon-Argent.pro !</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => shareApp('twitter')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Twitter
          </button>
          <button
            onClick={() => shareApp('facebook')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
          <button
            onClick={() => shareApp('linkedin')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </button>
          <button
            onClick={() => shareApp('whatsapp')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </button>
        </div>
      </div>

      {/* Informations légales */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Informations légales</h2>
        <div className="space-y-3">
          <button
            onClick={() => setCurrentPage('cgu')}
            className="w-full text-left px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Conditions Générales d'Utilisation
          </button>
          <button
            onClick={() => setCurrentPage('privacy')}
            className="w-full text-left px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Politique de Confidentialité
          </button>
          <button
            onClick={() => setCurrentPage('cookies')}
            className="w-full text-left px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Politique des Cookies
          </button>
          <button
            onClick={() => setCurrentPage('legal')}
            className="w-full text-left px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Mentions Légales
          </button>
        </div>
      </div>
    </div>
  );

  // Page Tutoriel
  const TutorialPage = () => (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Guide d'utilisation</h1>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3 text-green-600">🎯 Bienvenue sur Mon-Argent.pro !</h2>
          <p className="text-gray-700 mb-4">
            Une application simple et gratuite pour gérer votre budget au quotidien. Toutes vos données restent sur votre appareil !
          </p>
        </div>

        <div className="bg-red-50 rounded-lg shadow p-6 border-2 border-red-200">
          <h2 className="text-xl font-semibold mb-3 text-red-700 flex items-center gap-2">
            🔒 Sécurité et Confidentialité
          </h2>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <p className="font-semibold text-red-700">Vos données sont 100% privées !</p>
                <p className="text-sm mt-1">Nous n'avons accès à AUCUNE de vos informations personnelles ou financières.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">💾</span>
              <div>
                <p className="font-semibold">Stockage local uniquement</p>
                <p className="text-sm mt-1">Toutes vos transactions restent sur VOTRE appareil. Rien n'est envoyé sur internet.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔐</span>
              <div>
                <p className="font-semibold">Vous gardez le contrôle total</p>
                <p className="text-sm mt-1">Exportez, supprimez ou modifiez vos données à tout moment. C'est VOTRE argent, VOS données.</p>
              </div>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-300 rounded-lg mt-4">
              <p className="text-sm text-green-800 font-medium">
                ✅ En résumé : C'est comme avoir un carnet de comptes dans votre poche, personne d'autre que vous ne peut le consulter !
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">🏠 Page d'Accueil</h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>Transaction vocale :</strong> Appuyez sur le bouton vert et dites par exemple :</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>"50 euros courses Carrefour" → Débit automatique</li>
              <li>"Salaire 2000 euros" → Crédit automatique</li>
              <li>"25 euros essence" → Débit automatique</li>
            </ul>
            <p className="mt-3"><strong>Saisie manuelle :</strong> Remplissez les champs et validez.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3 text-purple-600">📊 Historique</h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>Filtres :</strong> Visualisez vos transactions par période ou catégorie.</p>
            <p><strong>Édition :</strong> Cliquez sur le crayon pour modifier une transaction.</p>
            <p><strong>Date :</strong> Vous pouvez changer la date d'une transaction.</p>
            <p><strong>Catégories :</strong> Créez vos propres catégories personnalisées.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3 text-purple-600">📊 Statistiques</h2>
          <div className="space-y-3 text-gray-700">
            <p>Analysez vos finances en détail :</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Évolution mensuelle des dépenses</li>
              <li>Top 5 des catégories</li>
              <li>Moyenne quotidienne</li>
              <li>Comparaison avec le mois précédent</li>
              <li>Projection de fin de mois</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-600">⚙️ Paramètres</h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>Solde initial :</strong> Définissez votre solde de départ.</p>
            <p><strong>Sauvegarde :</strong> Exportez vos données pour les conserver.</p>
            <p><strong>PDF :</strong> Générez des rapports selon vos filtres.</p>
            <p><strong>Partage :</strong> Faites découvrir l'app à vos proches !</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold mb-2">💡 Astuces</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• L'app reconnaît automatiquement si c'est un crédit ou débit</li>
            <li>• Vos données ne quittent jamais votre appareil</li>
            <li>• Exportez régulièrement vos données pour les sauvegarder</li>
            <li>• Utilisez des mots-clés pour la détection automatique des catégories</li>
            <li>• Ajoutez l'app à votre écran d'accueil pour un accès rapide</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Pages légales
  const CGUPage = () => (
    <div className="p-4 max-w-4xl mx-auto">
      <button 
        onClick={() => setCurrentPage('settings')} 
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        ← Retour aux paramètres
      </button>
      <h1 className="text-2xl font-bold mb-6 text-center">Conditions Générales d'Utilisation</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <p><strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
        
        <h2 className="text-xl font-semibold mt-4">1. Présentation</h2>
        <p>Mon-Argent.pro est une application gratuite de gestion budgétaire éditée par Web Online Concept, SIRET 510 583 800 00048, située Rue Paul Estival, 31200 Toulouse.</p>
        
        <h2 className="text-xl font-semibold mt-4">2. Utilisation du service</h2>
        <p>L'application est fournie gratuitement "en l'état". L'utilisateur est seul responsable de l'utilisation qu'il en fait et des données qu'il y enregistre.</p>
        
        <h2 className="text-xl font-semibold mt-4">3. Données personnelles</h2>
        <p>Toutes les données sont stockées localement sur votre appareil. Nous ne collectons, ne stockons ni ne transmettons aucune donnée personnelle.</p>
        
        <h2 className="text-xl font-semibold mt-4">4. Publicité</h2>
        <p>L'application peut contenir de la publicité pour financer son développement et sa maintenance.</p>
        
        <h2 className="text-xl font-semibold mt-4">5. Limitation de responsabilité</h2>
        <p>Web Online Concept ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser l'application.</p>
        
        <h2 className="text-xl font-semibold mt-4">6. Modifications</h2>
        <p>Nous nous réservons le droit de modifier ces CGU à tout moment.</p>
        
        <h2 className="text-xl font-semibold mt-4">7. Contact</h2>
        <p>Pour toute question : web.online.concept@gmail.com</p>
      </div>
    </div>
  );

  const PrivacyPage = () => (
    <div className="p-4 max-w-4xl mx-auto">
      <button 
        onClick={() => setCurrentPage('settings')} 
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        ← Retour aux paramètres
      </button>
      <h1 className="text-2xl font-bold mb-6 text-center">Politique de Confidentialité</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <p><strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
        
        <h2 className="text-xl font-semibold mt-4">1. Collecte de données</h2>
        <p>Mon-Argent.pro ne collecte AUCUNE donnée personnelle. Toutes vos informations financières restent stockées localement sur votre appareil.</p>
        
        <h2 className="text-xl font-semibold mt-4">2. Stockage des données</h2>
        <p>Les données sont stockées uniquement dans le localStorage de votre navigateur. Elles ne sont jamais envoyées vers nos serveurs ou des services tiers.</p>
        
        <h2 className="text-xl font-semibold mt-4">3. Partage des données</h2>
        <p>Nous ne partageons aucune donnée avec des tiers car nous n'en collectons aucune.</p>
        
        <h2 className="text-xl font-semibold mt-4">4. Sécurité</h2>
        <p>La sécurité de vos données dépend de la sécurité de votre appareil. Nous vous recommandons d'utiliser un mot de passe sur votre appareil.</p>
        
        <h2 className="text-xl font-semibold mt-4">5. Vos droits</h2>
        <p>Vous avez le contrôle total sur vos données. Vous pouvez les exporter, les modifier ou les supprimer à tout moment directement depuis l'application.</p>
        
        <h2 className="text-xl font-semibold mt-4">6. Contact</h2>
        <p>Pour toute question concernant la confidentialité : web.online.concept@gmail.com</p>
      </div>
    </div>
  );

  const CookiesPage = () => (
    <div className="p-4 max-w-4xl mx-auto">
      <button 
        onClick={() => setCurrentPage('settings')} 
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        ← Retour aux paramètres
      </button>
      <h1 className="text-2xl font-bold mb-6 text-center">Politique des Cookies</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <p><strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
        
        <h2 className="text-xl font-semibold mt-4">1. Utilisation des cookies</h2>
        <p>Mon-Argent.pro utilise uniquement le localStorage du navigateur pour stocker vos données financières localement. Nous n'utilisons pas de cookies de tracking.</p>
        
        <h2 className="text-xl font-semibold mt-4">2. Cookies publicitaires</h2>
        <p>Si de la publicité est affichée, elle peut utiliser des cookies tiers. Ces cookies sont gérés par les régies publicitaires et non par Mon-Argent.pro.</p>
        
        <h2 className="text-xl font-semibold mt-4">3. Gestion des cookies</h2>
        <p>Vous pouvez gérer ou supprimer les cookies via les paramètres de votre navigateur.</p>
        
        <h2 className="text-xl font-semibold mt-4">4. LocalStorage</h2>
        <p>Le localStorage est utilisé pour :</p>
        <ul className="list-disc list-inside ml-4">
          <li>Stocker vos transactions</li>
          <li>Sauvegarder vos catégories personnalisées</li>
          <li>Mémoriser votre solde initial</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-4">5. Contact</h2>
        <p>Pour toute question : web.online.concept@gmail.com</p>
      </div>
    </div>
  );

  const LegalPage = () => (
    <div className="p-4 max-w-4xl mx-auto">
      <button 
        onClick={() => setCurrentPage('settings')} 
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        ← Retour aux paramètres
      </button>
      <h1 className="text-2xl font-bold mb-6 text-center">Mentions Légales</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold">Éditeur du site</h2>
        <div className="ml-4">
          <p><strong>Raison sociale :</strong> Web Online Concept</p>
          <p><strong>Adresse :</strong> Rue Paul Estival, 31200 Toulouse</p>
          <p><strong>Email :</strong> web.online.concept@gmail.com</p>
          <p><strong>SIRET :</strong> 510 583 800 00048</p>
        </div>

        <h2 className="text-xl font-semibold mt-6">Directeur de la publication</h2>
        <p className="ml-4">Le directeur de la publication est le représentant légal de Web Online Concept.</p>

        <h2 className="text-xl font-semibold mt-6">Hébergement</h2>
        <div className="ml-4">
          <p><strong>Hébergeur :</strong> Vercel Inc.</p>
          <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
          <p><strong>Site web :</strong> https://vercel.com</p>
        </div>

        <h2 className="text-xl font-semibold mt-6">Propriété intellectuelle</h2>
        <p>L'ensemble du contenu de ce site (structure, textes, logos, images, etc.) est la propriété exclusive de Web Online Concept, sauf mention contraire. Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces différents éléments est strictement interdite sans l'accord écrit de Web Online Concept.</p>

        <h2 className="text-xl font-semibold mt-6">Responsabilité</h2>
        <p>Web Online Concept s'efforce de fournir des informations aussi précises que possible. Toutefois, elle ne pourra être tenue responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.</p>

        <h2 className="text-xl font-semibold mt-6">Données personnelles</h2>
        <p>Conformément à la loi « informatique et libertés » du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant. Pour l'exercer, adressez votre demande par email à : web.online.concept@gmail.com</p>

        <h2 className="text-xl font-semibold mt-6">Cookies</h2>
        <p>Ce site utilise le localStorage pour fonctionner. Pour plus d'informations, consultez notre <button onClick={() => setCurrentPage('cookies')} className="text-blue-600 hover:underline">Politique des Cookies</button>.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification globale */}
      {notification && (
        <div 
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            fontSize: '16px',
            fontWeight: 'bold',
            minWidth: '250px',
            textAlign: 'center'
          }}
        >
          {notification}
        </div>
      )}
      
      {/* Contenu principal */}
      <div className="pb-20">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'history' && <HistoryPage />}
        {currentPage === 'stats' && <StatsPage />}
        {currentPage === 'settings' && <SettingsPage />}
        {currentPage === 'tutorial' && <TutorialPage />}
        {currentPage === 'cgu' && <CGUPage />}
        {currentPage === 'privacy' && <PrivacyPage />}
        {currentPage === 'cookies' && <CookiesPage />}
        {currentPage === 'legal' && <LegalPage />}
      </div>
      
      {/* Navigation mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              currentPage === 'home' ? 'bg-gray-50' : ''
            }`}
          >
            <Home size={24} className={currentPage === 'home' ? 'text-green-600' : 'text-green-500'} />
            <span className={`text-xs mt-1 ${currentPage === 'home' ? 'text-black font-semibold' : 'text-gray-700'}`}>Accueil</span>
          </button>
          <button
            onClick={() => setCurrentPage('history')}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              currentPage === 'history' ? 'bg-gray-50' : ''
            }`}
          >
            <History size={24} className={currentPage === 'history' ? 'text-blue-600' : 'text-blue-500'} />
            <span className={`text-xs mt-1 ${currentPage === 'history' ? 'text-black font-semibold' : 'text-gray-700'}`}>Historique</span>
          </button>
          <button
            onClick={() => setCurrentPage('stats')}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              currentPage === 'stats' ? 'bg-gray-50' : ''
            }`}
          >
            <TrendingUp size={24} className={currentPage === 'stats' ? 'text-purple-600' : 'text-purple-500'} />
            <span className={`text-xs mt-1 ${currentPage === 'stats' ? 'text-black font-semibold' : 'text-gray-700'}`}>Stats</span>
          </button>
          <button
            onClick={() => setCurrentPage('tutorial')}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              currentPage === 'tutorial' ? 'bg-gray-50' : ''
            }`}
          >
            <HelpCircle size={24} className={currentPage === 'tutorial' ? 'text-orange-600' : 'text-orange-500'} />
            <span className={`text-xs mt-1 ${currentPage === 'tutorial' ? 'text-black font-semibold' : 'text-gray-700'}`}>Aide</span>
          </button>
          <button
            onClick={() => setCurrentPage('settings')}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              currentPage === 'settings' ? 'bg-gray-50' : ''
            }`}
          >
            <Settings size={24} className={currentPage === 'settings' ? 'text-gray-800' : 'text-gray-600'} />
            <span className={`text-xs mt-1 ${currentPage === 'settings' ? 'text-black font-semibold' : 'text-gray-700'}`}>Paramètres</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;