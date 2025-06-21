import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">

        <div className="footer-content-left">
            <img className='logo' src={assets.piya1} alt="" />
            <p> DabbaBites is Kolkata’s trusted cloud kitchen platform, delivering fresh, home-style meals straight to your doorstep. We believe in quality, speed, and great taste every time.</p>
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
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>

        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+1-212-456-7890</li>
                <li>contact@dabbabites.com</li>
            </ul>
        </div>
      </div>
      <hr />
        <p className="footer-copyright">Copyright 2025 © DabbaBites.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
