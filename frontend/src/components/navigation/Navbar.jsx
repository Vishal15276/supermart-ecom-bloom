
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, User, Menu, Search, LogOut, Package, Home, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { currentUser, logout, isAuthenticated, isAdmin } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-supermart-primary">Pooja SuperMart</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link font-medium">Home</Link>
            <Link to="/?category=fruits" className="nav-link font-medium">Fruits</Link>
            <Link to="/?category=vegetables" className="nav-link font-medium">Vegetables</Link>
            <Link to="/?category=dairy" className="nav-link font-medium">Dairy</Link>
            <Link to="/?category=bakery" className="nav-link font-medium">Bakery</Link>
          </nav>

          {/* Search Form - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-60 pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </form>

            {/* Cart Link */}
            <Link to="/cart" className="relative">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-supermart-secondary text-black rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{currentUser.name}</span>
                      <span className="text-xs text-muted-foreground">{currentUser.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile?tab=orders")}>
                    <Package className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-4">
            <Link to="/cart" className="relative">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-supermart-secondary text-black rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="outline" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t mt-3 animate-fade-in">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </form>
            
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="nav-link font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/?category=fruits" className="nav-link font-medium" onClick={() => setMobileMenuOpen(false)}>Fruits</Link>
              <Link to="/?category=vegetables" className="nav-link font-medium" onClick={() => setMobileMenuOpen(false)}>Vegetables</Link>
              <Link to="/?category=dairy" className="nav-link font-medium" onClick={() => setMobileMenuOpen(false)}>Dairy</Link>
              <Link to="/?category=bakery" className="nav-link font-medium" onClick={() => setMobileMenuOpen(false)}>Bakery</Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="nav-link font-medium" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
                  <Link to="/profile?tab=orders" className="nav-link font-medium" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
                  {isAdmin && (
                    <Link to="/admin" className="nav-link font-medium" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
                  )}
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="nav-link font-medium text-left">Logout</button>
                </>
              ) : (
                <Link to="/login" className="nav-link font-medium" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
