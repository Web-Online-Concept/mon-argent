import Head from 'next/head'
import Link from 'next/link'
import Footer from '../components/Footer'

export default function Confidentialite() {
  return (
    <>
      <Head>
        <title>Politique de Confidentialité - Mon Argent</title>
        <meta name="description" content="Politique de confidentialité de l'application Mon Argent par Web Online Concept" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 max-w-6xl">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-blue-500 transition-colors">
                <span>💰</span>
                <span>Mon Argent</span>
              </Link>
              <Link href="/" className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
                ← Retour à l'app
              </Link>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="prose max-w-none">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Politique de Confidentialité</h1>
              
              <p className="mb-4 text-gray-600">
                <em>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</em>
              </p>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">1. Introduction</h2>
              <p className="mb-4">
                Web Online Concept, éditeur de l'application "Mon Argent", s'engage à protéger la confidentialité de ses utilisateurs. Cette politique explique comment nous traitons vos données personnelles.
              </p>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">2. Principe fondamental : Stockage local</h2>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <p className="font-semibold text-green-800">
                  🔒 Confidentialité maximale : Toutes vos données restent sur votre appareil !
                </p>
                <p className="text-green-700 mt-2">
                  L'application "Mon Argent" fonctionne entièrement en local. Aucune donnée financière ou personnelle n'est transmise à nos serveurs ou à des tiers.
                </p>
              </div>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">3. Données collectées</h2>
              <h3 className="text-lg font-medium text-gray-600 mt-4 mb-2">3.1 Données stockées localement</h3>
              <p className="mb-4">
                Les données suivantes sont stockées uniquement sur votre appareil :
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Vos transactions financières (montants, catégories, descriptions)</li>
                <li>Vos catégories de budget personnalisées</li>
                <li>Vos paramètres d'application</li>
                <li>Vos données de récurrences</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-600 mt-4 mb-2">3.2 Données non collectées</h3>
              <p className="mb-4">
                Nous ne collectons, ne stockons et ne traitons aucune de ces informations :
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Informations bancaires ou codes d'accès</li>
                <li>Données personnelles d'identification</li>
                <li>Historique de navigation</li>
                <li>Géolocalisation</li>
                <li>Contacts ou photos</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">4. Reconnaissance vocale</h2>
              <p className="mb-4">
                La fonctionnalité de reconnaissance vocale utilise l'API native de votre navigateur. Les enregistrements audio :
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Sont traités localement par votre navigateur</li>
                <li>Ne sont jamais enregistrés ou stockés</li>
                <li>Ne transitent pas par nos serveurs</li>
                <li>Peuvent être désactivés à tout moment dans les paramètres</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">5. Cookies et technologies similaires</h2>
              <p className="mb-4">
                L'application utilise uniquement :
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li><strong>localStorage :</strong> Pour sauvegarder vos données localement</li>
                <li><strong>sessionStorage :</strong> Pour maintenir l'état de l'application pendant votre session</li>
              </ul>
              <p className="mb-4">
                Aucun cookie de suivi ou d'analyse n'est utilisé.
              </p>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">6. Sécurité</h2>
              <p className="mb-4">
                Vos données étant stockées localement sur votre appareil :
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Nous recommandons de sécuriser votre appareil avec un mot de passe</li>
                <li>Effectuez régulièrement des sauvegardes via la fonction d'export</li>
                <li>Vos données sont automatiquement supprimées si vous videz le cache de votre navigateur</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">7. Vos droits</h2>
              <p className="mb-4">
                Puisque nous ne collectons aucune donnée personnelle :
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Vous contrôlez entièrement vos données</li>
                <li>Vous pouvez les supprimer à tout moment via les paramètres de l'application</li>
                <li>Vous pouvez exporter vos données quand vous le souhaitez</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">8. Modifications de cette politique</h2>
              <p className="mb-4">
                Toute modification de cette politique sera communiquée via l'application et prendra effet après publication.
              </p>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">9. Contact</h2>
              <p className="mb-4">
                Pour toute question concernant cette politique de confidentialité :
              </p>
              <p className="mb-4">
                <strong>Email :</strong> web.online.concept@gmail.com<br />
                <strong>Adresse :</strong> Web Online Concept, Rue Paul Estival, 31200 Toulouse
              </p>

              {/* Navigation vers les autres pages */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Voir aussi :</h3>
                <div className="flex flex-wrap gap-4">
                  <Link href="/mentions-legales" className="text-blue-500 hover:underline">
                    Mentions légales
                  </Link>
                  <Link href="/cgu" className="text-blue-500 hover:underline">
                    Conditions Générales d'Utilisation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}