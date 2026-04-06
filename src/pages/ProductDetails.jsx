import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiShoppingCart, FiHeart, FiArrowLeft, FiStar,
  FiShoppingBag, FiShare2, FiCheck
} from 'react-icons/fi'
import { productService } from '../services/api'
import { useCartContext } from '../context/CartContext'
import { formatPrice, getCategoryLabel } from '../utils/helpers'
import './ProductDetails.css'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const { addToCart, toggleWishlist, isInCart, isInWishlist } = useCartContext()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await productService.getProductById(id)
        setProduct(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
    window.scrollTo(0, 0)
  }, [id])

  if (loading) {
    return (
      <div className="container pd-skeleton-wrap">
        <div className="pd-skeleton">
          <div className="skeleton" style={{ width: '100%', height: '400px', borderRadius: 'var(--radius-lg)' }} />
          <div className="pd-skeleton-info">
            <div className="skeleton" style={{ height: '20px', width: '100px' }} />
            <div className="skeleton" style={{ height: '36px', width: '80%' }} />
            <div className="skeleton" style={{ height: '24px', width: '60%' }} />
            <div className="skeleton" style={{ height: '100px', width: '100%' }} />
            <div className="skeleton" style={{ height: '50px', width: '200px' }} />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h3>Product not found</h3>
          <p>{error || 'This product does not exist.'}</p>
          <Link to="/products" className="btn btn-primary">Back to Products</Link>
        </div>
      </div>
    )
  }

  const inCart = isInCart(product.id)
  const inWishlist = isInWishlist(product.id)
  const rating = product.rating?.rate || 0
  const fullStars = Math.floor(rating)

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product)
    }
  }

  return (
    <div className="pd-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <Link to="/products" className="breadcrumb-link">
            <FiArrowLeft size={14} /> Products
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{getCategoryLabel(product.category)}</span>
        </div>

        <div className="pd-layout">
          {/* Image Section */}
          <motion.div
            className="pd-image-section"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="pd-image-main">
              <img src={product.image} alt={product.title} />
            </div>
            {/* Thumbnail dots (decorative) */}
            <div className="pd-thumbnails">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`pd-thumb ${i === 1 ? 'active' : ''}`}>
                  <img src={product.image} alt={`View ${i}`} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            className="pd-info"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="pd-category">{getCategoryLabel(product.category)}</span>
            <h1 className="pd-title">{product.title}</h1>

            {/* Rating */}
            <div className="pd-rating">
              <div className="stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <FiStar
                    key={i}
                    size={16}
                    className={i < fullStars ? 'star-filled' : 'star-empty'}
                  />
                ))}
              </div>
              <span className="pd-rating-text">
                {rating} / 5.0 ({product.rating?.count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="pd-price-section">
              <span className="pd-price">{formatPrice(product.price)}</span>
              <span className="pd-price-tag">
                <FiCheck size={12} /> In Stock
              </span>
            </div>

            {/* Description */}
            <div className="pd-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Quantity */}
            <div className="pd-qty-section">
              <span className="pd-qty-label">Quantity</span>
              <div className="qty-control">
                <button
                  className="qty-btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  id="pd-qty-dec"
                >
                  −
                </button>
                <span className="qty-value">{qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQty((q) => q + 1)}
                  id="pd-qty-inc"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pd-actions">
              <button
                className={`btn btn-primary btn-lg pd-cart-btn ${inCart ? 'in-cart' : ''}`}
                onClick={handleAddToCart}
                id="pd-add-to-cart"
              >
                <FiShoppingCart size={18} />
                {inCart ? 'Added to Cart' : 'Add to Cart'}
              </button>

              <button
                className={`btn btn-outline pd-wishlist-btn ${inWishlist ? 'wishlisted' : ''}`}
                onClick={() => toggleWishlist(product)}
                id="pd-wishlist-btn"
              >
                <FiHeart size={18} />
                {inWishlist ? 'Saved' : 'Save'}
              </button>

              <button className="btn btn-ghost pd-share-btn" aria-label="Share">
                <FiShare2 size={18} />
              </button>
            </div>

            {/* Go to Cart */}
            {inCart && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pd-in-cart-notice"
              >
                <FiShoppingBag size={14} />
                <span>Item is in your cart.</span>
                <Link to="/cart" className="cart-link">Go to Cart →</Link>
              </motion.div>
            )}

            {/* Tags */}
            <div className="pd-tags">
              <span className="badge badge-primary">#{product.category}</span>
              <span className="badge badge-primary">Free Shipping</span>
              <span className="badge badge-primary">Easy Returns</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
