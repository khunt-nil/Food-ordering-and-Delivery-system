import React from 'react'
import './footer.css'
import { assets } from '../../assets/assets'
export const Footer= () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
            <img height="100px" width="100px" src={assets.logo} alt="" />
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>GET N TOUCH</h2>
                <ul><li>+9988776655</li>
                <li>contact@eatsjet.com</li></ul>
                </div>
        </div>
        <p className="footer-copyright">Copyright 2025 EatsJet.com All Rights Reserved. </p>
    </div>
  )
};

