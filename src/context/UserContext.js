import { createContext, useEffect, useState, useContext } from "react";
import { db } from '../firebase';
import { ref, onValue } from "firebase/database";
import { AuthContext } from "./AuthContext";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {

    const { user } = useContext(AuthContext);
    const [currentUser, setcurrentUser] = useState({});
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const unsubUser = onValue(ref(db, 'users/' + user.uid), (snapshot) => {
            setcurrentUser(snapshot.val());
        });
        const unsubUsers = onValue(ref(db, 'users'), (snapshot) => {
            setUsers(Object.values(snapshot.val()));
        });
        return () => {
            unsubUser();
            unsubUsers();
        }
    }, [user]);

    return <UserContext.Provider value={{ currentUser, users }}>{children}</UserContext.Provider>
};