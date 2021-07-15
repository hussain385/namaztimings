/* eslint-disable prettier/prettier */
import React, { useState, useEffect, createContext, useContext } from 'react';
import auth from '@react-native-firebase/auth';

export const AuthContext = createContext();

export function AuthContextProvider({children}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const subscriber  = auth().onAuthStateChanged(setUser);
        return subscriber;
    }, []);

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
}

export function useFirebaseAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error(
        'useFirebaseAuth must be used within a FirebaseAuthProvider'
      );
    }
    return context.user;
  }
