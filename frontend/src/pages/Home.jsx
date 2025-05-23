import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import Hero from "@/components/home/Hero";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Grid3X3, Menu } from "lucide-react";

const Home = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gridView, setGridView] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let res = await axios.get("http://localhost:3000/api/products");
        let allProducts = res.data;

        // Filter by category
        if (categoryParam && categoryParam !== "all") {
          allProducts = allProducts.filter(
            (p) => p.category.toLowerCase() === categoryParam.toLowerCase()
          );
        }

        // Filter by search query
        if (searchQuery) {
          allProducts = allProducts.filter((p) =>
            [p.name, p.description, p.category]
              .some(field => field.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }

        // Attach full image URL to each product
        allProducts = allProducts.map(p => ({
          ...p,
          imageUrl: `http://localhost:3000/uploads/${p.image}`,
        }));

        setProducts(allProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, searchQuery]);

  const getTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (categoryParam && categoryParam !== "all")
      return categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
    return "All Products";
  };

  return (
    <div>
      {!categoryParam && !searchQuery && <Hero />}

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{getTitle()}</h1>
            <p className="text-gray-500 mt-1">
              {loading ? "Loading products..." : `${products.length} products found`}
            </p>
          </div>

          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant={gridView ? "default" : "outline"} size="sm" onClick={() => setGridView(true)}>
              <Grid3X3 className="h-4 w-4 mr-2" /> Grid
            </Button>
            <Button variant={!gridView ? "default" : "outline"} size="sm" onClick={() => setGridView(false)}>
              <Menu className="h-4 w-4 mr-2" /> List
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        ) : (
          <div
            className={
              gridView
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "flex flex-col space-y-4"
            }
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
