import { createContext, useContext, useEffect, useReducer } from "react";
import { AuthContext } from "./AuthContext";
import { getChatId } from "../helper/helper";

import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {

    const { user } = useContext(AuthContext);

    const initialState = {
        toUser: {},
        chatId: null
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case 'change_user':
                return {
                    toUser: action.payload,
                    chatId: getChatId(user, action.payload)
                };
            case 'update_user_info': 
                return {
                    ...state, toUser: action.payload
                }
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    // update the selected user info
    useEffect(() => {
        if(state.chatId) {
            const unsub = onValue(ref(db, 'users/' + state.toUser.uid), (snapshot) => {
                dispatch({type: "update_user_info", payload: snapshot.val()})
            })
            return () => unsub();
        }
    }, [state.chatId, state.toUser.uid]);


    return <ChatContext.Provider value={{ chat: state, dispatch }}>{children}</ChatContext.Provider>
};