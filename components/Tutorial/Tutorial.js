import { useState } from 'react'

export default function Tutorial() {
  const [activeSection, setActiveSection] = useState('introduction')

  const sections = [
    { id: 'introduction', label: '🎯 Introduction', icon: '🎯' },
    { id: 'start', label: '🚀 Démarrage rapide', icon: '🚀' },
    { id: 'voice', label: '🎤 Reconnaissance vocale', icon: '🎤' },
    { id: 'budgets', label: '💼 Multi-budgets', icon: '💼' },
    { id: 'recurrences', label: '🔄 Récurrences', icon: '🔄' },
    { id: 'tips', label: '💡 Conseils', icon: '💡' },
    { id: 'faq', label: '❓ FAQ', icon: '❓' }
  ]

  const renderContent = () => {
    switch(activeSection) {
      case 'introduction':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Bienvenue sur Mon Argent ! 💰</h2>
              <p className="text-lg text-gray-600 mb-8">
                L'application qui simplifie la gestion de votre budget au quotidien
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🎯 Notre mission</h3>
              <p className="text-gray-700 mb-4">
                Vous aider à reprendre le contrôle de vos finances personnelles de manière simple, 
                intuitive et sans stress. Fini les tableaux Excel compliqués !
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <div className="text-4xl mb-4">🎤</div>
                <h4 className="font-semibold mb-2">Ultra rapide</h4>
                <p className="text-sm text-gray-600">
                  Ajoutez vos dépenses en parlant. "J'ai dépensé 25 euros en courses"
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h4 className="font-semibold mb-2">100% Privé</h4>
                <p className="text-sm text-gray-600">
                  Vos données restent sur votre appareil. Aucun serveur, aucun cloud.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <div className="text-4xl mb-4">📱</div>
                <h4 className="font-semibold mb-2">Mobile First</h4>
                <p className="text-sm text-gray-600">
                  Conçu pour être utilisé en mobilité, où que vous soyez.
                </p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-green-800">✨ Pourquoi Mon Argent ?</h3>
              <ul className="space-y-3 text-green-700">
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span><strong>Simplicité absolue</strong> : Pas de fonctionnalités complexes inutiles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span><strong>Gain de temps</strong> : Ajoutez une transaction en 3 secondes chrono</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span><strong>Vision claire</strong> : Graphiques simples pour comprendre où va votre argent</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span><strong>Multi-budgets</strong> : Gérez plusieurs budgets séparés (perso, pro, projets...)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span><strong>Gratuit pour toujours</strong> : Aucun abonnement, aucune pub</span>
                </li>
              </ul>
            </div>
          </div>
        )

      case 'start':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">🚀 Démarrage rapide en 3 étapes</h2>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Configurez votre solde initial</h3>
                  <p className="text-gray-600 mb-3">
                    Allez dans <span className="font-medium">⚙️ Paramètres</span> et entrez votre solde bancaire actuel. 
                    C'est le point de départ pour suivre l'évolution de vos finances.
                  </p>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      💡 <strong>Astuce :</strong> Vérifiez votre solde bancaire réel pour commencer avec des données exactes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Ajoutez vos premières transactions</h3>
                  <p className="text-gray-600 mb-3">
                    Cliquez sur <span className="font-medium">➕ Ajouter</span> et essayez la reconnaissance vocale !
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 mb-2">
                      <strong>Exemples de commandes vocales :</strong>
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• "J'ai dépensé 45 euros au restaurant"</li>
                      <li>• "Courses 32 euros 50"</li>
                      <li>• "Reçu salaire 2500 euros"</li>
                      <li>• "Payé 15 euros essence"</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Créez vos récurrences</h3>
                  <p className="text-gray-600 mb-3">
                    Pour les transactions régulières (loyer, salaire, abonnements...), allez dans 
                    <span className="font-medium"> 🔄 Récurrences</span> et laissez l'app les gérer automatiquement !
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      ✅ Les récurrences sont générées automatiquement à leur date d'échéance. 
                      Plus besoin d'y penser !
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold mb-3">🎉 C'est tout !</h3>
              <p className="text-gray-700">
                Vous êtes maintenant prêt à gérer votre budget efficacement. 
                L'application s'occupe du reste : graphiques automatiques, calculs instantanés, 
                et rappels pour vos récurrences.
              </p>
            </div>
          </div>
        )

      case 'voice':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">🎤 Maîtrisez la reconnaissance vocale</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Comment ça marche ?</h3>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600">1.</span>
                  <span>Cliquez sur le gros bouton microphone bleu 🎤</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600">2.</span>
                  <span>Parlez naturellement (le bouton devient rouge)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600">3.</span>
                  <span>Cliquez à nouveau pour valider (bouton STOP 🛑)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600">4.</span>
                  <span>La transaction est ajoutée automatiquement !</span>
                </li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="font-semibold text-green-800 mb-3">✅ Phrases qui marchent bien</h4>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• "Dépense 25 euros courses"</li>
                  <li>• "J'ai payé 50 euros restaurant"</li>
                  <li>• "Achat 15 euros 50 essence"</li>
                  <li>• "Gagné 1500 euros salaire"</li>
                  <li>• "Reçu 100 euros remboursement"</li>
                  <li>• "Courses Leclerc 45 euros"</li>
                  <li>• "Netflix 15 euros 99"</li>
                </ul>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <h4 className="font-semibold text-orange-800 mb-3">💡 Astuces pour mieux fonctionner</h4>
                <ul className="space-y-2 text-sm text-orange-700">
                  <li>• Parlez clairement et pas trop vite</li>
                  <li>• Dites le montant en euros</li>
                  <li>• Évitez le bruit de fond</li>
                  <li>• Utilisez des mots-clés simples</li>
                  <li>• Pour les centimes : "22 euros 50"</li>
                  <li>• Soyez bref et direct</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h4 className="font-semibold text-purple-800 mb-3">🎯 Détection automatique des catégories</h4>
              <p className="text-purple-700 mb-3">
                L'app détecte automatiquement la catégorie selon vos mots :
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><strong>Courses :</strong> supermarché, Leclerc, Carrefour...</div>
                <div><strong>Restaurant :</strong> resto, repas, déjeuner...</div>
                <div><strong>Transport :</strong> essence, métro, train...</div>
                <div><strong>Logement :</strong> loyer, électricité, charges...</div>
                <div><strong>Santé :</strong> médecin, pharmacie, dentiste...</div>
                <div><strong>Loisirs :</strong> cinéma, sport, sortie...</div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h4 className="font-semibold text-red-800 mb-3">🚨 En cas de problème</h4>
              <ul className="space-y-2 text-sm text-red-700">
                <li>• <strong>Pas de son détecté :</strong> Vérifiez votre micro et parlez plus fort</li>
                <li>• <strong>Mauvaise compréhension :</strong> Reformulez plus simplement</li>
                <li>• <strong>Erreur de permission :</strong> Autorisez l'accès au micro dans votre navigateur</li>
                <li>• <strong>Alternative :</strong> Utilisez la saisie manuelle juste en dessous</li>
              </ul>
            </div>
          </div>
        )

      case 'budgets':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">💼 Gérez plusieurs budgets séparés</h2>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Pourquoi plusieurs budgets ?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div>
                    <strong className="text-indigo-800">👨‍👩‍👧‍👦 Budget Famille</strong>
                    <p className="text-gray-600">Gérez les dépenses communes du foyer</p>
                  </div>
                  <div>
                    <strong className="text-indigo-800">💼 Budget Pro</strong>
                    <p className="text-gray-600">Séparez vos frais professionnels</p>
                  </div>
                  <div>
                    <strong className="text-indigo-800">✈️ Budget Vacances</strong>
                    <p className="text-gray-600">Économisez pour votre prochain voyage</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <strong className="text-indigo-800">🎯 Budget Projet</strong>
                    <p className="text-gray-600">Suivez les coûts d'un projet spécifique</p>
                  </div>
                  <div>
                    <strong className="text-indigo-800">🏠 Budget Travaux</strong>
                    <p className="text-gray-600">Maîtrisez votre budget rénovation</p>
                  </div>
                  <div>
                    <strong className="text-indigo-800">🎓 Budget Études</strong>
                    <p className="text-gray-600">Gérez vos frais de formation</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Comment utiliser les multi-budgets ?</h3>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h4 className="font-medium mb-3">1️⃣ Créer un nouveau budget</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Cliquez sur le sélecteur de budget en haut (sous le titre)</li>
                  <li>• Cliquez sur "➕ Nouveau budget"</li>
                  <li>• Donnez-lui un nom et choisissez une icône</li>
                  <li>• Validez et basculez dessus si vous voulez</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h4 className="font-medium mb-3">2️⃣ Basculer entre les budgets</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Cliquez sur le sélecteur de budget</li>
                  <li>• Choisissez le budget voulu dans la liste</li>
                  <li>• La page se recharge avec les données du nouveau budget</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h4 className="font-medium mb-3">3️⃣ Renommer ou supprimer</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Cliquez sur ✏️ pour renommer n'importe quel budget</li>
                  <li>• Cliquez sur 🗑️ pour supprimer (sauf le budget principal)</li>
                  <li>• ⚠️ Attention : supprimer un budget efface toutes ses données !</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h4 className="font-semibold text-yellow-800 mb-3">⚠️ Important à savoir</h4>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li>• Chaque budget a ses propres transactions, catégories et récurrences</li>
                <li>• Les données ne sont pas partagées entre les budgets</li>
                <li>• Exportez régulièrement vos données pour les sauvegarder</li>
                <li>• Le budget principal ne peut pas être supprimé (mais peut être renommé)</li>
              </ul>
            </div>
          </div>
        )

      case 'recurrences':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">🔄 Automatisez avec les récurrences</h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Qu'est-ce qu'une récurrence ?</h3>
              <p className="text-gray-700">
                Une transaction qui se répète automatiquement à intervalles réguliers. 
                Plus besoin de penser à ajouter votre loyer, salaire ou abonnements chaque mois !
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h4 className="font-semibold mb-3 text-green-600">💰 Récurrences de revenus</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Salaire mensuel</li>
                  <li>• Pension alimentaire</li>
                  <li>• Revenus locatifs</li>
                  <li>• Allocations</li>
                  <li>• Dividendes trimestriels</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h4 className="font-semibold mb-3 text-red-600">💸 Récurrences de dépenses</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Loyer ou prêt immobilier</li>
                  <li>• Abonnements (Netflix, Spotify...)</li>
                  <li>• Assurances</li>
                  <li>• Forfait téléphone/internet</li>
                  <li>• Électricité, eau, gaz</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Comment créer une récurrence ?</h3>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">1.</span>
                    <span>Allez dans l'onglet "🔄 Récurrences"</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">2.</span>
                    <span>Cliquez sur "➕ Nouvelle récurrence"</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">3.</span>
                    <span>Remplissez le formulaire (type, montant, catégorie, description)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">4.</span>
                    <span>Choisissez la fréquence (hebdo, mensuelle, trimestrielle, annuelle)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">5.</span>
                    <span>Définissez la date de début (et de fin si nécessaire)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">6.</span>
                    <span>Validez et c'est automatique !</span>
                  </li>
                </ol>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h4 className="font-semibold text-purple-800 mb-3">✨ Fonctionnalités avancées</h4>
              <ul className="space-y-2 text-sm text-purple-700">
                <li>• <strong>Fréquence personnalisée :</strong> Créez des récurrences tous les X mois</li>
                <li>• <strong>Date de fin :</strong> Pour les abonnements temporaires</li>
                <li>• <strong>Pause/Reprise :</strong> Mettez en pause une récurrence sans la supprimer</li>
                <li>• <strong>Historique :</strong> Voyez combien de fois elle a été générée</li>
                <li>• <strong>Prochaine échéance :</strong> Sachez quand elle sera créée</li>
              </ul>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h4 className="font-semibold text-orange-800 mb-3">⚠️ Bon à savoir</h4>
              <ul className="space-y-2 text-sm text-orange-700">
                <li>• Les récurrences sont générées automatiquement à leur date d'échéance</li>
                <li>• Les transactions générées ont un symbole 🔄 pour les identifier</li>
                <li>• Vous pouvez modifier ou supprimer une transaction récurrente comme les autres</li>
                <li>• Supprimer une récurrence n'efface pas les transactions déjà créées</li>
              </ul>
            </div>
          </div>
        )

      case 'tips':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">💡 Conseils pour bien gérer votre budget</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-4">📱 Utilisez votre mobile</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Mon Argent est optimisé pour mobile. Ajoutez l'app à votre écran d'accueil :
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Sur iPhone : Safari → Partager → Sur l'écran d'accueil</li>
                  <li>• Sur Android : Chrome → Menu → Ajouter à l'écran d'accueil</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-4">🎯 Soyez régulier</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Le secret d'un bon suivi budgétaire :
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Notez vos dépenses immédiatement</li>
                  <li>• Utilisez la reconnaissance vocale pour aller vite</li>
                  <li>• Consultez votre solde chaque semaine</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="font-semibold text-purple-800 mb-4">🏷️ Catégorisez bien</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Pour mieux comprendre vos dépenses :
                </p>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Créez des catégories qui vous parlent</li>
                  <li>• Soyez cohérent dans vos choix</li>
                  <li>• Consultez les graphiques régulièrement</li>
                </ul>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="font-semibold text-orange-800 mb-4">💾 Sauvegardez</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Protégez vos données :
                </p>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Exportez en JSON chaque mois</li>
                  <li>• Gardez plusieurs sauvegardes</li>
                  <li>• Testez l'import pour vérifier</li>
                </ul>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">🎯 Objectifs budgétaires recommandés</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Règle 50/30/20 :</strong>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• 50% : Besoins essentiels (logement, courses...)</li>
                    <li>• 30% : Envies et loisirs</li>
                    <li>• 20% : Épargne et remboursements</li>
                  </ul>
                </div>
                <div>
                  <strong>Fonds d'urgence :</strong>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• Minimum : 1 mois de salaire</li>
                    <li>• Idéal : 3-6 mois de dépenses</li>
                    <li>• À constituer progressivement</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">⚡ Raccourcis et astuces</h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li>• <strong>Filtres rapides :</strong> Cliquez sur les cartes du dashboard pour filtrer l'historique</li>
                <li>• <strong>Période personnalisée :</strong> Utilisez les filtres de date dans l'historique</li>
                <li>• <strong>Multi-sélection :</strong> Créez plusieurs budgets pour différents projets</li>
                <li>• <strong>Export CSV :</strong> Ouvrez dans Excel pour des analyses plus poussées</li>
               <li>• <strong>Mode sombre :</strong> Votre navigateur peut forcer un thème sombre automatiquement</li>
               <li>• <strong>Recherche :</strong> Utilisez la barre de recherche pour retrouver une transaction</li>
             </ul>
           </div>
         </div>
       )

     case 'faq':
       return (
         <div className="space-y-6">
           <h2 className="text-2xl font-bold mb-6">❓ Questions fréquentes</h2>

           <div className="space-y-4">
             <details className="bg-white rounded-lg shadow-md">
               <summary className="p-4 cursor-pointer font-semibold hover:bg-gray-50">
                 🔒 Mes données sont-elles sécurisées ?
               </summary>
               <div className="p-4 border-t">
                 <p className="text-gray-700">
                   <strong>OUI, à 100% !</strong> Toutes vos données restent sur votre appareil. 
                   Aucune information n'est envoyée sur internet. Nous n'avons pas de serveur, 
                   pas de base de données, pas d'accès à vos informations. C'est comme un carnet 
                   de comptes numérique qui reste chez vous.
                 </p>
               </div>
             </details>

             <details className="bg-white rounded-lg shadow-md">
               <summary className="p-4 cursor-pointer font-semibold hover:bg-gray-50">
                 📱 Puis-je utiliser l'app sur plusieurs appareils ?
               </summary>
               <div className="p-4 border-t">
                 <p className="text-gray-700 mb-3">
                   Oui, mais les données ne se synchronisent pas automatiquement. Pour transférer vos données :
                 </p>
                 <ol className="text-sm text-gray-600 space-y-1">
                   <li>1. Exportez en JSON sur l'appareil source (📤 Export)</li>
                   <li>2. Transférez le fichier (email, cloud, USB...)</li>
                   <li>3. Importez le JSON sur le nouvel appareil</li>
                 </ol>
               </div>
             </details>

             <details className="bg-white rounded-lg shadow-md">
               <summary className="p-4 cursor-pointer font-semibold hover:bg-gray-50">
                 🎤 La reconnaissance vocale ne fonctionne pas
               </summary>
               <div className="p-4 border-t">
                 <p className="text-gray-700 mb-3">Vérifiez ces points :</p>
                 <ul className="text-sm text-gray-600 space-y-1">
                   <li>• Autorisez l'accès au microphone quand demandé</li>
                   <li>• Utilisez Chrome, Safari ou Edge (navigateurs compatibles)</li>
                   <li>• Vérifiez que votre micro fonctionne</li>
                   <li>• Parlez clairement après avoir cliqué sur le micro</li>
                   <li>• Sur iPhone : utilisez Safari (pas Chrome)</li>
                 </ul>
               </div>
             </details>

             <details className="bg-white rounded-lg shadow-md">
               <summary className="p-4 cursor-pointer font-semibold hover:bg-gray-50">
                 💸 L'application est-elle vraiment gratuite ?
               </summary>
               <div className="p-4 border-t">
                 <p className="text-gray-700">
                   <strong>OUI, totalement gratuite !</strong> Pas d'abonnement caché, pas de version "Pro" payante, 
                   pas de publicités. Mon Argent est un projet personnel créé pour aider les gens à mieux gérer 
                   leur budget. Si vous l'appréciez, parlez-en autour de vous ! 😊
                 </p>
               </div>
             </details>

             <details className="bg-white rounded-lg shadow-md">
               <summary className="p-4 cursor-pointer font-semibold hover:bg-gray-50">
                 🔄 Comment fonctionnent les récurrences ?
               </summary>
               <div className="p-4 border-t">
                 <p className="text-gray-700">
                   Les récurrences sont vérifiées et générées automatiquement chaque jour. 
                   Quand vous ouvrez l'app, elle crée les transactions échues depuis votre 
                   dernière visite. Vous verrez un message de confirmation et les transactions 
                   apparaîtront avec le symbole 🔄.
                 </p>
               </div>
             </details>

             <details className="bg-white rounded-lg shadow-md">
               <summary className="p-4 cursor-pointer font-semibold hover:bg-gray-50">
                 📊 Puis-je personnaliser les catégories ?
               </summary>
               <div className="p-4 border-t">
                 <p className="text-gray-700">
                   Absolument ! Dans l'onglet "🏷️ Catégories", vous pouvez :
                   • Ajouter vos propres catégories
                   • Supprimer celles que vous n'utilisez pas
                   • Les transactions existantes seront transférées vers "Autre" si vous supprimez leur catégorie
                 </p>
               </div>
             </details>

             <details className="bg-white rounded-lg shadow-md">
               <summary className="p-4 cursor-pointer font-semibold hover:bg-gray-50">
                 🌐 Faut-il une connexion internet ?
               </summary>
               <div className="p-4 border-t">
                 <p className="text-gray-700">
                   NON ! Une fois la page chargée la première fois, l'application fonctionne 
                   hors ligne. Seule la reconnaissance vocale nécessite internet (pour convertir 
                   votre voix en texte). Tout le reste fonctionne sans connexion.
                 </p>
               </div>
             </details>

             <details className="bg-white rounded-lg shadow-md">
               <summary className="p-4 cursor-pointer font-semibold hover:bg-gray-50">
                 🗑️ J'ai supprimé des données par erreur
               </summary>
               <div className="p-4 border-t">
                 <p className="text-gray-700">
                   Si vous avez une sauvegarde JSON récente, vous pouvez la réimporter. 
                   Sinon, malheureusement les données supprimées ne peuvent pas être récupérées. 
                   C'est pourquoi nous recommandons d'exporter régulièrement vos données (au moins une fois par mois).
                 </p>
               </div>
             </details>
           </div>

           <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
             <h3 className="font-semibold text-blue-800 mb-3">💬 Une autre question ?</h3>
             <p className="text-blue-700">
               Cette application est en constante évolution. Si vous avez des suggestions 
               d'amélioration ou rencontrez un problème, n'hésitez pas à nous le faire savoir !
             </p>
           </div>
         </div>
       )

     default:
       return null
   }
 }

 return (
   <div className="max-w-6xl mx-auto">
     <div className="bg-white rounded-lg shadow-lg">
       <div className="p-6 border-b">
         <h1 className="text-3xl font-bold text-center">📚 Centre d'aide</h1>
         <p className="text-center text-gray-600 mt-2">Tout ce qu'il faut savoir sur Mon Argent</p>
       </div>

       <div className="flex flex-col lg:flex-row">
         {/* Menu latéral */}
         <div className="lg:w-64 border-r border-gray-200 p-4">
           <nav className="space-y-2">
             {sections.map(section => (
               <button
                 key={section.id}
                 onClick={() => setActiveSection(section.id)}
                 className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                   activeSection === section.id
                     ? 'bg-blue-50 text-blue-700 font-medium'
                     : 'hover:bg-gray-50 text-gray-700'
                 }`}
               >
                 <span className="mr-2">{section.icon}</span>
                 {section.label}
               </button>
             ))}
           </nav>
         </div>

         {/* Contenu */}
         <div className="flex-1 p-6">
           {renderContent()}
         </div>
       </div>
     </div>
   </div>
 )
}