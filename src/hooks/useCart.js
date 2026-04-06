import { useCartContext } from '../context/CartContext'

const useCart = () => {
  const {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
  } = useCartContext()

  return {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
  }
}

export default useCart
