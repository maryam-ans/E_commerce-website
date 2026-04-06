/*
  useProducts.js — Custom Hook
  ─────────────────────────────
  Custom hooks are functions that START with "use" and
  contain React logic (like useState + useEffect).

  WHY we made this hook:
    - Multiple pages need to fetch products (Home, Products page)
    - Instead of repeating the same fetch code everywhere,
      we write it ONCE here and reuse it

  Returns: { products, loading, error }
    - products: the array of products from the API
    - loading:  true while fetching (shows skeleton cards)
    - error:    string if something went wrong
*/

import { useState, useEffect } from 'react'
import { productService } from '../services/api'

const useProducts = (category = null) => {
  // State: the list of products
  const [products, setProducts] = useState([])
  // State: are we still loading?
  const [loading, setLoading] = useState(true)
  // State: did something go wrong?
  const [error, setError] = useState(null)

  // useEffect runs whenever `category` changes
  // If category is null → fetch ALL products
  // If category has a value → fetch only that category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        // async/await: wait for the API to respond before continuing
        const data = category
          ? await productService.getProductsByCategory(category)
          : await productService.getAllProducts()

        setProducts(data)
      } catch (err) {
        // If the API fails, store the error message to show to the user
        setError(err.message || 'Failed to load products')
      } finally {
        // This always runs — turn off loading spinner
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category]) // <-- dependency array: re-run when category changes

  return { products, loading, error }
}

export default useProducts
