import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi'
import useWishlist from '../hooks/useWishlist'
import useCart from '../hooks/useCart'
import { formatPrice, getCategoryLabel } from '../utils/helpers'
import './Wishlist.css'

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart, isInCart } = useCart()

  return (
    <div className="wishlist-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="section-title">
              <FiHeart style={{ color: '#ef4444', display: 'inline', marginRight: '0.5rem' }} />
              My Wishlist
            </h1>
            <p className="section-subtitle">
              {wishlistItems.length > 0
                ? `${wishlistItems.length} saved item${wishlistItems.length !== 1 ? 's' : ''}`
                : 'No saved items yet'}
            </p>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">❤️</div>
            <h3>Your wishlist is empty</h3>
            <p>Save products you love by clicking the heart icon on any product card.</p>
            <Link to="/products" className="btn btn-primary" id="wishlist-browse-btn">
              <FiShoppingCart size={16} /> Explore Products
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((item, i) => {
              const inCart = isInCart(item.productId)
              return (
                <motion.div
                  key={item.productId}
                  className="wishlist-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  {/* Image */}
                  <Link to={`/products/${item.productId}`} className="wishlist-image-wrap">
                    <img src={item.image} alt={item.title} className="wishlist-image" loading="lazy" />
                  </Link>

                  {/* Info */}
                  <div className="wishlist-info">
                    <span className="wishlist-category">{getCategoryLabel(item.category)}</span>
                    <Link to={`/products/${item.productId}`}>
                      <h3 className="wishlist-title">{item.title}</h3>
                    </Link>

                    {item.rating && (
                      <div className="wishlist-rating">
                        ⭐ {item.rating.rate} ({item.rating.count} reviews)
                      </div>
                    )}

                    <div className="wishlist-footer">
                      <span className="wishlist-price">{formatPrice(item.price)}</span>

                      <div className="wishlist-actions">
                        <button
                          className={`btn btn-sm ${inCart ? 'in-cart-btn' : 'btn-primary'}`}
                          onClick={() => addToCart({ ...item, id: item.productId })}
                          id={`wishlist-cart-${item.productId}`}
                        >
                          <FiShoppingCart size={13} />
                          {inCart ? 'In Cart' : 'Add to Cart'}
                        </button>

                        <button
                          className="btn btn-ghost remove-wishlist-btn"
                          onClick={() => removeFromWishlist(item.productId)}
                          aria-label="Remove from wishlist"
                          id={`wishlist-remove-${item.productId}`}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
