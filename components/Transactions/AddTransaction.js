import { useState, useEffect } from 'react';
import useTransactionStore from '../../lib/store/transactionStore';
import useCategoryStore from '../../lib/store/categoryStore';
import useRecurrenceStore from '../../lib/store/recurrenceStore';
import useBudgetStore from '../../lib/store/budgetStore';
import VoiceInput from '../VoiceInput';
import RecurrenceSelector from '../RecurrenceSelector';
import CategorySelector from '../CategorySelector';
import { parseVoiceAmount } from '../../lib/utils/voiceParser';

export default function AddTransaction() {
  const { addTransaction } = useTransactionStore();
  const { currentBudgetId, isMainBudget } = useBudgetStore();
  const { categories } = useCategoryStore();
  const { activeRecurrences, updateLastExecuted } = useRecurrenceStore();
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [recurrenceId, setRecurrenceId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      const defaultCategory = categories.find(c => 
        type === 'expense' ? c.name === 'Autres' : c.name === 'Salaire'
      );
      if (defaultCategory) {
        setCategoryId(defaultCategory.id);
      }
    }
  }, [categories, type, categoryId]);

  const handleVoiceInput = (transcript) => {
    const parsedAmount = parseVoiceAmount(transcript);
    if (parsedAmount) {
      setAmount(parsedAmount.toString());
      
      const remainingText = transcript
        .replace(new RegExp(parsedAmount.toString().replace('.', '\\.'), 'g'), '')
        .replace(/euros?/gi, '')
        .replace(/€/g, '')
        .trim();
      
      if (remainingText) {
        setDescription(remainingText);
      }
    } else {
      setDescription(transcript);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Empêcher l'ajout direct au budget principal
    if (isMainBudget()) {
      alert('Vous ne pouvez pas ajouter de transactions directement au Budget Principal. Sélectionnez un autre budget.');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    const transaction = {
      amount: parseFloat(amount),
      description,
      type,
      date,
      categoryId,
      recurrenceId: recurrenceId || null
    };

    // Ajouter la transaction avec le budget actuel
    addTransaction(transaction, currentBudgetId);

    // Si c'est une récurrence, mettre à jour la date d'exécution
    if (recurrenceId) {
      updateLastExecuted(recurrenceId, date);
    }

    // Réinitialiser le formulaire
    setAmount('');
    setDescription('');
    setType('expense');
    setDate(new Date().toISOString().split('T')[0]);
    setCategoryId(categories.find(c => c.name === 'Autres')?.id || '');
    setRecurrenceId('');
    
    // Afficher le message de succès
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    // Réinitialiser la catégorie lors du changement de type
    const defaultCategory = categories.find(c => 
      newType === 'expense' ? c.name === 'Autres' : c.name === 'Salaire'
    );
    if (defaultCategory) {
      setCategoryId(defaultCategory.id);
    }
  };

  if (isMainBudget()) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800 mb-4">
            Le Budget Principal est une vue d'ensemble de tous vos budgets.
          </p>
          <p className="text-yellow-700">
            Pour ajouter une transaction, veuillez sélectionner un budget spécifique.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ajouter une transaction</h1>
      
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
          Transaction ajoutée avec succès !
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
        {/* Colonne de gauche */}
        <div className="space-y-6">
          {/* Type de transaction */}
          <div>
            <label className="block text-sm font-medium mb-3">Type de transaction</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                  type === 'expense'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                💸 Dépense
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                  type === 'income'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                💰 Revenu
              </button>
            </div>
          </div>

          {/* Montant avec saisie vocale */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Montant (€)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border rounded-lg pr-12"
                placeholder="0.00"
                required
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <VoiceInput onTranscript={handleVoiceInput} />
              </div>
            </div>
          </div>

          {/* Catégorie */}
          <CategorySelector
            value={categoryId}
            onChange={setCategoryId}
            type={type}
          />

          {/* Récurrence */}
          <RecurrenceSelector
            value={recurrenceId}
            onChange={setRecurrenceId}
            type={type}
          />
        </div>

        {/* Colonne de droite */}
        <div className="space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-lg resize-none"
              rows={4}
              placeholder="Ajouter une description..."
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          {/* Boutons d'action en bas */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Ajouter la transaction
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Annuler
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}