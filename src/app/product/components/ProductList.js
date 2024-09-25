// Import Link from Next.js for client-side navigation
import Link from 'next/link';

/**
 * ProductList Component
 * @param {Object} props - The properties passed to the component
 * @param {Array} props.products - The list of products to display
 * @param {Object} props.imageIndex - An object that keeps track of the currently displayed image index for each product
 * @param {Function} props.handleImageChange - Function to handle changing images
 * @param {Function} props.buildQueryString - Function to build query strings for URLs
 * @param {String} props.selectedCategory - The currently selected product category
 * @param {String} props.searchTerm - The current search term
 * @param {String} props.sortOrder - The current sort order
 * @param {String} props.sortDirection - The current sort direction
 * @param {Number} props.page - The current page number
 * @returns JSX Element
 */
export default function ProductList({
  products,
  imageIndex,
  handleImageChange,
  buildQueryString,
  selectedCategory,
  searchTerm,
  sortOrder,
  sortDirection,
  page
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded shadow-sm">
          <div className="relative">
            {/* Image navigation buttons if the product has multiple images */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => handleImageChange(product.id, 'prev')}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded"
                >
                  &lt; {/* Previous Image Button */}
                </button>
                <button
                  onClick={() => handleImageChange(product.id, 'next')}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded"
                >
                  &gt; {/* Next Image Button */}
                </button>
              </>
            )}
            {/* Link to the product detail page with query parameters */}
            <Link
              href={`/product/productsPage/${product.id}?${buildQueryString({
                category: selectedCategory,
                search: searchTerm,
                sortBy: sortOrder,
                order: sortDirection,
                page,
              })}`}
            >
              <img
                src={product.images[imageIndex[product.id] || 0]} // Get the current image based on index
                alt={product.title}
                className="w-full h-48 object-cover rounded"
                loading="lazy" // Enable lazy loading for images
              />
            </Link>
          </div>
          <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
          <p className="text-sm text-gray-500">Category: {product.category}</p>
          <div className="flex flex-wrap mt-2">
            {/* Display tags associated with the product */}
            {product.tags.map((tag) => (
              <p key={tag} className="mr-2 mb-1 bg-gray-200 px-2 py-1 rounded text-sm text-gray-600">{tag}</p>
            ))}
          </div>
          <p className="mt-2 font-bold">${product.price.toFixed(2)}</p>
          <p className="mt-1 text-gray-500">Rating: {product.rating}</p>
        </div>
      ))}
    </div>
  );
}
