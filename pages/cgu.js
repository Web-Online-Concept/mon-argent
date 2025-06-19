import Head from 'next/head'
import Link from 'next/link'
import Footer from '../components/Footer'

export default function CGU() {
  return (
    <>
      <Head>
        <title>Conditions Générales d'Utilisation - Mon Argent</title>
        <meta name="description" content="Conditions Générales d'Utilisation de l'application Mon Argent par Web Online Concept" />
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
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Conditions Générales d'Utilisation</h1>
              
              <p className="mb-4 text-gray-600">
                <em>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</em>
              </p>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">1. Objet</h2>
              <p className="mb-4">
                Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions d'utilisation de l'application "Mon Argent" éditée par Web Online Concept.
              </p>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">2. Acceptation des conditions</h2>
              <p className="mb-4">
                L'utilisation de l'application "Mon Argent" implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser cette application.
              </p>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">3. Description du service</h2>
              <p className="mb-4">
                "Mon Argent" est une application de gestion budgétaire personnelle qui permet aux utilisateurs de :
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Suivre leurs revenus et dépenses</li>
                <li>Catégoriser leurs transactions</li>
                <li>Visualiser des statistiques budgétaires</li>
                <li>Utiliser la reconnaissance vocale pour saisir des données</li>
                <li>Gérer des transactions récurrentes</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">4. Utilisation du service</h2>
              <p className="mb-4">
                L'application est fournie gratuitement. Toutes les données sont stockées localement sur votre appareil. L'utilisateur s'engage à :
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Utiliser l'application conformément à sa destination</li>
                <li>Ne pas tenter de contourner les mesures de sécurité</li>
                <li>Ne pas utiliser l'application à des fins illégales ou frauduleuses</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">5. Responsabilité de l'utilisateur</h2>
              <p className="mb-4">
                L'utilisateur est seul responsable de :
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>La exactitude des données qu'il saisit</li>
                <li>La sauvegarde de ses données</li>
                <li>L'utilisation qu'il fait des informations et fonctionnalités de l'application</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">6. Limitation de responsabilité</h2>
              <p className="mb-4">
                Web Online Concept ne saurait être tenu responsable :
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Des pertes de données résultant d'un dysfonctionnement de l'appareil de l'utilisateur</li>
                <li>Des décisions financières prises par l'utilisateur sur la base des informations de l'application</li>
                <li>Des interruptions temporaires du service</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">7. Propriété intellectuelle</h2>
              <p className="mb-4">
                L'application, son code source, son design et son contenu sont la propriété exclusive de Web Online Concept et sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle.
              </p>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">8. Modification des CGU</h2>
              <p className="mb-4">
                Web Online Concept se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prendront effet dès leur publication sur le site.
              </p>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">9. Droit applicable</h2>
              <p className="mb-4">
                Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
              </p>

              <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">10. Contact</h2>
              <p className="mb-4">
                Pour toute question relative aux présentes CGU, vous pouvez nous contacter à : web.online.concept@gmail.com
              </p>

              {/* Navigation vers les autres pages */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Voir aussi :</h3>
                <div className="flex flex-wrap gap-4">
                  <Link href="/mentions-legales" className="text-blue-500 hover:underline">
                    Mentions légales
                  </Link>
                  <Link href="/confidentialite" className="text-blue-500 hover:underline">
                    Politique de Confidentialité
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