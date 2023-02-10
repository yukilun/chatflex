import React, { useContext } from 'react';
import avatar from '../../assets/avatar.png';
import { UserContext } from '../../context/UserContext';
import { ChatContext } from '../../context/ChatContext';

export default function NavResultUsers({ users, setOpenNavbar }) {

  const { dispatch } = useContext(ChatContext);
  const { currentUser: user } = useContext(UserContext);

  const handleSelect = (u) => {
    dispatch({ type: 'change_user', payload: u });
    setOpenNavbar(false);
  }

  return (
    <div className='result'>
      <h3 className='result--title'>Users</h3>

      {users.map((u) => {
        if (u.uid === user.uid) return null;
        return (
          <div key={'user-' + u.uid} className='result--item' onClick={() => handleSelect(u)} >
            <img src={u.photoURL ? u.photoURL : avatar} alt="user icon" className='result--item__icon' />
            <div className='result--item__name'>
              {u.displayName}
            </div>
          </div>
        );
      })}

    </div>
  )
}
