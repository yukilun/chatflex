import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/avatar.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registrationValidate } from '../helper/validate';
import { auth, storage, db } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateProfile, createUserWithEmailAndPassword } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore';
import { ref as dbRef, serverTimestamp, set} from 'firebase/database';

export default function Register() {

  const navigate = useNavigate();
  const [input, setInput] = useState({
    name: '',
    email: '',
    password: '',
    file: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    const error = registrationValidate(input);
    if (Object.keys(error).length === 0) {
      const msg = toast.loading('Registering...');
      try {
        // create user
        let userCredential = await createUserWithEmailAndPassword(auth, input.email, input.password);
        // upload avatar file with uniqlo name
        let userExtraInfo = { displayName: input.name, photoURL: null };
        if (input.file) {
          const storageRef = ref(storage, `${input.name + serverTimestamp()}`);
          await uploadBytesResumable(storageRef, input.file);
          // get downloadURL for the file
          let downloadURL = await getDownloadURL(storageRef);
          userExtraInfo = { ...userExtraInfo, photoURL: downloadURL };
        }
        // update the user profile
        await updateProfile(userCredential.user, userExtraInfo);

        // // store info in database
        // await Promise.all([
        //   // store user info (except password)
        //   setDoc(doc(db, 'users', userCredential.user.uid), {
        //     type: 'email',
        //     uid: userCredential.user.uid,
        //     email: input.email,
        //     ...userExtraInfo,
        //     connections: [],
        //     lastOnline: null
        //   }),
        //   // create empty chat for the user
        //   setDoc(doc(db, "chats", userCredential.user.uid), {})
        // ]);

        // store info in database
        await Promise.all([
          // store user info (except password)
          set(dbRef(db, 'users/' + userCredential.user.uid), {
            type: 'email',
            uid: userCredential.user.uid,
            email: input.email,
            ...userExtraInfo,
          }),
          // // create empty chat for the user
          // set(dbRef(db, "chats/" + userCredential.user.uid), {})
        ]);

        toast.update(msg, { render: "Registered Successfully!", type: "success", isLoading: false, autoClose: 2000, closeButton: null });
        navigate('/');
      }
      catch (err) {
        toast.update(msg, { render: `Something went wrong! ${err.code}`, type: "error", isLoading: false, autoClose: 2000, closeButton: null });
      }
    }
  }

  return (
    <div className='container'>
      <div className='formContainer'>
        <h1 className='logo'>chatflex</h1>
        <form onSubmit={handleSubmit}>
          <div className='formArea'>
            <div className="inputAvatar">
              <label htmlFor="avatar">
                <img src={input.file ? URL.createObjectURL(input.file) : avatar} alt="avatar" />
              </label>
              <input type="file" name="avatar" id="avatar" accept="image/*" onChange={(e) => setInput(prev => ({ ...prev, file: e.target.files[0] }))} />
            </div>
            <div className="inputFields">
              <div className='input'>
                <label htmlFor="name">Display Name</label>
                <input type="text" placeholder='e.g. John' id='name' autoComplete="off" onChange={(e) => setInput(prev => ({ ...prev, name: e.target.value }))} />
              </div>
              <div className='input'>
                <label htmlFor="email">Email Address</label>
                <input type="text" placeholder='e.g. john@example.com' id='email' autoComplete="on" onChange={(e) => setInput(prev => ({ ...prev, email: e.target.value }))} />
              </div>
              <div className='input'>
                <label htmlFor="password">Password</label>
                <input type="password" placeholder='at least 6 character' id='password' autoComplete="off" onChange={(e) => setInput(prev => ({ ...prev, password: e.target.value }))} />
              </div>
            </div>
          </div>
          <div className='submit'>
            <button type="submit" className='btn-theme'>
              <span>Register</span>
            </button>
          </div>
        </form>
        <div className='link'>Already a user? &nbsp;<Link to='../login' className='hyperlink'>Login</Link></div>
      </div>
    </div>
  )
}
