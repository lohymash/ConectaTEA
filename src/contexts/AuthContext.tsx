import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addXP: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Monitorar estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Buscar dados adicionais do Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();
        
        setUser({
          id: firebaseUser.uid,
          name: userData?.name || firebaseUser.displayName || "Usuário",
          email: firebaseUser.email || "",
          avatar: userData?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${firebaseUser.uid}`,
          level: userData?.level || 1,
          xp: userData?.xp || 0,
          bio: userData?.bio || ""
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // O usuário será definido pelo onAuthStateChanged
    } catch (error: any) {
      throw new Error(error.message || "Erro ao fazer login");
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualizar perfil com nome
      if (userCredential.user) {
        await updateFirebaseProfile(userCredential.user, { displayName: name });
      }
      
      // Criar documento do usuário no Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        level: 1,
        xp: 0,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${userCredential.user.uid}`,
        createdAt: Date.now()
      });
      
      // O usuário será definido pelo onAuthStateChanged
    } catch (error: any) {
      throw new Error(error.message || "Erro ao criar conta");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (user && auth.currentUser) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      
      // Atualizar no Firestore
      await setDoc(doc(db, 'users', user.id), updatedUser, { merge: true });
    }
  };

  const addXP = async (amount: number) => {
    if (user && auth.currentUser) {
      const newXP = user.xp + amount;
      const xpForNextLevel = user.level * 100;
      
      let newLevel = user.level;
      let remainingXP = newXP;
      
      while (remainingXP >= newLevel * 100) {
        remainingXP -= newLevel * 100;
        newLevel++;
      }
      
      const updatedUser = { ...user, xp: remainingXP, level: newLevel };
      setUser(updatedUser);
      
      // Atualizar no Firestore
      await setDoc(doc(db, 'users', user.id), updatedUser, { merge: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
        addXP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
