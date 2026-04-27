import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import { LogIn, Loader2 } from 'lucide-react';
import { firestoreService } from '../services/firestoreService';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const p = await firestoreService.getUserProfile(u.uid);
        if (p) {
          setProfile(p);
        } else {
          // Initialize fresh profile
          const newProfile: UserProfile = {
            uid: u.uid,
            email: u.email || '',
            displayName: u.displayName || 'User',
            familyMembers: [],
            globalPreferences: {
              cuisines: [],
              dietaryRestrictions: [],
              budgetLimit: 0
            },
            inventory: []
          };
          await firestoreService.saveUserProfile(newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await firestoreService.getUserProfile(user.uid);
      setProfile(p);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, signIn } = React.useContext(AuthContext);
  const disableAuth = import.meta.env.VITE_DISABLE_AUTH === 'true';

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#fdfaf6]">
        <Loader2 className="h-8 w-8 animate-spin text-[#d97706]" />
      </div>
    );
  }

  if (disableAuth) {
    return <>{children}</>;
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#fdfaf6] px-6 text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-[#451a03]">BigBadMeal Prep</h1>
        <p className="mb-8 text-lg text-[#92400e]">Smart fuel for your family, simplified with AI.</p>
        <Button 
          onClick={signIn} 
          className="w-full max-w-xs h-14 text-lg bg-[#d97706] hover:bg-[#b45309] text-white shadow-xl rounded-2xl"
        >
          <LogIn className="mr-2 h-5 w-5" />
          Sign in with Google
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};
