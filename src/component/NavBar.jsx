import React from 'react'
import LogoMain from '../assets/img/logo-main.jpg'

const NavBar = () => {
  return (
    <nav>
      <div className='first-div'>
        <img src={LogoMain} alt="logo"/>
        <h1>VoxVoice</h1>
      </div>
      <div className='second-div'>
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Pricing</a>
          </li>
          <li>
            <a href="#">Docs</a>
          </li>
          <li>
            <a href="#">Voice AI</a>
          </li>
          <li id='last-child'>
            <a href="#">Try it</a>
          </li>
        </ul>
      </div>
      <div className='div-mobile'>
        <button>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
          </svg>
        </button>
      </div>
    </nav>
  )
}

export default NavBar