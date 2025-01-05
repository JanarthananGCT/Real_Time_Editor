"use client"

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setIsNewUser(false);
      // You can add additional logic here for returning users
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  const signUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setIsNewUser(true);
    } catch (error) {
      console.error('Error signing up with Google', error);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setIsNewUser(false);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return { user, isNewUser, signIn, signUp, signOut: signOutUser };
}

