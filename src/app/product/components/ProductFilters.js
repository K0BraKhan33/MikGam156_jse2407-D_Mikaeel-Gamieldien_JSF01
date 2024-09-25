// ProductFilters.js
import CategorySelect from './CategorySelect';
import SearchBar from './SearchBar';

export default function ProductFilters({
  categories,
  selectedCategory,
  handleCategoryChange,
  searchInput,
  setSearchInput,
  handleSearch,
  handleKeyDown,
  sortOrder,
  sortDirection,
  handleSortChange,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <CategorySelect
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
      />
      
      <div className="w-full md:w-1/3">
        <select
          value={`${sortOrder}:${sortDirection}`}
          onChange={handleSortChange}
          className="w-full p-2 border rounded text-black"
        >
          <option value="">Sort By</option>
          <option value="price:asc">Price: Low to High</option>
          <option value="price:desc">Price: High to Low</option>
          <option value="rating:asc">Rating: Low to High</option>
          <option value="rating:desc">Rating: High to Low</option>
        </select>
      </div>

      <SearchBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
        handleKeyDown={handleKeyDown}
      />
    </div>
  );
}
