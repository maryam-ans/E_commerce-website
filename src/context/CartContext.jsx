/*
  CartContext.jsx
  ──────────────────────────────────────────
  This file creates the GLOBAL STATE for our app.
  
  WHY we need this:
    - Cart and Wishlist data is used by MANY pages
      (ProductCard, Cart page, Checkout page, etc.)
    - Instead of passing data as props through every component,
      we store it in ONE central place called "Context"
    - Any component can read from it using useContext()

  HOW it works:
    1. createContext()  → creates the "container" for our global data
    2. useReducer()     → like useState but for complex state changes
    3. CartProvider     → wraps the whole app and shares the data
    4. useCartContext()  → custom hook any component uses to access the data
*/

import { createContext, useContext, useReducer, useEffect } from 'react'
import { toast } from 'react-toastify'

// Step 1: Create the context (empty container at first)
const CartContext = createContext(null)

// ── REDUCER FUNCTION ─────────────────────────────────────
// A reducer takes the current state + an action, and returns NEW state.
// Think of it like: "Given what we have, what should happen next?"
const cartReducer = (state, action) => {
  switch (action.type) {

    // ADD_TO_CART: either increase quantity or add new item
    case 'ADD_TO_CART': {
      const existing = state.cartItems.find((item) => item.productId === action.payload.id)
      if (existing) {
        // Product already in cart → just increase quantity by 1
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.productId === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      // Product not in cart → add it with quantity 1
      return {
        ...state,
        cartItems: [
          ...state.cartItems,
          {
            productId: action.payload.id,
            title: action.payload.title,
            price: action.payload.price,
            image: action.payload.image,
            category: action.payload.category,
            quantity: 1,
          },
        ],
      }
    }

    // REMOVE_FROM_CART: filter out the item with matching productId
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.productId !== action.payload),
      }

    // UPDATE_QUANTITY: set new quantity, or remove if quantity goes to 0
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cartItems: state.cartItems.filter((item) => item.productId !== action.payload.productId),
        }
      }
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
    }

    // CLEAR_CART: empty the cart completely
    case 'CLEAR_CART':
      return { ...state, cartItems: [] }

    // ADD_TO_WISHLIST: if already in wishlist → remove; if not → add (toggle)
    case 'ADD_TO_WISHLIST': {
      const alreadyIn = state.wishlistItems.some((item) => item.productId === action.payload.id)
      if (alreadyIn) {
        return {
          ...state,
          wishlistItems: state.wishlistItems.filter((item) => item.productId !== action.payload.id),
        }
      }
      return {
        ...state,
        wishlistItems: [
          ...state.wishlistItems,
          {
            productId: action.payload.id,
            title: action.payload.title,
            price: action.payload.price,
            image: action.payload.image,
            category: action.payload.category,
            rating: action.payload.rating,
          },
        ],
      }
    }

    // REMOVE_FROM_WISHLIST: remove specific item
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlistItems: state.wishlistItems.filter((item) => item.productId !== action.payload),
      }

    default:
      return state
  }
}

// ── LOAD STATE FROM LOCALSTORAGE ─────────────────────────
// When page refreshes, we don't want to lose cart data.
// We save to localStorage and load it back here.
const loadState = () => {
  try {
    const saved = localStorage.getItem('shopverse-state')
    if (!saved) return { cartItems: [], wishlistItems: [] }
    return JSON.parse(saved)
  } catch {
    return { cartItems: [], wishlistItems: [] }
  }
}

// ── PROVIDER COMPONENT ────────────────────────────────────
// This wraps the whole app. All children can access cart/wishlist state.
export function CartProvider({ children }) {
  // useReducer: like useState but uses our cartReducer function above
  const [state, dispatch] = useReducer(cartReducer, loadState())

  // Whenever state changes, save to localStorage so data persists on refresh
  useEffect(() => {
    localStorage.setItem('shopverse-state', JSON.stringify(state))
  }, [state])

  // ── Helper functions (these "dispatch" actions to the reducer) ──

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product })
    toast.success(`Added to cart! 🛒`, { position: 'bottom-right', autoClose: 2000 })
  }

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
    toast.info('Removed from cart', { position: 'bottom-right', autoClose: 2000 })
  }

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  // Toggle: adds if not in wishlist, removes if already there
  const toggleWishlist = (product) => {
    const isInWishlist = state.wishlistItems.some((item) => item.productId === product.id)
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product })
    toast.success(
      isInWishlist ? 'Removed from wishlist' : 'Added to wishlist! ❤️',
      { position: 'bottom-right', autoClose: 2000 }
    )
  }

  const removeFromWishlist = (productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId })
    toast.info('Removed from wishlist', { position: 'bottom-right', autoClose: 2000 })
  }

  // Helper checkers
  const isInCart = (productId) => state.cartItems.some((item) => item.productId === productId)
  const isInWishlist = (productId) => state.wishlistItems.some((item) => item.productId === productId)

  // Total number of items across all cart entries
  const cartCount = state.cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Everything we share with the rest of the app
  const value = {
    cartItems: state.cartItems,
    wishlistItems: state.wishlistItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    removeFromWishlist,
    isInCart,
    isInWishlist,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Custom hook — makes it easy to use the context in any component
export const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCartContext must be used inside CartProvider')
  return context
}
