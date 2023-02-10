import React, { useContext } from 'react';
import { MdOutlineMenu } from 'react-icons/md';
import './ChatHeader.scss';
import { ChatContext } from '../../context/ChatContext';
import avatar from '../../assets/avatar.png';
import unknown from '../../assets/unknown.png';


export default function ChatHeader({setOpenNavbar}) {

    const { chat } = useContext(ChatContext); 

  return (
    <div className='chat-header'>
        <button className='btn toggle' onClick={()=>setOpenNavbar(true)}><MdOutlineMenu /></button>
        <img src={chat.chatId ? chat.toUser.photoURL || avatar : unknown } alt="to user icon"/>
        {chat.chatId ? <div className='toUser-name'>{chat.toUser.displayName}</div>: <div className='toUser-name noUser'>No User Selected</div>}
        <div className={'status ' + chat.toUser.status}> </div>
    </div>
  )
}
