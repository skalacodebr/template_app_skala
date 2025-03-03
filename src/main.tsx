import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCedcoY5ZiHE4ie5LY2XGgtGmgeDH6fw-c",
  authDomain: "donamaria-dcde3.firebaseapp.com",
  projectId: "donamaria-dcde3",
  storageBucket: "donamaria-dcde3.firebasestorage.app",
  messagingSenderId: "907263945006",
  appId: "1:907263945006:web:b7355360b4879081f3b2bf"
};

initializeApp(firebaseConfig);

createRoot(document.getElementById("root")!).render(<App />);
