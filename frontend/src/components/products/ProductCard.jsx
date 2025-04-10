
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ProductCard = ({ product }) => {
  const { addToCart, cart, updateQuantity } = useCart();
  
  const isInCart = cart.find(item => item.id === product.id);
  const quantity = isInCart ? isInCart.quantity : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleIncreaseQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecreaseQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantity - 1);
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="product-card h-full flex flex-col">
        <div className="relative">
          {product.discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-supermart-secondary text-black">
              {product.discount}% OFF
            </Badge>
          )}
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-48 object-cover object-center"
          />
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-medium line-clamp-2">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
            <div className="flex items-center mb-3">
              <span className="text-lg font-bold text-supermart-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through ml-2">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          
          {isInCart ? (
            <div className="flex items-center justify-between mt-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleDecreaseQuantity} 
                className="h-8 w-8"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-2 font-medium">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleIncreaseQuantity} 
                className="h-8 w-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleAddToCart} 
              className="w-full bg-supermart-primary hover:bg-supermart-dark"
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
