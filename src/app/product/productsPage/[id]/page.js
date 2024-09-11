'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductDetailsPage({ params }) {
  const { id } = params;
  const searchParams = useSearchParams();
  const router = useRouter();
  const prePage = searchParams.get('page') || '1'; // Get 'page' from query parameters, default to '1'
  const [product, setProduct] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageContainerRef = useRef(null);
  const autoScrollTimeout = useRef(null);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`https://next-ecommerce-api.vercel.app/products/${id}`);
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      setProduct(data);
    }
    fetchProduct();
  }, [id]);

  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  const handleBackClick = () => {
    const queryParams = {
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || '',
      sortBy: searchParams.get('sortBy') || '',
      order: searchParams.get('order') || '',
      page: prePage
    };
    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`/product/productsPage?${queryString}`);
  };

  const resetAutoScroll = () => {
    setUserInteracted(true);
    if (autoScrollTimeout.current) clearTimeout(autoScrollTimeout.current);
    autoScrollTimeout.current = setTimeout(() => {
      setUserInteracted(false);
    }, 3000);
  };

  useEffect(() => {
    if (!userInteracted && product?.images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex + 1 >= product.images.length ? 0 : prevIndex + 1
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [userInteracted, product]);

  useEffect(() => {
    if (product?.images?.length > 1 && imageContainerRef.current) {
      imageContainerRef.current.scrollLeft =
        currentImageIndex * imageContainerRef.current.offsetWidth;
    }
  }, [currentImageIndex, product]);

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
    resetAutoScroll();
  };

  if (!product) {
    return <div className="text-center text-red-500">Failed to load product details. Please try again later.</div>;
  }

  const {
    title,
    description,
    price,
    rating,
    stock,
    category,
    tags,
    brand,
    images
  } = product;

  return (
    <div className="container mx-auto p-4">
      <button onClick={handleBackClick} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Back to Products
      </button>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="gallery relative flex flex-col">
          {!imagesLoaded && (
            <div className="text-center text-blue-500">ProductID {id} found, please wait...</div>
          )}
          <div
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4"
            ref={imageContainerRef}
            onScroll={resetAutoScroll}
            onTouchStart={resetAutoScroll}
            onMouseDown={resetAutoScroll}
            style={{ width: '100%', height: '80vh' }}
          >
            {images?.map((img, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-full h-[full] relative snap-center"
              >
                <img
                  src={img}
                  alt={title}
                  className="w-full h-full object-cover rounded"
                  onLoad={handleImageLoad}
                  style={{
                    display: imagesLoaded ? 'block' : 'none',
                    maxHeight: '100%',
                  }}
                />
              </div>
            ))}
          </div>

          <div className="thumbnails flex space-x-2 mt-4 justify-center">
            {images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                className={`w-16 h-16 object-cover cursor-pointer rounded border-2 ${
                  currentImageIndex === idx ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => handleThumbnailClick(idx)}
              />
            ))}
          </div>
        </div>

        <div className="md:col-span-1 mt-4 md:mt-0">
          <p className="text-lg font-semibold">Brand: {brand}</p>
          <p className="text-lg font-semibold">Category: {category}</p>
          <p className="text-lg font-semibold">Price: ${price}</p>
          <p className="text-lg font-semibold">Rating: {rating} / 5</p>
          <p className="text-lg font-semibold">Stock: {stock} units available</p>
          <p className="text-lg mt-4">{description}</p>
          <p className="text-lg font-semibold mt-4">Tags: {tags?.join(', ')}</p>
        </div>
      </div>
    </div>
  );
}
