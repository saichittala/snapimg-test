import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <div>
    <header>
      <div className="header-main">
        <a href="/">
          <img className="logo" src="img/logo.svg" alt="SnapIMG - Free Online Image Compression and Conversion Tool"/>
        </a>
        
        <nav>
          <div className='buttons-div-header'>
            <Link to="/compressimages" className="btn-2 ci">Compress Images</Link>
            <Link to="/convertpng" className="btn-2 ctp">Convert to PNG</Link>
            <Link to="/convertjpg" className="btn-2 ctj">Convert JPG</Link>
            <Link to="/convertwebp" className="btn-2 ctw">Convert to WebP</Link>
          </div>
        </nav>
        
        <div className='buttons-div-header'>
          <a className="btn-1 login" href="#">Login</a>
          <a className="btn-3" href="#">Signup</a>
        </div>
      </div>
    </header>
    </div>
  )
}

export default Header
