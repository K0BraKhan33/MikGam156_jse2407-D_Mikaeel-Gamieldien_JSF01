'use client'; // Add this line if you use client-side hooks or state

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductDetailsPage({ params }) {
  const { id } = params;
  const searchParams = useSearchParams();
  const prePage = searchParams.get('page'); // Get 'page' from query parameters
  const [product, setProduct] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`https://book-connect-api.vercel.app/books/${id}`);
      if (!res.ok) {
        // Handle the error here
        return;
      }
      const data = await res.json();
      setProduct(data);
    }
    
    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="text-center text-red-500">Failed to load product details. Please try again later.</div>;
  }

  const {
    title,
    published,
    pages,
    popularity,
    description,
    authorName,
    image,
    genreNames
  } = product;

  const handleBackClick = () => {
    router.push(`/product/productsPage?page=${prePage || 1}`); // Navigate back with page number
  };

  return (
    <div className="container mx-auto p-4">
      <button onClick={handleBackClick} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Back to Products
      </button>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="gallery space-y-4">
          <img src={image} alt={title} className="w-auto h-[45vw] object-cover rounded" />
        </div>
        <div>
          <p className="text-lg font-semibold">Author: {authorName}</p>
          <p className="text-lg font-semibold">Published: {new Date(published).toLocaleDateString()}</p>
          <p className="text-lg font-semibold">Pages: {pages}</p>
          <p className="text-lg font-semibold">Popularity: {popularity}</p>
          <p className="text-lg mt-4">{description}</p>
          <p className="text-lg font-semibold mt-4">Genres: {genreNames.join(', ')}</p>
        </div>
      </div>
    </div>
  );
}
