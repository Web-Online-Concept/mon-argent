import '../styles/globals.css';
import Layout from '../components/Layout';
import DataMigration from '../components/DataMigration';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  useEffect(() => {
    // Vérifier si l'utilisateur a déjà visité l'app
    const hasVisited = localStorage.getItem('hasVisited');
    
    // Si c'est la première visite et qu'on n'est pas déjà sur le tutoriel
    if (!hasVisited && router.pathname !== '/tutorial') {
      router.push('/tutorial');
    }
  }, [router]);

  return (
    <DataMigration>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </DataMigration>
  );
}

export default MyApp;