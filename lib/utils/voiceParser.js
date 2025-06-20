/**
 * Parse un montant à partir d'une transcription vocale
 * @param {string} transcript - La transcription vocale
 * @returns {number|null} - Le montant parsé ou null si non trouvé
 */
export function parseVoiceAmount(transcript) {
  if (!transcript) return null;
  
  // Normaliser la transcription
  let normalized = transcript.toLowerCase().trim();
  
  // Remplacer les mots français par des nombres
  const wordToNumber = {
    'zéro': '0',
    'un': '1',
    'deux': '2',
    'trois': '3',
    'quatre': '4',
    'cinq': '5',
    'six': '6',
    'sept': '7',
    'huit': '8',
    'neuf': '9',
    'dix': '10',
    'onze': '11',
    'douze': '12',
    'treize': '13',
    'quatorze': '14',
    'quinze': '15',
    'seize': '16',
    'vingt': '20',
    'trente': '30',
    'quarante': '40',
    'cinquante': '50',
    'soixante': '60',
    'soixante-dix': '70',
    'quatre-vingt': '80',
    'quatre-vingt-dix': '90',
    'cent': '100',
    'cents': '100',
    'mille': '1000'
  };
  
  // Remplacer les mots par des nombres
  Object.entries(wordToNumber).forEach(([word, number]) => {
    normalized = normalized.replace(new RegExp(`\\b${word}\\b`, 'g'), number);
  });
  
  // Gérer les virgules prononcées
  normalized = normalized.replace(/virgule/g, '.');
  normalized = normalized.replace(/,/g, '.');
  
  // Rechercher un pattern de nombre
  const patterns = [
    /(\d+\.?\d*)\s*€/,           // 10€, 10.50€
    /(\d+\.?\d*)\s*euros?/,      // 10 euros, 10.50 euro
    /(\d+\.?\d*)/                 // Juste un nombre
  ];
  
  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) {
      const amount = parseFloat(match[1]);
      if (!isNaN(amount) && amount > 0) {
        return amount;
      }
    }
  }
  
  return null;
}

/**
 * Extrait la description d'une transcription après avoir retiré le montant
 * @param {string} transcript - La transcription vocale
 * @param {number} amount - Le montant trouvé
 * @returns {string} - La description nettoyée
 */
export function extractDescription(transcript, amount) {
  if (!transcript || !amount) return '';
  
  let description = transcript;
  
  // Retirer le montant et les mots-clés monétaires
  const amountStr = amount.toString();
  description = description.replace(new RegExp(amountStr, 'g'), '');
  description = description.replace(/euros?/gi, '');
  description = description.replace(/€/g, '');
  description = description.replace(/virgule/gi, '');
  
  // Nettoyer les espaces multiples
  description = description.replace(/\s+/g, ' ').trim();
  
  return description;
}