import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth, db } from '../firebase.js';

const AuthContext = createContext(null);

function normalizeProfile(firebaseUser, data) {
  if (!firebaseUser || !data) return null;
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    fullName: data.fullName || data.ownerName || firebaseUser.displayName || '',
    ...data,
  };
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUserProfile(firebaseUser = auth.currentUser) {
    if (!firebaseUser) {
      setUserProfile(null);
      return null;
    }

    const snapshot = await getDoc(doc(db, 'users', firebaseUser.uid));
    const profile = snapshot.exists() ? normalizeProfile(firebaseUser, snapshot.data()) : null;
    setUserProfile(profile);
    return profile;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);

      try {
        await loadUserProfile(firebaseUser);
      } catch (error) {
        console.error('Failed to load user profile:', error);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  async function login(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await loadUserProfile(credential.user);
    return { user: credential.user, profile };
  }

  async function registerUser({ fullName, email, password, phone }) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: fullName });

    const payload = {
      uid: credential.user.uid,
      fullName,
      email,
      phone: phone || '',
      role: 'user',
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', credential.user.uid), payload);
    setUserProfile(normalizeProfile(credential.user, payload));
    return credential.user;
  }

  async function registerProvider(values) {
    const credential = await createUserWithEmailAndPassword(auth, values.email, values.password);
    await updateProfile(credential.user, { displayName: values.ownerName });

    const userPayload = {
      uid: credential.user.uid,
      fullName: values.ownerName,
      email: values.email,
      phone: values.phone,
      role: 'provider',
      status: 'pending',
      businessName: values.businessName,
      location: values.location,
      experience: values.experience,
      description: values.description,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const providerPayload = {
      uid: credential.user.uid,
      businessName: values.businessName,
      ownerName: values.ownerName,
      email: values.email,
      phone: values.phone,
      location: values.location,
      experience: values.experience,
      description: values.description,
      verificationStatus: 'pending',
      adminNote: '',
      totalEarnings: 0,
      totalCommissionPaid: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await Promise.all([
      setDoc(doc(db, 'users', credential.user.uid), userPayload),
      setDoc(doc(db, 'providers', credential.user.uid), providerPayload),
    ]);

    setUserProfile(normalizeProfile(credential.user, userPayload));
    return credential.user;
  }

  async function logout() {
    await signOut(auth);
  }

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      login,
      logout,
      refreshProfile: loadUserProfile,
      registerProvider,
      registerUser,
      role: userProfile?.role,
      userProfile,
    }),
    [currentUser, loading, userProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
