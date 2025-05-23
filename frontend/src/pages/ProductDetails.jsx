import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Fetch product by ID
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        const productData = response.data;
        setProduct(productData);

        // ✅ Fetch related products based on category
        const relatedRes = await axios.get(
          `http://localhost:3000/products/related/${id}?category=${productData.category}`
        );
        setRelatedProducts(relatedRes.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {product && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <img
            src={`http://localhost:3000/uploads/${product.image}`}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder.jpg"; // fallback image
            }}
          />
          <div>
            <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
            <p className="text-gray-700 mb-2">Category: {product.category}</p>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-xl font-semibold mb-2">Price: ₹{product.price}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
          </div>
        </div>
      )}

      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-4">Related Products</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((related) => (
            <Link
              key={related._id}
              to={`/product/${related._id}`}
              className="border p-4 rounded-lg hover:shadow-md transition"
            >
              <img
                src={`http://localhost:3000/uploads/${related.image}`}
                alt={related.name}
                className="w-full h-40 object-cover mb-2 rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder.jpg";
                }}
              />
              <h4 className="text-lg font-semibold">{related.name}</h4>
              <p className="text-sm text-gray-600">₹{related.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
