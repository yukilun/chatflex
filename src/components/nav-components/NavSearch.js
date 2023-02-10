import React from 'react';
import './NavSearch.scss';
import { MdSearch, MdOutlineCancel } from 'react-icons/md';

export default function NavSearch({query, setQuery}) {
  
    return (
    <div className='nav-search'>
        <div className='btn search'><MdSearch /></div>
        <input type="text" placeholder='Search...' onChange={(e)=>setQuery(e.target.value)} value={query}/>
        <button className={'btn cancel ' + (!query && 'hidden')}><MdOutlineCancel onClick={()=>setQuery('')}/></button>
    </div>
  )
}
