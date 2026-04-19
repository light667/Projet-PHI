import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({ 
    uid: 'bypass-user-123', 
    email: 'test@phi.app', 
    displayName: 'Test User' 
  } as User);
  const [isLoading] = useState(false);

  useEffect(() => {
    // BYPASS: Firebase auth is deactivated for now to allow access to pages
    // const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    //   setUser(currentUser);
    //   setIsLoading(false);
    // });
    // return unsubscribe;
  }, []);

  const signOut = async () => {
    // await firebaseSignOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
