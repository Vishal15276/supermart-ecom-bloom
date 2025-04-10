
import { useState, useEffect } from "react";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMockProducts } from "@/lib/api";

const FeaturedProducts = ({ title = "Featured Products", category = null }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // In a production app, this would be an API call
        const data = await getMockProducts(category);
        setProducts(data.slice(0, 8)); // Get first 8 products
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // Scroll functionality for product carousel
  const scrollLeft = () => {
    document.getElementById("featured-products-container").scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    document.getElementById("featured-products-container").scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="product-card animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded mt-6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="hidden md:flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={scrollLeft}
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={scrollRight}
            className="rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div 
        id="featured-products-container"
        className="flex overflow-x-auto gap-6 pb-4 md:grid md:grid-cols-4 md:overflow-x-visible hide-scrollbar"
      >
        {products.map((product) => (
          <div key={product.id} className="min-w-[250px] md:min-w-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
