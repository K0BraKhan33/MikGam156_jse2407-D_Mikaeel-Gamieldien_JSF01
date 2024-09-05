'use client'; // Add this line if you use client-side hooks or state

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProductsPage({ searchParams }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(searchParams.page ? parseInt(searchParams.page, 10) : 1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 20;
  const skip = (page - 1) * limit;
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://book-connect-api.vercel.app/books?limit=${limit}&skip=${skip}`);
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    router.push(`/product/productsPage?page=${newPage}`);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <Link href={`/product/productsPage/${product.id}?page=${page}`}>
              <img src={product.image} alt={product.title} className="h-48 w-full object-cover rounded mb-2" />
            </Link>
            <h3 className="text-xl font-semibold">{product.title}</h3>
            <p className="text-lg text-gray-700">{product.price}</p>
            <p className="flex overflow-x-auto text-sm text-gray-500">Product Topic</p>
            
            <div className="flex flex-wrap mt-2">
              {product.genreNames.map((genre) => (
                <p key={genre} className="mr-2 mb-1 bg-gray-200 px-2 py-1 rounded text-sm text-gray-600">{genre}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center mt-6 space-x-4">
        {page > 1 && (
          <button onClick={() => handlePageChange(page - 1)} className="bg-blue-500 text-white px-4 py-2 rounded">Previous</button>
        )}
        <span className="text-lg">Page {page}</span>
        <button onClick={() => handlePageChange(page + 1)} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
}
