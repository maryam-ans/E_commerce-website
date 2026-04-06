import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FiShoppingCart, FiHeart, FiSearch, FiMenu, FiX, FiZap } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartContext } from '../context/CartContext'
import './Navbar.css'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { cartCount, wishlistItems } = useCartContext()
  const navigate = useNavigate()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/wishlist', label: 'Wishlist' },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <FiZap className="logo-icon" />
          <span>ShopVerse</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Search toggle */}
          <button
            className="btn btn-ghost nav-icon-btn"
            onClick={() => setSearchOpen((p) => !p)}
            aria-label="Search"
            id="navbar-search-toggle"
          >
            <FiSearch size={20} />
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className="btn btn-ghost nav-icon-btn" aria-label="Wishlist">
            <FiHeart size={20} />
            {wishlistItems.length > 0 && (
              <span className="nav-badge">{wishlistItems.length}</span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="btn btn-ghost nav-icon-btn" aria-label="Cart" id="navbar-cart">
            <FiShoppingCart size={20} />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="nav-badge"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="btn btn-ghost nav-icon-btn mobile-menu-btn"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Menu"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="search-bar-overlay"
          >
            <form onSubmit={handleSearch} className="search-form container">
              <FiSearch className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search for products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                autoFocus
                id="navbar-search-input"
              />
              <button type="submit" className="btn btn-primary btn-sm" id="navbar-search-submit">
                Search
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mobile-nav"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/cart"
              className="mobile-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Cart {cartCount > 0 && `(${cartCount})`}
            </NavLink>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
