
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { getMockProductById, getMockRelatedProducts } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Plus, 
  Minus, 
  ChevronLeft,
  Star,
  Check,
  ShieldCheck,
  Truck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/products/ProductCard";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart, cart, updateQuantity } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const cartItem = cart.find(item => item.id === id);
  const cartItemQuantity = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const productData = await getMockProductById(id);
        setProduct(productData);
        
        // Fetch related products
        const relatedData = await getMockRelatedProducts(id, productData.category);
        setRelatedProducts(relatedData);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setQuantity(1);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleUpdateCart = () => {
    if (product) {
      updateQuantity(product.id, quantity);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-gray-200 h-80 md:h-96 rounded-lg"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
              <div className="h-24 bg-gray-200 rounded mb-6"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button asChild>
            <Link to="/">
              <ChevronLeft className="h-4 w-4 mr-2" /> Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // No product found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you are looking for does not exist.</p>
          <Button asChild>
            <Link to="/">
              <ChevronLeft className="h-4 w-4 mr-2" /> Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-600 hover:text-supermart-primary">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link to={`/?category=${product.category}`} className="text-gray-600 hover:text-supermart-primary">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-80 md:h-96 object-contain p-4" 
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${i < Math.floor(product.rating) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">{product.rating} ({product.reviewCount} reviews)</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-supermart-primary">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through ml-3">
                ₹{product.originalPrice.toFixed(2)}
                </span>
                <Badge className="ml-3 bg-supermart-secondary text-black">
                  {product.discount}% OFF
                </Badge>
              </>
            )}
          </div>
          
          {/* Description */}
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          {/* Stock Status */}
          <div className="flex items-center mb-6">
            <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>
          
          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="flex items-center mb-6">
              <span className="mr-4 font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <button 
                  className="px-3 py-1 border-r"
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button 
                  className="px-3 py-1 border-l"
                  onClick={handleIncreaseQuantity}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          
          {/* Add to Cart Button */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 mb-6">
            {product.stock > 0 ? (
              <>
                {cartItemQuantity > 0 ? (
                  <Button 
                    className="w-full sm:w-auto bg-supermart-primary hover:bg-supermart-dark"
                    onClick={handleUpdateCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> Update Cart ({cartItemQuantity})
                  </Button>
                ) : (
                  <Button 
                    className="w-full sm:w-auto bg-supermart-primary hover:bg-supermart-dark"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                  </Button>
                )}
                <Button variant="outline" className="w-full sm:w-auto">
                  <Heart className="mr-2 h-5 w-5" /> Wishlist
                </Button>
              </>
            ) : (
              <Button disabled className="w-full">Out of Stock</Button>
            )}
          </div>
          
          {/* Product Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-supermart-primary mr-2" />
              <span>Fresh and high-quality products</span>
            </div>
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 text-supermart-primary mr-2" />
              <span>Secure payment</span>
            </div>
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-supermart-primary mr-2" />
              <span>Same-day delivery for orders before 2PM</span>
            </div>
          </div>
          
          {/* Share */}
          <div className="flex items-center">
            <span className="mr-3">Share:</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8 p-1">
                <Share2 className="h-4 w-4" />
              </Button>
              {/* Add other share buttons as needed */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="details">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-6 bg-white rounded-lg shadow-sm mt-4">
            <h3 className="text-xl font-bold mb-4">Product Details</h3>
            <p className="mb-4">{product.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-2">Features</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Premium quality {product.category}</li>
                  <li>Carefully selected by our experts</li>
                  <li>Fresh and delicious</li>
                  <li>Perfect for daily consumption</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">Specifications</h4>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="font-medium w-24">Category:</span>
                    <span>{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24">Origin:</span>
                    <span>Local Farm</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24">Packaging:</span>
                    <span>Eco-friendly</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24">Storage:</span>
                    <span>See product label</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="nutrition" className="p-6 bg-white rounded-lg shadow-sm mt-4">
            <h3 className="text-xl font-bold mb-4">Nutrition Information</h3>
            {product.nutrients && product.nutrients.length > 0 ? (
              <div>
                <p className="mb-4">This product is rich in the following nutrients:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {product.nutrients.map((nutrient, index) => (
                    <li key={index}>{nutrient}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Nutrition information is not available for this product.</p>
            )}
          </TabsContent>
          
          <TabsContent value="reviews" className="p-6 bg-white rounded-lg shadow-sm mt-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Customer Reviews</h3>
              <Button>Write a Review</Button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(product.rating) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">Based on {product.reviewCount} reviews</span>
              </div>
              <p className="text-gray-600">Customer photos and videos</p>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-500 italic">Reviews will appear here. This is a demo project, so no actual reviews are displayed.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
