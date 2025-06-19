import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-8">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo/Nom de l'app */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-gray-800">💰 Mon Argent</h3>
            <p className="text-sm text-gray-600">Gérez votre budget simplement</p>
          </div>

          {/* Liens légaux */}
          <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
            <Link href="/mentions-legales" className="text-gray-600 hover:text-blue-500 transition-colors">
              Mentions légales
            </Link>
            <Link href="/cgu" className="text-gray-600 hover:text-blue-500 transition-colors">
              CGU
            </Link>
            <Link href="/confidentialite" className="text-gray-600 hover:text-blue-500 transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-4 pt-4 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Web Online Concept - Tous droits réservés
          </p>
          <p className="text-xs text-gray-400 mt-1">
            <a 
              href="https://web-online-concept.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              web-online-concept.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer