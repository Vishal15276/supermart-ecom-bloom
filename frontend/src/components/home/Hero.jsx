
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative bg-supermart-light py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Fresh Groceries <br />
              <span className="text-supermart-primary">Delivered to Your Door</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg mx-auto md:mx-0">
              Shop from our wide selection of fresh fruits, vegetables, dairy, and bakery items. 
              Get same-day delivery when you order before 2PM!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button className="bg-supermart-primary hover:bg-supermart-dark text-white px-8 py-6 text-lg" asChild>
                <Link to="/?category=all">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" className="px-8 py-6 text-lg border-supermart-primary text-supermart-primary hover:bg-supermart-light" asChild>
                <Link to="/?category=deals">
                  View Deals
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
              alt="Fresh groceries" 
              className="rounded-lg shadow-xl w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
