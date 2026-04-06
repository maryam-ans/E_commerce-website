import { Link } from 'react-router-dom'
import { FiZap, FiTwitter, FiInstagram, FiGithub, FiMail } from 'react-icons/fi'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <div className="footer-logo">
            <FiZap className="footer-logo-icon" />
            <span>ShopVerse</span>
          </div>
          <p className="footer-tagline">
            Your premium destination for discovering and shopping the best products online.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Twitter" className="social-link"><FiTwitter /></a>
            <a href="#" aria-label="Instagram" className="social-link"><FiInstagram /></a>
            <a href="#" aria-label="GitHub" className="social-link"><FiGithub /></a>
            <a href="#" aria-label="Email" className="social-link"><FiMail /></a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products?category=electronics">Electronics</Link></li>
            <li><Link to="/products?category=jewelery">Jewelry</Link></li>
            <li><Link to="/products?category=men's clothing">Men's Clothing</Link></li>
            <li><Link to="/products?category=women's clothing">Women's Clothing</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Account</h4>
          <ul>
            <li><Link to="/cart">My Cart</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/checkout">Checkout</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Returns & Refunds</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>© {new Date().getFullYear()} ShopVerse. All rights reserved.</p>
        <p>Built with React + Vite ⚡</p>
      </div>
    </footer>
  )
}

export default Footer
