import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDocFromServer } from 'firebase/firestore';
import { auth, db } from '../Firebase/FirebaseApp';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  const [opLoading, setOpLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      setIsStaff(false);

      if (!u) { setLoading(false); return; }

      try {
        // Læs staff/{uid} direkte fra serveren (ingen streaming/cache)
        const snap = await getDocFromServer(doc(db, 'staff', u.uid));
        setIsStaff(snap.exists());
      } catch (err) {
        if (__DEV__) console.warn('[Auth] staff read error:', err?.code, err?.message);
        setIsStaff(false);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const login = async (email, password) => {
    setOpLoading(true); setError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      setError(e?.message || 'Login fejlede');
      throw e;
    } finally {
      setOpLoading(false);
    }
  };

  const logout = async () => {
    setOpLoading(true);
    try { await signOut(auth); }
    finally { setOpLoading(false); }
  };

  const value = useMemo(
    () => ({ user, isStaff, loading, opLoading, error, login, logout }),
    [user, isStaff, loading, opLoading, error]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}