  import { Toaster } from "@/components/ui/toaster";
  import { Toaster as Sonner } from "@/components/ui/sonner";
  import { TooltipProvider } from "@/components/ui/tooltip";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import { CartProvider } from "@/context/CartContext";
  import { AuthProvider } from "@/context/AuthContext";
  import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider

  // Layout
  import MainLayout from "@/layouts/MainLayout";

  // Pages
  import Home from "@/pages/Home";
  import ProductDetails from "@/pages/ProductDetails";
  import Cart from "@/pages/Cart";
  import Checkout from "@/pages/Checkout";
  import OrderConfirmation from "@/pages/OrderConfirmation";
  import Login from "@/pages/Login";
  import Register from "@/pages/Register";
  import UserProfile from "@/pages/UserProfile";
  import AdminDashboard from "@/pages/admin/Dashboard";
  import AdminProducts from "@/pages/admin/Products";
  import AdminOrders from "@/pages/admin/Orders";
  import AddProduct from "@/pages/admin/AddProduct";
  import EditProduct from "@/pages/admin/EditProduct"; // Import EditProduct
  import NotFound from "@/pages/NotFound";

  // Auth wrapper
  import ProtectedRoute from "@/components/auth/ProtectedRoute";
  import AdminRoute from "@/components/auth/AdminRoute";
  import AuthCallback from "@/pages/AuthCallback"; // Import the callback page

  const queryClient = new QueryClient();

  const App = () => (
    <GoogleOAuthProvider clientId="572300442267-adsrva2pjodj7pun2kflqd1ni1fe9gne.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="product/:id" element={<ProductDetails />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="checkout" element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } />
                    <Route path="order-confirmation/:id" element={
                      <ProtectedRoute>
                        <OrderConfirmation />
                      </ProtectedRoute>
                    } />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="profile" element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    } />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } />
                  <Route path="/admin/products" element={
                    <AdminRoute>
                      <AdminProducts />
                    </AdminRoute>
                  } />
                  <Route path="/admin/products/add" element={
                    <AdminRoute>
                      <AddProduct />
                    </AdminRoute>
                  } />
                  <Route path="/admin/products/edit/:id" element={ // New route for editing product
                    <AdminRoute>
                      <EditProduct />
                    </AdminRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  } />

                  {/* Google OAuth Callback */}
                  <Route path="/auth/callback" element={<AuthCallback />} />

                  {/* 404 Not Found */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );

  export default App;
