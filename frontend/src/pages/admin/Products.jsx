
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Package,
  Users,
  ShoppingCart,
  Layout,
  Settings,
  LogOut,
  PlusCircle,
  Edit,
  Trash2,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AdminProducts = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  
  useEffect(() => {
    // Simulate API call to fetch products
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockProducts = [
          { id: 1, name: "Organic Apples", category: "fruits", price: 3.99, stock: 45, image: "/placeholder.svg" },
          { id: 2, name: "Fresh Bananas", category: "fruits", price: 1.99, stock: 78, image: "/placeholder.svg" },
          { id: 3, name: "Carrots Bundle", category: "vegetables", price: 2.49, stock: 32, image: "/placeholder.svg" },
          { id: 4, name: "Organic Spinach", category: "vegetables", price: 3.29, stock: 15, image: "/placeholder.svg" },
          { id: 5, name: "Whole Milk", category: "dairy", price: 4.99, stock: 25, image: "/placeholder.svg" },
          { id: 6, name: "Cheddar Cheese", category: "dairy", price: 6.99, stock: 18, image: "/placeholder.svg" },
          { id: 7, name: "Sourdough Bread", category: "bakery", price: 5.49, stock: 12, image: "/placeholder.svg" },
          { id: 8, name: "Chocolate Muffins", category: "bakery", price: 4.99, stock: 20, image: "/placeholder.svg" },
          { id: 9, name: "Strawberries", category: "fruits", price: 4.99, stock: 8, image: "/placeholder.svg" },
          { id: 10, name: "Blueberries", category: "fruits", price: 5.99, stock: 14, image: "/placeholder.svg" },
          { id: 11, name: "Broccoli", category: "vegetables", price: 2.99, stock: 22, image: "/placeholder.svg" },
          { id: 12, name: "Bell Peppers", category: "vegetables", price: 3.49, stock: 19, image: "/placeholder.svg" },
        ];
        
        setProducts(mockProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [toast]);

  const handleDeleteProduct = (id) => {
    // In a real app, this would call an API to delete the product
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Product deleted",
      description: "The product has been successfully removed.",
    });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="sticky top-24">
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Admin Panel</h2>
              </div>
              <div className="p-2">
                <nav className="space-y-1">
                  <Link to="/admin" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
                    <Layout className="h-5 w-5 mr-3" />
                    Dashboard
                  </Link>
                  <Link to="/admin/products" className="flex items-center px-3 py-2 rounded-md bg-supermart-light text-supermart-primary">
                    <Package className="h-5 w-5 mr-3" />
                    Products
                  </Link>
                  <Link to="/admin/orders" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
                    <ShoppingCart className="h-5 w-5 mr-3" />
                    Orders
                  </Link>
                  <a href="#" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
                    <Users className="h-5 w-5 mr-3" />
                    Customers
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                  </a>
                </nav>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <Link to="/" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
                <Package className="h-5 w-5 mr-3" />
                View Store
              </Link>
              <button 
                onClick={logout} 
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-red-600 w-full text-left"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Products</h1>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
          
          {/* Search & Filters */}
          <div className="mb-6">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 text-left">
                        <tr>
                          <th className="p-3">Image</th>
                          <th className="p-3">Product Name</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Stock</th>
                          <th className="p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {currentProducts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center p-4">
                              No products found matching your search.
                            </td>
                          </tr>
                        ) : (
                          currentProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="p-3">
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="h-12 w-12 object-cover rounded"
                                />
                              </td>
                              <td className="p-3 font-medium">{product.name}</td>
                              <td className="p-3 capitalize">{product.category}</td>
                              <td className="p-3">${product.price.toFixed(2)}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  product.stock > 20 
                                    ? 'bg-green-100 text-green-800' 
                                    : product.stock > 10 
                                      ? 'bg-yellow-100 text-yellow-800' 
                                      : 'bg-red-100 text-red-800'
                                }`}>
                                  {product.stock}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteProduct(product.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {filteredProducts.length > productsPerPage && (
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-sm text-gray-500">
                        Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          Previous
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        ))}
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
