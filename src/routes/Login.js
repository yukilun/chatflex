import React, { useState } from 'react';
import './Login.scss';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF, FaGithub } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { toast } from 'react-toastify';
import { loginValidate } from '../helper/validate';
// import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, child, get, set } from "firebase/database";

export default function Login() {

  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.dismiss();
    const error = loginValidate(input);
    if (Object.keys(error).length === 0) {
      const msg = toast.loading('Logging in...');
      signInWithEmailAndPassword(auth, input.email, input.password)
        .then(() => {
          navigate('/');
          toast.update(msg, { render: "Logged In!", type: "success", isLoading: false, autoClose: 2000, closeButton: null });
        })
        .catch(err => {
          switch (err.code) {
            case 'auth/wrong-password': toast.update(msg, { render: `Incorrect Password!`, type: "error", isLoading: false, autoClose: 2000, closeButton: null });
              break;
            case 'auth/user-not-found': toast.update(msg, { render: `User does not exist!`, type: "error", isLoading: false, autoClose: 2000, closeButton: null });
              break;
            default: toast.update(msg, { render: `Unable to login! ${err.code}`, type: "error", isLoading: false, autoClose: 2000, closeButton: null });
          }
        });
    }
  };

  const signIn = async (type) => {
    toast.dismiss();
    let provider = '';
    switch (type) {
      case 'google':
        provider = new GoogleAuthProvider();
        break;
      case 'facebook':
        provider = new FacebookAuthProvider();
        break;
      case 'github':
        provider = new GithubAuthProvider();
        break;
      default:
        return;
    };
    const msg = toast.loading(`Logging in with ${type} account...`);
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      // check if any user info in firestore
      const snapshot = await get(child(ref(db), `users/${result.user.uid}/uid`));
      // if not, store the user info in firebase and create empty chat
      if (!snapshot.exists()) {
        await set(ref(db, 'users/' + result.user.uid), {
          type: type,
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || result._tokenResponse.screenName,
          photoURL: result.user.photoURL,
          status: 'online'
        });
      }
      // else, update only some user info (ensure the photoURL is valid image)
      else {
        await Promise.all([
          set(ref(db, `users/${result.user.uid}/email`), result.user.email),
          set(ref(db, `users/${result.user.uid}/displayName`), result.user.displayName),
          set(ref(db, `users/${result.user.uid}/photoURL`), result.user.photoURL)
        ])
      }
      navigate('/');
      toast.update(msg, { render: "Logged In!", type: "success", isLoading: false, autoClose: 2000, closeButton: null });
    }
    catch (err) {
      toast.update(msg, { render: `Unable to login! ${err.code}`, type: "error", isLoading: false, autoClose: 2000, closeButton: null });
    }
  }

  return (
    <div className='container'>
      <div className='formContainer'>
        <h1 className='logo'>chatflex</h1>
        <form onSubmit={handleSubmit}>
          <div className="formArea">
            <div className="inputFields">
              <div className='input'>
                <label htmlFor="email">Email Address</label>
                <input type="text" placeholder='Email' id='email' autoComplete="on" onChange={(e) => setInput(prev => ({ ...prev, email: e.target.value }))} />
              </div>
              <div className='input'>
                <label htmlFor="password">Password</label>
                <input type="password" placeholder='Password' id='password' autoComplete="on" onChange={(e) => setInput(prev => ({ ...prev, password: e.target.value }))} />
              </div>
            </div>
          </div>
          <div className='submit'>
            <button type="submit" className='btn-theme'>
              <span>Login</span>
            </button>
          </div>
        </form>
        <div className="hr-text">Or Login With</div>
        <div className='other-login'>
          <button className="btn-app btn-app--google" onClick={() => signIn('google')}><FcGoogle /></button>
          <button className="btn-app btn-app--facebook" onClick={() => signIn('facebook')}><FaFacebookF /></button>
          <button className="btn-app btn-app--github" onClick={() => signIn('github')}><FaGithub /></button>
        </div>
        <div className='link'>Need an account? &nbsp;<Link to='../register' className='hyperlink'>Register</Link></div>
      </div>
    </div>
  )
}
