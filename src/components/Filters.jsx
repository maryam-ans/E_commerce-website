import { useState, useEffect } from 'react'
import { FiFilter, FiChevronDown } from 'react-icons/fi'
import { productService } from '../services/api'
import { getCategoryLabel } from '../utils/helpers'
import './Filters.css'

const PRICE_RANGES = [
  { label: 'All Prices', value: 'all' },
  { label: '$0 – $50', value: '0-50' },
  { label: '$50 – $200', value: '50-200' },
  { label: '$200 – $500', value: '200-500' },
  { label: '$500+', value: '500+' },
]

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Newest', value: 'newest' },
]

const Filters = ({ category, setCategory, priceRange, setPriceRange, sortBy, setSortBy }) => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    productService.getCategories().then((cats) => {
      const top = cats.slice(0, 10)
      setCategories(top)
    }).catch(() => {})
  }, [])

  return (
    <aside className="filters-panel">
      <div className="filters-header">
        <FiFilter size={16} />
        <span>Filters & Sort</span>
      </div>

      {/* Category */}
      <div className="filter-section">
        <h4 className="filter-title">Category</h4>
        <div className="filter-options">
          <button
            className={`filter-pill ${category === 'all' ? 'active' : ''}`}
            onClick={() => setCategory('all')}
            id="filter-cat-all"
          >
            All Products
          </button>
          {categories.map((cat) => {
            const slug = cat.slug || cat
            return (
              <button
                key={slug}
                className={`filter-pill ${category === slug ? 'active' : ''}`}
                onClick={() => setCategory(slug)}
                id={`filter-cat-${slug}`}
              >
                {getCategoryLabel(slug)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <h4 className="filter-title">Price Range</h4>
        <div className="filter-options">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.value}
              className={`filter-pill ${priceRange === range.value ? 'active' : ''}`}
              onClick={() => setPriceRange(range.value)}
              id={`filter-price-${range.value}`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="filter-section">
        <h4 className="filter-title">Sort By</h4>
        <div className="sort-select-wrap">
          <select
            className="select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            id="sort-select"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FiChevronDown className="select-icon" size={16} />
        </div>
      </div>
    </aside>
  )
}

export default Filters
