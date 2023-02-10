import React, { useState, useContext, useEffect } from 'react';
import avatar from '../../assets/avatar.png';
import { ChatContext } from '../../context/ChatContext';
import { UserContext } from '../../context/UserContext';
import { db } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import { getToUser } from '../../helper/helper';
import './NavResultChats.scss';

export default function NavResultChats({ query, users, setOpenNavbar }) {

  const [chats, setChats] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { currentUser: user } = useContext(UserContext);
  const { dispatch } = useContext(ChatContext);


  useEffect(() => {
    if (user) {
      onValue(ref(db, 'chats/' + user.uid), (snapshot) => {
        if (snapshot.exists()) {
          setChats(Object.values(snapshot.val()));
        }
        else {
          setChats([]);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    const fu = users.reduce((uArr, u) => {
      const index = chats.findIndex((c) => getToUser(user, c.chatId) === u.uid);
      if(index !== -1) uArr.push({...u, lastMessage: chats[index].lastMessage});
      return uArr;
    },[]);
    setFilteredUsers(fu);
  }, [user, users, chats, query]);

  const handleSelect = (u) => {
    dispatch({ type: 'change_user', payload: u });
    setOpenNavbar(false);
  }

  return (
    <div className='result'>
      <h3 className='result--title'>Chats</h3>

      {filteredUsers.length === 0 &&
        <div className='result--nothing'>
          No Chat Found!
        </div>
      }

      {filteredUsers.map((u) => (
        <div key={'chat-' + u.uid} className='result--item' onClick={() => handleSelect(u)} >
          <img src={u.photoURL ? u.photoURL : avatar} alt="user icon" className='result--item__icon' />
          <div className='result--item__name'>
            {u.displayName}
            <div className='last-msg'>{u.lastMessage?.text ? u.lastMessage.image ? '📷 ' + u.lastMessage.text : u.lastMessage.text: '📷 Photo' }</div>
          </div>
        </div>
      ))}

    </div>
  )
}
