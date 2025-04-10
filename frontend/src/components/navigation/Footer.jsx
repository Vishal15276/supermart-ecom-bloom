
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">SuperMart</h3>
            <p className="text-gray-300 mb-4">Your one-stop shop for fresh groceries and quality products delivered to your doorstep.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-white transition-colors">Cart</Link>
              </li>
              <li>
                <Link to="/?category=fruits" className="text-gray-300 hover:text-white transition-colors">Fruits</Link>
              </li>
              <li>
                <Link to="/?category=vegetables" className="text-gray-300 hover:text-white transition-colors">Vegetables</Link>
              </li>
              <li>
                <Link to="/?category=dairy" className="text-gray-300 hover:text-white transition-colors">Dairy</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Shipping Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Returns & Refunds</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms & Conditions</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-supermart-primary shrink-0" />
                <span className="text-gray-300">123 Grocery Lane, Fresh City, FC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-supermart-primary" />
                <span className="text-gray-300">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-supermart-primary" />
                <span className="text-gray-300">support@supermart.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6">
          <p className="text-center text-gray-400">
            &copy; {currentYear} SuperMart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
