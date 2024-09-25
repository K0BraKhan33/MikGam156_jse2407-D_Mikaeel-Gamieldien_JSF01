export default function Pagination({ page, handlePageChange, productsLength, limit }) {
  const totalPages = Math.ceil(productsLength / limit); // Calculate total pages

  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 bg-gray-200 text-gray-600 rounded"
      >
        Previous
      </button>
      <span className="self-center">Page {page} of {totalPages}</span>
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-4 py-2 bg-gray-200 text-gray-600 rounded"
      >
        Next
      </button>
    </div>
  );
}
