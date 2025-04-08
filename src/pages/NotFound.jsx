
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-6">
          <span className="text-6xl font-bold text-supermart-primary">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="outline">
            <Link to="/">
              <ChevronLeft className="h-4 w-4 mr-2" /> Go to Homepage
            </Link>
          </Button>
          <Button asChild className="bg-supermart-primary hover:bg-supermart-dark">
            <Link to="/cart">
              <ShoppingCart className="h-4 w-4 mr-2" /> View Cart
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
