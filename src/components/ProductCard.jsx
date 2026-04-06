import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi'
import { useCartContext } from '../context/CartContext'
import { formatPrice, truncateText, getCategoryLabel } from '../utils/helpers'
import './ProductCard.css'

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart, toggleWishlist, isInCart, isInWishlist } = useCartContext()
  const inCart = isInCart(product.id)
  const inWishlist = isInWishlist(product.id)

  const rating = product.rating?.rate || 0
  const fullStars = Math.floor(rating)

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      layout
    >
      {/* Image */}
      <Link to={`/products/${product.id}`} className="product-card-image-wrap">
        <img
          src={product.image}
          alt={product.title}
          className="product-card-image"
          loading="lazy"
        />
        <div className="product-card-overlay">
          <span className="product-card-view">View Details</span>
        </div>
        {/* Wishlist btn */}
        <button
          className={`product-card-wishlist ${inWishlist ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); toggleWishlist(product) }}
          aria-label="Add to wishlist"
          id={`wishlist-btn-${product.id}`}
        >
          <FiHeart size={16} />
        </button>
      </Link>

      {/* Body */}
      <div className="product-card-body">
        <span className="product-card-category">{getCategoryLabel(product.category)}</span>

        <Link to={`/products/${product.id}`}>
          <h3 className="product-card-title">{truncateText(product.title, 60)}</h3>
        </Link>

        {/* Rating */}
        <div className="product-card-rating">
          <div className="stars">
            {Array.from({ length: 5 }, (_, i) => (
              <FiStar
                key={i}
                size={13}
                className={i < fullStars ? 'star-filled' : 'star-empty'}
              />
            ))}
          </div>
          <span className="rating-count">({product.rating?.count || 0})</span>
        </div>

        {/* Price + Cart */}
        <div className="product-card-footer">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          <button
            className={`btn btn-sm product-cart-btn ${inCart ? 'in-cart' : 'btn-primary'}`}
            onClick={() => addToCart(product)}
            id={`add-to-cart-${product.id}`}
            aria-label={`Add ${product.title} to cart`}
          >
            <FiShoppingCart size={14} />
            {inCart ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
