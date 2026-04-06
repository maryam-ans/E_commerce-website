import { Link } from 'react-router-dom'
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi'
import { formatPrice } from '../utils/helpers'
import useCart from '../hooks/useCart'
import './CartItem.css'

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart()

  return (
    <div className="cart-item">
      <Link to={`/products/${item.productId}`} className="cart-item-image-link">
        <img src={item.image} alt={item.title} className="cart-item-image" loading="lazy" />
      </Link>

      <div className="cart-item-info">
        <Link to={`/products/${item.productId}`}>
          <h4 className="cart-item-title">{item.title}</h4>
        </Link>
        <span className="cart-item-category">{item.category}</span>
        <span className="cart-item-price">{formatPrice(item.price)}</span>
      </div>

      <div className="cart-item-controls">
        <div className="qty-control">
          <button
            className="qty-btn"
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            aria-label="Decrease quantity"
            id={`qty-dec-${item.productId}`}
          >
            <FiMinus size={14} />
          </button>
          <span className="qty-value">{item.quantity}</span>
          <button
            className="qty-btn"
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            aria-label="Increase quantity"
            id={`qty-inc-${item.productId}`}
          >
            <FiPlus size={14} />
          </button>
        </div>

        <div className="cart-item-total">
          <span>{formatPrice(item.price * item.quantity)}</span>
        </div>

        <button
          className="btn btn-ghost remove-btn"
          onClick={() => removeFromCart(item.productId)}
          aria-label="Remove item"
          id={`remove-cart-${item.productId}`}
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export default CartItem
