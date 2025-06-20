import Head from 'next/head';
import AddTransaction from '../components/Transactions/AddTransaction';

export default function Add() {
  return (
    <>
      <Head>
        <title>Ajouter une transaction - Mon Argent</title>
      </Head>
      
      <AddTransaction />
    </>
  );
}