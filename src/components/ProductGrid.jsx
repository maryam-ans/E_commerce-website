import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'
import './ProductGrid.css'

const SkeletonCard = () => (
  <div className="product-skeleton">
    <div className="skeleton skeleton-image" />
    <div className="skeleton-body">
      <div className="skeleton skeleton-tag" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-title short" />
      <div className="skeleton skeleton-stars" />
      <div className="skeleton skeleton-footer" />
    </div>
  </div>
)

const ProductGrid = ({ products, loading, error }) => {
  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⚠️</div>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <h3>No products found</h3>
        <p>Try adjusting your search or filters to find what you're looking for.</p>
      </div>
    )
  }

  return (
    <motion.div className="product-grid" layout>
      <AnimatePresence>
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export default ProductGrid
