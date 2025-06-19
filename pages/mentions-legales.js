import Head from 'next/head'
import Link from 'next/link'
import Footer from '../components/Footer'

export default function MentionsLegales() {
  return (
    <>
      <Head>
        <title>Mentions légales - Mon Argent</title>
        <meta name="description" content="Mentions légales de l'application Mon Argent par Web Online Concept" />
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
                Aucune information personnelle n'est collectée à votre insu. L'application fonctionne entièrement en local sur votre appareil. Pour plus d'informations, consultez notre <Link href="/confidentialite" className="text-blue-500 hover:underline">politique de confidentialité</Link>.
              </p>

              {/* Navigation vers les autres pages */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Voir aussi :</h3>
                <div className="flex flex-wrap gap-4">
                  <Link href="/cgu" className="text-blue-500 hover:underline">
                    Conditions Générales d'Utilisation
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