import React, { useContext } from 'react'
import './Chat.scss'; 
import ChatHeader from './chat-components/ChatHeader';
import ChatMessages from './chat-components/ChatMessages';
import ChatInput from './chat-components/ChatInput';
import { ChatContext } from '../context/ChatContext';

export default function Chat({setOpenNavbar}) {
  
  const { chat } = useContext(ChatContext);
  
  return (
    <div className='chat'>
      <ChatHeader setOpenNavbar={setOpenNavbar} />
      <ChatMessages />
      {chat.chatId && <ChatInput />}
    </div>
  )
}
