import React from 'react'
import { Link } from 'react-router-dom'
import './PageNotFound.scss';

export default function PageNotFound() {
  return (
    <div className='container'>
      <p className='not-found'>Page Not Found!</p>
      <Link to={'/'} className="btn-theme-light">Home</Link>
    </div>
  )
}
