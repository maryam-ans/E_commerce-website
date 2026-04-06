import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingCart, FiTrash2, FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import useCart from '../hooks/useCart'
import CartItem from '../components/CartItem'
import { formatPrice, calculateCartTotals } from '../utils/helpers'
import './Cart.css'

const Cart = () => {
  const { cartItems, clearCart } = useCart()
  const { subtotal, tax, shipping, total } = calculateCartTotals(cartItems)

  return (
    <div className="cart-page">
      <div className="container">
        {/* Header */}
        <div className="cart-header">
          <div>
            <h1 className="section-title">Shopping Cart</h1>
            <p className="section-subtitle">
              {cartItems.length > 0
                ? `${cartItems.reduce((s, i) => s + i.quantity, 0)} item(s) in your cart`
                : 'Your cart is empty'}
            </p>
          </div>
          {cartItems.length > 0 && (
            <button
              className="btn btn-danger btn-sm"
              onClick={clearCart}
              id="clear-cart-btn"
            >
              <FiTrash2 size={14} /> Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/products" className="btn btn-primary" id="cart-browse-btn">
              <FiShoppingCart size={16} /> Browse Products
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Items */}
            <div className="cart-items-section">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CartItem item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>

              <Link to="/products" className="btn btn-outline continue-shopping-btn">
                <FiArrowLeft size={16} /> Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <motion.div
              className="cart-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'free-shipping' : ''}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Tax (8%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="shipping-note">
                  Add {formatPrice(50 - subtotal)} more for FREE shipping
                </div>
              )}

              <Link to="/checkout" className="btn btn-primary btn-lg checkout-btn" id="to-checkout-btn">
                Proceed to Checkout <FiArrowRight size={18} />
              </Link>

              <div className="secure-badge">🔒 Secure Checkout — SSL Encrypted</div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
