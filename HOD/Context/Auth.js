import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDocFromServer } from 'firebase/firestore';
import { auth, db } from '../Firebase/FirebaseApp';

const AuthCtx = createContext(null);

//holder styr på auth-state og udstiller login/logout
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
    // isStaff: flag der angiver om brugeren findes i 'staff' collection
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  const [opLoading, setOpLoading] = useState(false);
  const [error, setError] = useState(null);

  //lytter på auth-state og henter staff-rolle ved login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      setIsStaff(false);

      if (!u) { setLoading(false); return; }

      try {
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

  //logger ind med email/password
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
    //logger ud
  const logout = async () => {
    setOpLoading(true);
    try { await signOut(auth); }
    finally { setOpLoading(false); }
  };

  const value = useMemo(
    () => ({ user, isStaff, loading, opLoading, error, login, logout }),
    [user, isStaff, loading, opLoading, error]
  );

    // Udleverer auth-værdier til resten af appen via context provider
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
//henter auth-context og sikrer at den bruges indenfor provider
export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}