import React from 'react';
import './NavHeader.scss';
import { MdClose } from 'react-icons/md';

export default function NavHeader({setOpenNavbar}) {
  return (
    <div className='nav-header'>
        <button className='btn toggle' onClick={()=>setOpenNavbar(false)}><MdClose /></button>   
        <h1 className='logo'>chatflex</h1> 
    </div>
  )
}
