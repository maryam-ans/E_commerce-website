// Format price to USD currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

// Truncate text to a given length
export const truncateText = (text, maxLength = 80) => {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

// Calculate star rating array
export const getStars = (rating) => {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return { full, half, empty }
}

// Calculate cart totals
export const calculateCartTotals = (cartItems) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const shipping = subtotal > 50 ? 0 : 9.99
  const total = subtotal + tax + shipping
  return { subtotal, tax, shipping, total }
}

// Category display names — handles both FakeStore slugs and DummyJSON hyphenated slugs
export const getCategoryLabel = (category) => {
  const labels = {
    // FakeStore
    "electronics": "Electronics",
    "jewelery": "Jewelry",
    "men's clothing": "Men's Clothing",
    "women's clothing": "Women's Clothing",
    // DummyJSON common
    "smartphones": "Smartphones",
    "laptops": "Laptops",
    "fragrances": "Fragrances",
    "skincare": "Skincare",
    "groceries": "Groceries",
    "home-decoration": "Home Decor",
    "furniture": "Furniture",
    "tops": "Tops",
    "womens-dresses": "Women's Dresses",
    "womens-shoes": "Women's Shoes",
    "mens-shirts": "Men's Shirts",
    "mens-shoes": "Men's Shoes",
    "mens-watches": "Men's Watches",
    "womens-watches": "Women's Watches",
    "womens-bags": "Women's Bags",
    "womens-jewellery": "Jewellery",
    "sunglasses": "Sunglasses",
    "automotive": "Automotive",
    "motorcycle": "Motorcycles",
    "lighting": "Lighting",
    "beauty": "Beauty",
    "sports-accessories": "Sports",
    "vehicle": "Vehicle",
  }
  if (labels[category]) return labels[category]
  // Auto-prettify any unknown slug: "some-category" → "Some Category"
  return category
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Sort products
export const sortProducts = (products, sortBy) => {
  const sorted = [...products]
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'rating':
      return sorted.sort((a, b) => b.rating.rate - a.rating.rate)
    case 'newest':
      return sorted.sort((a, b) => b.id - a.id)
    default:
      return sorted
  }
}

// Filter products by price range
export const filterByPrice = (products, priceRange) => {
  if (!priceRange || priceRange === 'all') return products
  const ranges = {
    '0-50': [0, 50],
    '50-200': [50, 200],
    '200-500': [200, 500],
    '500+': [500, Infinity],
    // Legacy FakeStore ranges (kept for compatibility)
    '0-100': [0, 100],
    '100-500': [100, 500],
    '500-1000': [500, 1000],
    '1000+': [1000, Infinity],
  }
  const [min, max] = ranges[priceRange] || [0, Infinity]
  return products.filter((p) => p.price >= min && p.price <= max)
}
