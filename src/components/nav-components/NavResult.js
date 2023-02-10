import React from 'react';
import NavResultChats from './NavResultChats';
import NavResultUsers from './NavResultUsers';
import './NavResult.scss';

export default function NavResult({query, users, setOpenNavbar}) {
  
  return (
    <div className='nav-result'>
      <NavResultChats query={query} users={users} setOpenNavbar={setOpenNavbar}/>
      {users.length!== 0 && query && <NavResultUsers query={query} users={users} setOpenNavbar={setOpenNavbar}/>}
    </div>
  )
}
