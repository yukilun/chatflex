import { createContext, useEffect, useState } from "react";
import { auth, db } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { ref, onDisconnect, set, serverTimestamp, remove } from "firebase/database";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [onDisconnectRef, setOnDisconnectRef] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            if(firebaseUser) {
                set(ref(db, `users/${firebaseUser.uid}/status`), 'online');
                remove(ref(db, `users/${firebaseUser.uid}/lastOnline`));
                onDisconnect(ref(db, `users/${firebaseUser.uid}/status`)).set('offline');
                const dcRef =  onDisconnect(ref(db, `users/${firebaseUser.uid}/lastOnline`));
                dcRef.set(serverTimestamp());
                setOnDisconnectRef(dcRef);
            }
            else {
                setOnDisconnectRef(null);
            }
        });
        return () => unsub();
    }, []);



    return <AuthContext.Provider value={{ user, onDisconnectRef }}>{children}</AuthContext.Provider>
};