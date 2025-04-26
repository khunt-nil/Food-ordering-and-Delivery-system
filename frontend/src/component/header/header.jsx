import React from 'react'
import './header.css'

export const Header = () => {
  return (
    <div className='header'>
        <div className="header-contents">
        <h2>
            Order Your <br/>Favourite Food here
        </h2>
        <p>Choose Your Favourite food here....Our mission is to satisfy your craving and elevate your dining experience.one delices meal at a time</p>
        {/* <button >View Menu</button> */}
        <a id='unique' href="#food-display" onClick={() =>{}} >View Menu</a>
        </div>
    </div>
  )
}
