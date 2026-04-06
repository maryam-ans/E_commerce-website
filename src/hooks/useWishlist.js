import { useCartContext } from '../context/CartContext'

const useWishlist = () => {
  const {
    wishlistItems,
    toggleWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useCartContext()

  return {
    wishlistItems,
    toggleWishlist,
    removeFromWishlist,
    isInWishlist,
  }
}

export default useWishlist
