import React, {useState} from 'react'
import 'react-toastify/dist/ReactToastify.css';
import './Home.scss';
import Navbar from '../components/Navbar';
import Chat from '../components/Chat';
import { UserContextProvider } from '../context/UserContext';
import { ChatContextProvider } from '../context/ChatContext';

export default function Home() {

  const [isOpenNavbar, setOpenNavbar] = useState(false);

  return (
    <UserContextProvider>
      <ChatContextProvider>
        <div className='container'>
          <div className="home-container">
            <Navbar isOpenNavbar={isOpenNavbar} setOpenNavbar={setOpenNavbar}/>
            <Chat setOpenNavbar={setOpenNavbar}/>
          </div>
        </div>
      </ChatContextProvider>
    </UserContextProvider>
  )
}
