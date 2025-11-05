import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// INSTRUÇÕES PARA CONFIGURAR O FIREBASE:
// 
// 1. Acesse https://console.firebase.google.com/
// 2. Clique em "Adicionar projeto" ou selecione um projeto existente
// 3. No menu lateral, clique no ícone de engrenagem > "Configurações do projeto"
// 4. Role até "Seus aplicativos" e clique no ícone </> (Web)
// 5. Registre o app com um nome (ex: "ConectaTEA")
// 6. Copie as credenciais do firebaseConfig abaixo
//
// 7. ATIVAR FIRESTORE:
//    - No menu lateral, clique em "Firestore Database"
//    - Clique em "Criar banco de dados"
//    - Escolha "Iniciar no modo de teste" (permite leitura/gravação por 30 dias)
//    - Escolha a localização (ex: southamerica-east1 para São Paulo)
//
// 8. ATIVAR AUTENTICAÇÃO:
//    - No menu lateral, clique em "Authentication"
//    - Clique em "Começar"
//    - Na aba "Sign-in method", ative "E-mail/senha"
//
// 9. REGRAS DE SEGURANÇA DO FIRESTORE (após testar):
//    - Vá em "Firestore Database" > "Regras"
//    - Substitua as regras por estas (mais seguras):
//
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /posts/{postId} {
//       allow read: if true;
//       allow create: if request.auth != null;
//       allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;
//     }
//     match /comments/{commentId} {
//       allow read: if true;
//       allow create: if request.auth != null;
//       allow delete: if request.auth != null && request.auth.uid == resource.data.authorId;
//     }
//     match /users/{userId} {
//       allow read: if true;
//       allow write: if request.auth != null && request.auth.uid == userId;
//     }
//   }
// }

// SUBSTITUA ESSAS CREDENCIAIS PELAS SUAS DO FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyAfu919LUyd992_4tnl67ZXKZ3JNeaebUA",
  authDomain: "conectatea-fb97e.firebaseapp.com",
  projectId: "conectatea-fb97e",
  storageBucket: "conectatea-fb97e.firebasestorage.app",
  messagingSenderId: "363792591251",
  appId: "1:363792591251:web:35c59a38a0d8194b7f6066",
  measurementId: "G-TYM5XBZ81T"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Serviços
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
