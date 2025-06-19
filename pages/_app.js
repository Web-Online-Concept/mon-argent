import '../styles/globals.css'
import { useEffect } from 'react'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    console.log('🚀 Mon Budget Pro - Application démarrée')
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp