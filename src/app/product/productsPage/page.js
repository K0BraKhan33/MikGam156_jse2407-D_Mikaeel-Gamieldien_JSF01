'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
export default function ProductsPage({ searchParams }) {
  // State variables to manage product data, categories, pagination, etc.
  const [products, setProducts] = useState([]);
  const [allSearchResults, setAllSearchResults] = useState([]); // Store all search results for pagination
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || ''); // Default to empty if no category
  const [searchInput, setSearchInput] = useState(searchParams.search || ''); // Input field for search
  const [searchTerm, setSearchTerm] = useState(searchParams.search || ''); // Actual search term
  const [sortOrder, setSortOrder] = useState(searchParams.sortBy || ''); // Default to no sorting
  const [sortDirection, setSortDirection] = useState(searchParams.order || ''); // Default to no sorting
  const [page, setPage] = useState(searchParams.page ? parseInt(searchParams.page, 10) : 1); // Default to page 1
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageIndex, setImageIndex] = useState({}); // Store the current image index for each product
  const limit = 20; // Limit products per page to 20
  const router = useRouter();

  // Fetch categories from the API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('https://next-ecommerce-api.vercel.app/categories');
        if (!res.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await res.json();
        const uniqueCategories = [...new Set(data)];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }

    fetchCategories();
  }, []);

  // Fetch products based on category, search term, sort order, and page
  const fetchProducts = async (category = selectedCategory, search = searchTerm, sortBy = sortOrder, order = sortDirection, pageNum = page) => {
    setLoading(true);
    setError(null);
    try {
      let apiUrl = 'https://next-ecommerce-api.vercel.app/products?';
      const params = new URLSearchParams();

      if (search) {
        params.append('search', search);
        // When searching, fetch all results to handle sorting and pagination client-side
        params.append('limit', '3000');
      } else {
        params.append('limit', limit);
        params.append('skip', (pageNum - 1) * limit); // Pagination
      }
      if (category) {
        params.append('category', category);
      }
      if (sortBy) {
        params.append('sortBy', sortBy);
        if (order) { // Only add order if sortBy is present
          params.append('order', order);
        }
      }

      apiUrl += params.toString();

      const res = await fetch(apiUrl);
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await res.json();

      if (search) {
        // Handle sorting and pagination client-side for search results
        const sortedData = data.sort((a, b) => {
          if (sortBy === 'price') {
            return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
          }
          if (sortBy === 'rating') {
            return sortDirection === 'asc' ? a.rating - b.rating : b.rating - a.rating;
          }
          return 0; // Default case if no sorting criteria matches
        });

        const start = (pageNum - 1) * limit;
        const end = start + limit;
        setProducts(sortedData.slice(start, end));
        setAllSearchResults(sortedData); // Store all search results
      } else {
        setProducts(data);
        setAllSearchResults([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to build URL query string
  const buildQueryString = (params) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.order) query.append('order', params.order);
    query.append('page', params.page);
    return query.toString();
  };

  // Handle search when the Search button is clicked or Enter is pressed
  const handleSearch = () => {
    setSearchTerm(searchInput); // Set the search term to the current input
    const queryString = buildQueryString({
      category: selectedCategory,
      search: searchInput,
      sortBy: sortOrder,
      order: sortDirection,
      page: 1
    });
    router.push(`/product/productsPage?${queryString}`);
    fetchProducts(selectedCategory, searchInput, sortOrder, sortDirection, 1);
    setPage(1);
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const queryString = buildQueryString({
      category,
      search: searchTerm,
      sortBy: sortOrder,
      order: sortDirection,
      page: 1
    });
    router.push(`/product/productsPage?${queryString}`);
    fetchProducts(category, searchTerm, sortOrder, sortDirection, 1);
    setPage(1);
  };

  // Handle sorting order change
  const handleSortChange = (e) => {
    const [sortBy, order] = e.target.value.split(':');
    setSortOrder(sortBy);
    setSortDirection(order === 'asc' ? 'asc' : 'desc'); // Ensure order is 'asc' or 'desc'
    const queryString = buildQueryString({
      category: selectedCategory,
      search: searchTerm,
      sortBy,
      order,
      page: 1
    });
    router.push(`/product/productsPage?${queryString}`);
    fetchProducts(selectedCategory, searchTerm, sortBy, order, 1);
    setPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    const queryString = buildQueryString({
      category: selectedCategory,
      search: searchTerm,
      sortBy: sortOrder,
      order: sortDirection,
      page: newPage
    });
    router.push(`/product/productsPage?${queryString}`);
    fetchProducts(selectedCategory, searchTerm, sortOrder, sortDirection, newPage);
  };

  // Trigger search on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Fetch products whenever category, search term, or page changes
  useEffect(() => {
    fetchProducts(selectedCategory, searchTerm, sortOrder, sortDirection, page);
  }, [selectedCategory, searchTerm, sortOrder, sortDirection, page]);

  useEffect(() => {
    // Initialize the filters and sorting options based on URL parameters on initial load
    setSelectedCategory(searchParams.category || '');
    setSearchInput(searchParams.search || '');
    setSearchTerm(searchParams.search || '');
    setSortOrder(searchParams.sortBy || '');
    setSortDirection(searchParams.order || '');
    setPage(searchParams.page ? parseInt(searchParams.page, 10) : 1);
  }, [searchParams]);

  const handleImageChange = (productId, direction) => {
    setImageIndex((prevIndex) => {
      const currentIndex = prevIndex[productId] || 0;
      const imagesCount = products.find((product) => product.id === productId)?.images.length || 0;
      const newIndex = direction === 'prev' 
        ? (currentIndex - 1 + imagesCount) % imagesCount 
        : (currentIndex + 1) % imagesCount;
      return { ...prevIndex, [productId]: newIndex };
    });
  };
//go back if items arent found
  const handleGoBack = () => {
    router.back();
   };
 
 
 //error if hadaling
   if (loading) {
     return <div className="text-center">Loading...</div>;
   }
 
   if (error) {
     return (
       <div className="text-center text-red-500">
         {error}
         <div className="mt-4">
 
           <button onClick={handleGoBack} className="ml-2 px-4 py-2 bg-gray-500 text-white rounded">Go Back</button>
 
         </div>
       </div>
     )}

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Category dropdown */}
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

        {/* Sort by dropdown */}
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

        {/* Search bar */}
        <div className="w-full md:w-1/3">
          <div className="flex">
            <input
              type="text"
              value={searchInput} // Use searchInput for the input field
              onChange={(e) => setSearchInput(e.target.value)} // Update searchInput on change
              onKeyDown={handleKeyDown} // Trigger search on Enter key press
              placeholder="Search by product title..."
              className="w-full p-2 border rounded text-black"
            />
            <button
              onClick={handleSearch} // Trigger search on button click
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Product list or No items found message */}
      {products.length === 0 ? (
        <div className="text-center text-xl text-gray-500">
          No items found for: {searchTerm}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded shadow-sm">
              
              
                <div className="relative">
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => handleImageChange(product.id, 'prev')}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded"
                      >
                        &lt;
                      </button>
                      <button
                        onClick={() => handleImageChange(product.id, 'next')}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded"
                      >
                        &gt;
                      </button>
                    </>
                  )}
                  <Link
                href={`/product/productsPage/${product.id}?${buildQueryString({
                  category: selectedCategory,
                  search: searchTerm,
                  sortBy: sortOrder,
                  order: sortDirection,
                  page
                })}`}>
                  <img
                    src={product.images[imageIndex[product.id] || 0]}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded"
                  />
                     </Link>
                </div>
                <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
           
              <p className="text-sm text-gray-500">Category: {product.category}</p>
              <div className="flex flex-wrap mt-2">
                {product.tags.map((tag) => (
                  <p key={tag} className="mr-2 mb-1 bg-gray-200 px-2 py-1 rounded text-sm text-gray-600">{tag}</p>
                ))}
              </div>
              <p className="mt-2 font-bold">${product.price.toFixed(2)}</p>
              <p className="mt-1 text-gray-500">Rating: {product.rating}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 text-gray-600 rounded"
        >
          Previous
        </button>
        <span className="self-center">Page {page}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={products.length < limit}
          className="px-4 py-2 bg-gray-200 text-gray-600 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
