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
                      className="w-full"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </form>
                </div>
              </TabsContent>
              
              {/* Orders Tab */}
              <TabsContent value="orders">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Order History</h2>
                  {loading ? (
                    <p>Loading orders...</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.length === 0 ? (
                        <div className="text-center text-gray-500">
                          No orders found. <Button variant="link" className="mt-4" onClick={() => setActiveTab('profile')}>Start Shopping</Button>
                        </div>
                      ) : (
                        orders.map(order => (
                          <div key={order.id} className="border-b pb-4 mb-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-bold">{order.title}</h3>
                              <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
                            </div>
                            <p className="text-sm text-gray-500">Ordered on {formatDate(order.date)}</p>
                            <p className="text-sm mt-2">Total: ${order.total}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Security Settings</h2>
                  {/* Password Section */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          placeholder="••••••••"
                        />
                        <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          placeholder="••••••••"
                        />
                        <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmNewPassword"
                          name="confirmNewPassword"
                          type="password"
                          placeholder="••••••••"
                        />
                        <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" />
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Update Password
                    </Button>
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
