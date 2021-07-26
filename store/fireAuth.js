/* eslint-disable prettier/prettier */
import React, {createContext, useContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import _ from 'lodash'

export const AuthContext = createContext();

export function AuthContextProvider({children}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        return auth().onAuthStateChanged(setUser);
    }, []);

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
}

export function useFirebaseAuth() {
    const context = useContext(AuthContext);
    if (_.isUndefined(context)) {
        throw new Error(
            'useFirebaseAuth must be used within a FirebaseAuthProvider'
        );
    }
    return context.user;
}
