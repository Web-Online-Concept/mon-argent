import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Mon Argent - Application gratuite de gestion budgétaire avec reconnaissance vocale. Suivez vos dépenses et revenus facilement depuis votre mobile." />
        <meta name="keywords" content="budget, gestion budget, application budget, reconnaissance vocale, dépenses, revenus, budget personnel, finance personnelle, mobile, mon argent" />
        <meta name="author" content="Mon Argent" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Mon Argent - Gérez votre budget simplement" />
        <meta property="og:description" content="Application gratuite de gestion budgétaire avec reconnaissance vocale. Suivez vos dépenses et revenus facilement depuis votre mobile." />
        <meta property="og:url" content="https://mon-argent.pro/" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content="Mon Argent - Gérez votre budget simplement" />
        <meta property="twitter:description" content="Application gratuite de gestion budgétaire avec reconnaissance vocale." />
        
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mon Argent" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}