import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth, db } from '../firebase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUserProfile(firebaseUser) {
    if (!firebaseUser) {
      setUserProfile(null);
      return null;
    }

    const userSnapshot = await getDoc(doc(db, 'users', firebaseUser.uid));
    const profile = userSnapshot.exists() ? { uid: firebaseUser.uid, ...userSnapshot.data() } : null;
    setUserProfile(profile);
    return profile;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);

      if (!firebaseUser) {
        await loadUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        await loadUserProfile(firebaseUser);
      } catch (error) {
        console.error('Failed to load user profile:', error);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function logout() {
    await signOut(auth);
  }

  async function refreshProfile() {
    return loadUserProfile(auth.currentUser);
  }

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      logout,
      refreshProfile,
      role: userProfile?.role,
      userProfile,
    }),
    [currentUser, loading, userProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
