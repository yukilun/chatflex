import React, { useContext } from 'react';
import avatar from '../../assets/avatar.png';
import { AuthContext } from '../../context/AuthContext';
import './NavProfile.scss';
import { MdLogout } from 'react-icons/md';
import { auth, db } from '../../firebase';
import { signOut } from "firebase/auth";
import { ref, serverTimestamp, set } from 'firebase/database';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';

export default function NavProfile() {

    const { onDisconnectRef } = useContext(AuthContext);
    const { currentUser: user } = useContext(UserContext);

    console.log(user);

    const handleLogout = async () => {
        toast.dismiss();
        const msg = toast.loading('Logging Out...')
        try {
            await set(ref(db, `users/${user.uid}/status`), 'offline');
            await set(ref(db, `users/${user.uid}/lastOnline`), serverTimestamp());
            await onDisconnectRef.cancel();
            await signOut(auth);
            toast.update(msg, { render: "Logged Out Successfully!", type: "success", isLoading: false, autoClose: 2000, closeButton: null });
        }
        catch (err) {
            toast.update(msg, { render: `Unable to logout! ${err.code}`, type: "success", isLoading: false, autoClose: 2000, closeButton: null });
        }
    }

    return (
        <div className='nav-profile'>
            <div className='nav-profile--info'>
                <img src={user.customPhotoURL ? user.customPhotoURL : user.photoURL ? user.photoURL : avatar} alt="user icon" className='nav-profile--info__icon'/>
                <div className='nav-profile--info__name'>{user.customDisplayName ? user.customDisplayName : user.displayName}</div>
                <div className={'nav-profile--info__status ' + (user.status === 'online' ? 'online' : 'offline')}> </div>
            </div>
            <div className='nav-profile--btns'>
                <button className='btn' onClick={handleLogout}><MdLogout /></button>
            </div>
        </div>
    )
}
