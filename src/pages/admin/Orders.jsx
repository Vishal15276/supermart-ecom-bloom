
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
  Search,
  Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AdminOrders = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  
  useEffect(() => {
    // Simulate API call to fetch orders
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockOrders = [
          { 
            id: "ORD-001", 
            customerName: "John Doe", 
            email: "john@example.com",
            date: "2025-04-08T10:30:00", 
            total: 78.45, 
            status: "processing",
            items: 3 
          },
          { 
            id: "ORD-002", 
            customerName: "Jane Smith", 
            email: "jane@example.com",
            date: "2025-04-08T09:15:00", 
            total: 132.99, 
            status: "delivered",
            items: 5 
          },
          { 
            id: "ORD-003", 
            customerName: "Robert Johnson", 
            email: "robert@example.com",
            date: "2025-04-07T14:22:00", 
            total: 45.20, 
            status: "shipped",
            items: 2 
          },
          { 
            id: "ORD-004", 
            customerName: "Emily Davis", 
            email: "emily@example.com",
            date: "2025-04-07T11:05:00", 
            total: 96.75, 
            status: "delivered",
            items: 4 
          },
          { 
            id: "ORD-005", 
            customerName: "Michael Wilson", 
            email: "michael@example.com",
            date: "2025-04-06T16:43:00", 
            total: 55.30, 
            status: "canceled",
            items: 2 
          },
          { 
            id: "ORD-006", 
            customerName: "Sarah Brown", 
            email: "sarah@example.com",
            date: "2025-04-06T09:30:00", 
            total: 112.50, 
            status: "delivered",
            items: 6 
          },
          { 
            id: "ORD-007", 
            customerName: "David Miller", 
            email: "david@example.com",
            date: "2025-04-05T13:15:00", 
            total: 67.80, 
            status: "shipped",
            items: 3 
          },
          { 
            id: "ORD-008", 
            customerName: "Lisa Anderson", 
            email: "lisa@example.com",
            date: "2025-04-05T10:20:00", 
            total: 89.95, 
            status: "processing",
            items: 4 
          },
          { 
            id: "ORD-009", 
            customerName: "James Taylor", 
            email: "james@example.com",
            date: "2025-04-04T17:35:00", 
            total: 34.25, 
            status: "delivered",
            items: 2 
          },
          { 
            id: "ORD-010", 
            customerName: "Jennifer Garcia", 
            email: "jennifer@example.com",
            date: "2025-04-04T14:10:00", 
            total: 128.65, 
            status: "processing",
            items: 7 
          },
          { 
            id: "ORD-011", 
            customerName: "Daniel Martinez", 
            email: "daniel@example.com",
            date: "2025-04-03T11:45:00", 
            total: 76.30, 
            status: "shipped",
            items: 3 
          },
          { 
            id: "ORD-012", 
            customerName: "Jessica Robinson", 
            email: "jessica@example.com",
            date: "2025-04-03T09:05:00", 
            total: 52.45, 
            status: "delivered",
            items: 2 
          },
        ];
        
        setOrders(mockOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to load orders data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [toast]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + 
      ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Get status badge style
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
                  <Link to="/admin/products" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
                    <Package className="h-5 w-5 mr-3" />
                    Products
                  </Link>
                  <Link to="/admin/orders" className="flex items-center px-3 py-2 rounded-md bg-supermart-light text-supermart-primary">
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
            <h1 className="text-3xl font-bold">Orders</h1>
          </div>
          
          {/* Search & Filters */}
          <div className="mb-6">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search by order ID, customer name or status..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
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
                          <th className="p-3">Order ID</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Items</th>
                          <th className="p-3">Total</th>
                          <th className="p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {currentOrders.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center p-4">
                              No orders found matching your search.
                            </td>
                          </tr>
                        ) : (
                          currentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="p-3 font-medium">{order.id}</td>
                              <td className="p-3">
                                <div>
                                  <div className="font-medium">{order.customerName}</div>
                                  <div className="text-xs text-gray-500">{order.email}</div>
                                </div>
                              </td>
                              <td className="p-3 text-sm">{formatDate(order.date)}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusBadgeStyle(order.status)}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="p-3">{order.items}</td>
                              <td className="p-3">${order.total.toFixed(2)}</td>
                              <td className="p-3">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {filteredOrders.length > ordersPerPage && (
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-sm text-gray-500">
                        Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
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

export default AdminOrders;
