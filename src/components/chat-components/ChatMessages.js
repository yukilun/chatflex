import React, { useContext, useEffect, useState, createRef } from 'react'
import { ChatContext } from '../../context/ChatContext';
import './ChatMessages.scss';
import { db } from '../../firebase';
import { MdMessage } from 'react-icons/md';
import { onValue, ref } from 'firebase/database';
import { ChatMessage } from './ChatMessage';
import { UserContext } from '../../context/UserContext';

export default function ChatMessages() {

    const { currentUser: user } = useContext(UserContext);
    const { chat } = useContext(ChatContext);
    const [messages, setMessages] = useState([]);
    const lastRef = createRef(null);

    useEffect(() => {
        if (chat.chatId) {
            onValue(ref(db, 'messages/' + chat.chatId), (snapshot) => {
                if (snapshot.exists()) {
                    setMessages(Object.values(snapshot.val()));
                }
                else {
                    setMessages([]);
                }
            })
        }
    }, [chat.chatId]);

    useEffect(()=> {
        setTimeout(()=>{
            if(lastRef.current) {
                lastRef.current.scrollIntoView({behavior: "smooth", block: "end"});
            }
        }, 500);
    },[lastRef]);

    if (!chat.chatId) {
        return (
            <div className='chat-no-user'>
                <i><MdMessage /></i>
                <h3>No User Selected!</h3>
                <p>Please select or search for existing chats / users from the menu...</p>
            </div>
        )
    }

    return (
        <div className='chat-messages'>
            {messages.map((msg, index) => (
                index === messages.length - 1?
                <ChatMessage message={msg} isSender={msg.sender === user.uid} key={index} ref={lastRef}/>:
                <ChatMessage message={msg} isSender={msg.sender === user.uid} key={index} ref={null}/>
            ))}
        </div>
    )
}
