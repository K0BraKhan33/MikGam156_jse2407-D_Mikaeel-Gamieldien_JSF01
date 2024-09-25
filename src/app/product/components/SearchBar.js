// SearchBar.js
export default function SearchBar({ searchInput, setSearchInput, handleSearch, handleKeyDown }) {
  return (
    <div className="w-full md:w-1/3">
      <div className="flex">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by product title..."
          className="w-full p-2 border rounded text-black"
        />
        <button
          onClick={handleSearch}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>
    </div>
  );
}
