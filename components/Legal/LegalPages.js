import { useState } from 'react'

const LegalPages = () => {
  const [activePage, setActivePage] = useState('mentions')

  const renderContent = () => {
    switch(activePage) {
      case 'mentions':
        return <MentionsLegales />
      case 'cgu':
        return <CGU />
      case 'confidentialite':
        return <PolitiqueConfidentialite />
      default:
        return <MentionsLegales />
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Navigation des pages légales */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          <button
            onClick={() => setActivePage('mentions')}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
              activePage === 'mentions'
                ? 'bg-blue-500 text-white border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            Mentions légales
          </button>
          <button
            onClick={() => setActivePage('cgu')}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
              activePage === 'cgu'
                ? 'bg-blue-500 text-white border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            CGU
          </button>
          <button
            onClick={() => setActivePage('confidentialite')}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
              activePage === 'confidentialite'
                ? 'bg-blue-500 text-white border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            Confidentialité
          </button>
        </div>
      </div>

      {/* Contenu */}
      {renderContent()}
    </div>
  )
}

const MentionsLegales = () => (
  <div className="prose max-w-none">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Mentions légales</h1>
    
    <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Éditeur du site</h2>
    <p className="mb-4">
      <strong>Raison sociale :</strong> Web Online Concept<br />
      <strong>Adresse :</strong> Rue Paul Estival, 31200 Toulouse<br />
      <strong>SIRET :</strong> 510 583 800 00048<br />
      <strong>Email :</strong> web.online.concept@gmail.com<br />
      <strong>Site web :</strong> <a href="https://web-online-concept.com" className="text-blue-500 hover:underline">web-online-concept.com</a>
    </p>

    <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Directeur de la publication</h2>
    <p className="mb-4">
      Le directeur de la publication est le représentant légal de Web Online Concept.
    </p>

    <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Hébergement</h2>
    <p className="mb-4">
      <strong>Hébergeur :</strong> Vercel Inc.<br />
      <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br />
      <strong>Site web :</strong> <a href="https://vercel.com" className="text-blue-500 hover:underline">vercel.com</a>
    </p>

    <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Propriété intellectuelle</h2>
    <p className="mb-4">
      L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
    </p>

    <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Responsabilité</h2>
    <p className="mb-4">
      Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour à différentes périodes de l'année, mais peut toutefois contenir des inexactitudes ou des omissions. Si vous constatez une lacune, erreur ou ce qui paraît être un dysfonctionnement, merci de bien vouloir le signaler par email en décrivant le problème de la manière la plus précise possible.
    </p>

    <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Liens hypertextes</h2>
    <p className="mb-4">
      Les liens hypertextes mis en place dans le cadre du présent site internet en direction d'autres ressources présentes sur le réseau Internet ne sauraient engager la responsabilité de Web Online Concept.
    </p>

    <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Données personnelles</h2>
    <p className="mb-4">
      Aucune information personnelle n'est collectée à votre insu. L'application fonctionne entièrement en local sur votre appareil. Pour plus d'informations, consultez notre <button onClick={() => setActivePage('confidentialite')} className="text-blue-500 hover:underline">politique de confidentialité</button>.
    </p>
  </div>
)

const CGU = () => (
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
  </div>
)

const PolitiqueConfidentialite = () => (
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
  </div>
)

export default LegalPages