
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getMockProducts, getMockCategories, getMockFeaturedProducts } from "@/lib/api";
import Hero from "@/components/home/Hero";
import CategoryCard from "@/components/home/CategoryCard";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Grid3X3, Menu } from "lucide-react";

const Home = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gridView, setGridView] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesData = await getMockCategories();
        setCategories(categoriesData);
        
        // Fetch products based on category or search query
        if (categoryParam && categoryParam !== 'all') {
          const productsData = await getMockProducts(categoryParam);
          setProducts(productsData);
        } else if (searchQuery) {
          const allProducts = await getMockProducts();
          const filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setProducts(filteredProducts);
        } else {
          // Default: show all products
          const productsData = await getMockProducts();
          setProducts(productsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryParam, searchQuery]);

  // Determine what to display in the title
  const getDisplayTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    
    if (categoryParam) {
      const category = categories.find(c => c.slug === categoryParam);
      return category ? category.name : 'All Products';
    }
    
    return 'All Products';
  };

  return (
    <div>
      {/* Show hero only on homepage without filters */}
      {!categoryParam && !searchQuery && (
        <>
          <Hero />
          
          {/* Categories Section */}
          <div className="container mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
          
          {/* Featured Products */}
          <FeaturedProducts title="Featured Products" />
        </>
      )}
      
      {/* Product Listing */}
      {(categoryParam || searchQuery) && (
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">{getDisplayTitle()}</h1>
              <p className="text-gray-500 mt-1">
                {loading ? "Loading products..." : `${products.length} products found`}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Button
                variant={gridView ? "default" : "outline"}
                size="sm"
                onClick={() => setGridView(true)}
              >
                <Grid3X3 className="h-4 w-4 mr-2" /> Grid
              </Button>
              <Button
                variant={!gridView ? "default" : "outline"}
                size="sm"
                onClick={() => setGridView(false)}
              >
                <Menu className="h-4 w-4 mr-2" /> List
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
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
          ) : (
            <>
              {products.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                  <Button onClick={() => window.history.back()}>Go Back</Button>
                </div>
              ) : (
                <div className={gridView 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                  : "flex flex-col space-y-4"
                }>
                  {products.map((product) => (
                    <div key={product.id}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      {/* New Arrivals Section */}
      {!categoryParam && !searchQuery && (
        <FeaturedProducts title="New Arrivals" />
      )}
    </div>
  );
};

export default Home;
