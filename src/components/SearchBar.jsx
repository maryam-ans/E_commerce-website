import { FiSearch, FiX } from 'react-icons/fi'
import './SearchBar.css'

const SearchBar = ({ value, onChange, placeholder = 'Search products...' }) => {
  return (
    <div className="search-bar-container">
      <FiSearch className="searchbar-icon" size={18} />
      <input
        type="text"
        className="searchbar-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        id="product-search-input"
        aria-label="Search products"
      />
      {value && (
        <button
          className="searchbar-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  )
}

export default SearchBar
