import './SearchBar.css'

/**
 * SearchBar — Reusable search input component.
 * Used in Resource list page for keyword filtering.
 */
export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="searchbar-wrapper">
      <span className="searchbar-icon">🔍</span>
      <input
        id="resource-search-input"
        type="text"
        className="searchbar-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button className="searchbar-clear" onClick={() => onChange('')} title="Clear">
          ✕
        </button>
      )}
    </div>
  )
}
