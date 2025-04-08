
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getMockUserOrders } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { User, Package, ShieldCheck, LogOut, Eye, Calendar, Clock, ExternalLink, Loader2 } from "lucide-react";

const UserProfile = () => {
  const { currentUser, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  
  const [activeTab, setActiveTab] = useState(tabParam || "profile");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await getMockUserOrders(currentUser?.id);
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser?.id]);
  
  // Update URL when tab changes
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);
  
  // Update active tab when URL changes
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call to update profile
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
      setIsSaving(false);
    }, 1000);
  };
  
  const handleLogout = () => {
    logout();
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <User className="h-10 w-10 text-gray-500" />
                </div>
                <h2 className="font-bold">{currentUser?.name}</h2>
                <p className="text-sm text-gray-500">{currentUser?.email}</p>
              </div>
              
              <ul className="space-y-1">
                <li>
                  <button
                    className={`w-full flex items-center p-2 rounded text-left ${
                      activeTab === 'profile' 
                        ? 'bg-supermart-light text-supermart-primary font-medium' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile Information
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center p-2 rounded text-left ${
                      activeTab === 'orders' 
                        ? 'bg-supermart-light text-supermart-primary font-medium' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('orders')}
                  >
                    <Package className="h-4 w-4 mr-3" />
                    Order History
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center p-2 rounded text-left ${
                      activeTab === 'security' 
                        ? 'bg-supermart-light text-supermart-primary font-medium' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('security')}
                  >
                    <ShieldCheck className="h-4 w-4 mr-3" />
                    Security
                  </button>
                </li>
              </ul>
              
              <div className="border-t mt-6 pt-6">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="hidden">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-0">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Profile Information</h2>
                  
                  <form onSubmit={handleProfileUpdate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={userInfo.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={userInfo.email}
                          onChange={handleInputChange}
                          disabled
                        />
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={userInfo.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <h3 className="font-bold mb-4">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={userInfo.address}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={userInfo.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={userInfo.state}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={userInfo.zipCode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="bg-supermart-primary hover:bg-supermart-dark"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                </div>
              </TabsContent>
              
              {/* Orders Tab */}
              <TabsContent value="orders" className="mt-0">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Order History</h2>
                  
                  {loading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {orders.length === 0 ? (
                        <div className="text-center py-10">
                          <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <h3 className="text-xl font-bold mb-2">No Orders Yet</h3>
                          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                          <Button asChild>
                            <a href="/">Start Shopping</a>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <div key={order.id} className="border rounded-lg p-4">
                              <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                                <div>
                                  <p className="font-bold">Order #{order.id}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                    <span className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      {formatDate(order.date)}
                                    </span>
                                    <span className="flex items-center">
                                      <Clock className="h-4 w-4 mr-1" />
                                      {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-3 md:mt-0 flex items-center">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-gray-600">Items</span>
                                  <span className="text-gray-600">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-gray-600">Total</span>
                                  <span className="font-bold">${order.total.toFixed(2)}</span>
                                </div>
                                <Button 
                                  asChild 
                                  variant="outline" 
                                  className="w-full mt-3"
                                >
                                  <a href={`/order-confirmation/${order.id}`}>
                                    View Order Details <ExternalLink className="h-4 w-4 ml-2" />
                                  </a>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security" className="mt-0">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold mb-3">Change Password</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type="password"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type="password"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">Password must be at least 8 characters long and include uppercase, lowercase, and numbers.</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type="password"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <Button>Update Password</Button>
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h3 className="font-bold mb-3">Account Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm text-gray-500">Permanently delete your account and all your data</p>
                          </div>
                          <Button variant="destructive">Delete Account</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
