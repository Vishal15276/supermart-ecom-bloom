
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  Package,
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Layout,
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [summary, setSummary] = useState({
    totalSales: 0,
    newOrders: 0,
    totalCustomers: 0,
    lowStock: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setSummary({
          totalSales: 12489.56,
          newOrders: 24,
          totalCustomers: 538,
          lowStock: 5
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

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
                  <Link to="/admin" className="flex items-center px-3 py-2 rounded-md bg-supermart-light text-supermart-primary">
                    <Layout className="h-5 w-5 mr-3" />
                    Dashboard
                  </Link>
                  <Link to="/admin/products" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
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
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Sales */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
                  ) : (
                    `$${summary.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1 text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" /> 
                  <span>+12.5% from last month</span>
                </p>
              </CardContent>
            </Card>
            
            {/* New Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">New Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-12"></div>
                  ) : (
                    summary.newOrders
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1 text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" /> 
                  <span>+18.2% from last month</span>
                </p>
              </CardContent>
            </Card>
            
            {/* Total Customers */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                  ) : (
                    summary.totalCustomers
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1 text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" /> 
                  <span>+5.3% from last month</span>
                </p>
              </CardContent>
            </Card>
            
            {/* Low Stock Items */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <Package className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
                  ) : (
                    summary.lowStock
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1 text-red-600">
                  <TrendingDown className="h-3 w-3 mr-1" /> 
                  <span>Action needed</span>
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts and Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Overview Chart */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Monthly sales performance</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-supermart-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-gray-300" />
                    <span className="ml-3 text-gray-400">Chart will display here</span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Popular Categories */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
                <CardDescription>Sales distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-supermart-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                    <PieChart className="h-16 w-16 text-gray-300" />
                    <span className="ml-3 text-gray-400">Chart will display here</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Overview of the latest orders</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin/orders">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-10 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="bg-gray-50 p-3">
                    <div className="grid grid-cols-5 font-medium text-sm">
                      <div>Order ID</div>
                      <div>Customer</div>
                      <div>Date</div>
                      <div>Status</div>
                      <div>Total</div>
                    </div>
                  </div>
                  <div className="divide-y">
                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>#ORD-001</div>
                      <div>John Doe</div>
                      <div>Apr 5, 2025</div>
                      <div><span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Processing</span></div>
                      <div>$78.45</div>
                    </div>
                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>#ORD-002</div>
                      <div>Jane Smith</div>
                      <div>Apr 5, 2025</div>
                      <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Delivered</span></div>
                      <div>$132.99</div>
                    </div>
                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>#ORD-003</div>
                      <div>Robert Johnson</div>
                      <div>Apr 4, 2025</div>
                      <div><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Shipped</span></div>
                      <div>$45.20</div>
                    </div>
                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>#ORD-004</div>
                      <div>Emily Davis</div>
                      <div>Apr 4, 2025</div>
                      <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Delivered</span></div>
                      <div>$96.75</div>
                    </div>
                    <div className="grid grid-cols-5 p-3 text-sm">
                      <div>#ORD-005</div>
                      <div>Michael Wilson</div>
                      <div>Apr 3, 2025</div>
                      <div><span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Canceled</span></div>
                      <div>$55.30</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
