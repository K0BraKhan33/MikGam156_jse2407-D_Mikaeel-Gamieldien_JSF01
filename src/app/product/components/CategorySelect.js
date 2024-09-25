// CategorySelect.js
export default function CategorySelect({ categories, selectedCategory, handleCategoryChange }) {
  return (
    <div className="w-full md:w-1/3">
      <select
        value={selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="w-full p-2 border rounded text-black"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
