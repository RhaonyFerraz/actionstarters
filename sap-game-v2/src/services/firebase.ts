import { initializeApp } from 'firebase/app';
import { getAuth, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * CONFIGURAÇÃO DO FIREBASE
 * @important Você deve colar aqui as chaves do seu Console do Firebase.
 * O Firebase cuidará de Auth (Usuários) e Firestore (Banco de Dados NoSQL para Saves).
 */
const firebaseConfig = {
  apiKey: "AIzaSyA9lNCd-i3j3y9ugvX0Cu2u2B6CxE_gRo0",
  authDomain: "actionstarters-b18da.firebaseapp.com",
  projectId: "actionstarters-b18da",
  storageBucket: "actionstarters-b18da.firebasestorage.app",
  messagingSenderId: "349297673816",
  appId: "1:349297673816:web:61e95c972926576f05ec2d"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const githubProvider = new GithubAuthProvider();
