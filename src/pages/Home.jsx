import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiShoppingBag, FiStar, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi'
import { productService } from '../services/api'
import ProductCard from '../components/ProductCard'
import { getCategoryLabel } from '../utils/helpers'
import './Home.css'

// Top categories to show on homepage
const CATEGORIES = [
  { id: 'smartphones', icon: '📱', color: '#8b5cf6' },
  { id: 'laptops', icon: '💻', color: '#06b6d4' },
  { id: 'mens-shirts', icon: '👔', color: '#f59e0b' },
  { id: 'womens-dresses', icon: '👗', color: '#ec4899' },
]

// Feature highlights shown below hero
const FEATURES = [
  { icon: <FiTruck />, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: <FiShield />, title: 'Secure Payment', desc: '100% secure transactions' },
  { icon: <FiRefreshCw />, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: <FiStar />, title: 'Top Rated', desc: 'Trusted by thousands' },
]

const Home = () => {
  // State for featured products
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  // useEffect runs once when component mounts — fetches top rated products
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await productService.getAllProducts()
        // Sort by rating and take top 6
        const topRated = [...data].sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 6)
        setFeatured(topRated)
      } catch (err) {
        console.error('Failed to load featured products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <div className="home-page">

      {/* ── HERO SECTION ── */}
      <section className="hero">
        <div className="container hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="hero-badge">🛍️ New Arrivals — Spring 2026</span>

            <h1 className="hero-title">
              Shop the Best Products<br />
              <span className="text-gradient">All in One Place</span>
            </h1>

            <p className="hero-subtitle">
              Browse electronics, fashion, beauty, and more.
              Free shipping on orders over $50.
            </p>

            <div className="hero-btns">
              <Link to="/products" className="btn btn-primary btn-lg" id="hero-shop-now">
                Shop Now <FiArrowRight size={16} />
              </Link>
              <Link to="/products?category=smartphones" className="btn btn-outline btn-lg">
                Smartphones
              </Link>
            </div>

            {/* Quick stats */}
            <div className="hero-stats">
              <div className="stat"><span className="stat-num">100+</span><span className="stat-lbl">Products</span></div>
              <div className="stat-sep" />
              <div className="stat"><span className="stat-num">10+</span><span className="stat-lbl">Categories</span></div>
              <div className="stat-sep" />
              <div className="stat"><span className="stat-num">4.5★</span><span className="stat-lbl">Avg Rating</span></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES BAR ── */}
      <section className="features-bar">
        <div className="container features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-item">
              <div className="feature-icon">{f.icon}</div>
              <div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ── */}
      <section className="section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find what you're looking for</p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">View All <FiArrowRight size={14} /></Link>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/products?category=${cat.id}`}
                className="category-card"
                id={`home-cat-${cat.id}`}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-label">{getCategoryLabel(cat.id)}</span>
                <FiArrowRight className="cat-arrow" size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Top Rated Products</h2>
            <p className="section-subtitle">Highest rated picks from our store</p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">All Products <FiArrowRight size={14} /></Link>
        </div>

        {/* Show skeletons while loading */}
        {loading ? (
          <div className="home-products-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="product-skeleton-home">
                <div className="skeleton" style={{ aspectRatio: '4/3' }} />
                <div style={{ padding: '1rem', display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                  <div className="skeleton" style={{ height: '12px', width: '60px' }} />
                  <div className="skeleton" style={{ height: '14px', width: '100%' }} />
                  <div className="skeleton" style={{ height: '30px', marginTop: '0.4rem' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="home-products-grid">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="cta-section container">
        <div className="cta-box">
          <FiShoppingBag size={36} className="cta-icon" />
          <h2>Ready to Start Shopping?</h2>
          <p>100+ products across 10+ categories. New items added regularly.</p>
          <Link to="/products" className="btn btn-primary btn-lg" id="cta-explore">
            Explore All Products <FiArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  )
}

export default Home
