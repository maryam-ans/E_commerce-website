import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import useProducts from '../hooks/useProducts'
import useDebounce from '../hooks/useDebounce'
import { productService } from '../services/api'
import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'
import Filters from '../components/Filters'
import { sortProducts, filterByPrice, getCategoryLabel } from '../utils/helpers'
import './Products.css'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [priceRange, setPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [tabs, setTabs] = useState([])

  const debouncedSearch = useDebounce(searchInput, 400)
  const { products, loading, error } = useProducts(category === 'all' ? null : category)

  // Load tabs from API
  useEffect(() => {
    productService.getCategories().then((cats) => {
      setTabs(cats.slice(0, 6).map((c) => c.slug || c))
    }).catch(() => {})
  }, [])

  // Sync URL params
  useEffect(() => {
    const params = {}
    if (debouncedSearch) params.search = debouncedSearch
    if (category !== 'all') params.category = category
    setSearchParams(params)
  }, [debouncedSearch, category, setSearchParams])

  // Apply URL params on mount
  useEffect(() => {
    const urlCategory = searchParams.get('category')
    const urlSearch = searchParams.get('search')
    if (urlCategory) setCategory(urlCategory)
    if (urlSearch) setSearchInput(urlSearch)
  }, [])

  // Filtered + sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products]
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      )
    }
    result = filterByPrice(result, priceRange)
    result = sortProducts(result, sortBy)
    return result
  }, [products, debouncedSearch, priceRange, sortBy])

  const handleTabChange = (tab) => {
    setCategory(tab)
    setSearchInput('')
  }

  const pageTitle = category === 'all' ? 'All Products' : getCategoryLabel(category)

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="products-header">
        <div className="container">
          <h1 className="section-title">{pageTitle}</h1>
          <p className="section-subtitle">
            {loading
              ? 'Loading products...'
              : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
      </div>

      <div className="container">
        {/* Category Tabs */}
        <div className="category-tabs">
          <button
            className={`category-tab ${category === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
            id="tab-all"
          >
            All Products
          </button>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`category-tab ${category === tab ? 'active' : ''}`}
              onClick={() => handleTabChange(tab)}
              id={`tab-${tab}`}
            >
              {getCategoryLabel(tab)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="products-controls">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search products by name, brand, category..."
          />
        </div>

        {/* Main Layout */}
        <div className="products-layout">
          <Filters
            category={category}
            setCategory={setCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          <div className="products-main">
            <ProductGrid products={filteredProducts} loading={loading} error={error} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
