import axios from 'axios'

const BASE_URL = 'https://dummyjson.com'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export const productService = {
  // Get all products (up to 100)
  getAllProducts: async () => {
    const data = await api.get('/products?limit=100&select=id,title,price,description,category,thumbnail,rating,stock')
    return data.products.map(normalizeProduct)
  },

  // Get single product
  getProductById: async (id) => {
    const data = await api.get(`/products/${id}`)
    return normalizeProductFull(data)
  },

  // Get all categories
  getCategories: async () => {
    const data = await api.get('/products/categories')
    return data.map((c) => c.slug || c)
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    const data = await api.get(`/products/category/${category}?limit=100`)
    return data.products.map(normalizeProduct)
  },

  // Search products
  searchProducts: async (q) => {
    const data = await api.get(`/products/search?q=${encodeURIComponent(q)}&limit=50`)
    return data.products.map(normalizeProduct)
  },
}

// Normalize DummyJSON product → FakeStore-compatible shape
function normalizeProduct(p) {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    image: p.thumbnail,
    rating: { rate: p.rating, count: p.stock ?? 0 },
  }
}

function normalizeProductFull(p) {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    image: p.thumbnail,
    images: p.images || [p.thumbnail],
    rating: { rate: p.rating, count: p.stock ?? 0 },
    brand: p.brand,
    stock: p.stock,
    discountPercentage: p.discountPercentage,
  }
}

export default api
