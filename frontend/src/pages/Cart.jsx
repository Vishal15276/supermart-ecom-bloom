            // src/pages/Cart.jsx
            import { useState } from "react";
            import { Link, useNavigate } from "react-router-dom";
            import { useCart } from "@/context/CartContext";
            import { useAuth } from "@/context/AuthContext";
            import { Button } from "@/components/ui/button";
            import { Input } from "@/components/ui/input";
            import {
              ShoppingCart, Trash2, Plus, Minus, ArrowRight, Clipboard, ChevronLeft
            } from "lucide-react";

            const Cart = () => {
              const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
              const { isAuthenticated } = useAuth();
              const navigate = useNavigate();

              const [couponCode, setCouponCode] = useState("");
              const [appliedDiscount, setAppliedDiscount] = useState(0);
              const [couponError, setCouponError] = useState("");

              const subtotal = total;
              const shipping = subtotal > 50 ? 0 : 5.99;
              const tax = (subtotal * 0.07).toFixed(2);
              const finalTotal = (parseFloat(subtotal) + parseFloat(shipping) + parseFloat(tax) - appliedDiscount).toFixed(2);

              const handleApplyCoupon = () => {
                if (couponCode.toLowerCase() === "discount10") {
                  const discount = (subtotal * 0.1).toFixed(2);
                  setAppliedDiscount(parseFloat(discount));
                  setCouponError("");
                } else if (couponCode.toLowerCase() === "freeship") {
                  setAppliedDiscount(shipping);
                  setCouponError("");
                } else {
                  setAppliedDiscount(0);
                  setCouponError("Invalid coupon code");
                }
              };

              const handleCheckout = () => {
                if (isAuthenticated) {
                  navigate("/checkout", {
                    state: {
                      cart,
                      total: finalTotal,
                      shipping,
                      tax,
                      discount: appliedDiscount
                    }
                  });
                } else {
                  navigate("/login", { state: { from: "/checkout" } });
                }
              };

              return (
                <div className="container mx-auto px-4 py-10">
                  <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
                  {cart.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-lg">
                      <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                      <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
                      <Button asChild>
                        <Link to="/"><ChevronLeft className="mr-2 h-4 w-4" /> Continue Shopping</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col lg:flex-row gap-10">
                      <div className="lg:w-2/3">
                        <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-gray-100 rounded-t-lg font-medium">
                          <div className="col-span-3">Product</div>
                          <div className="text-center">Price</div>
                          <div className="text-center">Quantity</div>
                          <div className="text-center">Total</div>
                        </div>
                        <div className="bg-white rounded-b-lg shadow-sm divide-y">
                          {cart.map((item) => (
                            <div key={item.id} className="p-4 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                              <div className="col-span-1 md:col-span-3 flex items-center space-x-4">
                                <Link to={`/product/${item.id}`}><img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" /></Link>
                                <div>
                                  <Link to={`/product/${item.id}`} className="font-medium hover:text-supermart-primary">{item.name}</Link>
                                  <p className="text-sm text-gray-500">{item.category}</p>
                                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm flex items-center mt-1 md:hidden">
                                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                                  </button>
                                </div>
                              </div>
                              <div className="md:text-center">${item.price.toFixed(2)}</div>
                              <div className="md:text-center">
                                <div className="flex items-center md:justify-center">
                                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-8 w-8 rounded-full">
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="mx-3">{item.quantity}</span>
                                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8 rounded-full">
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="md:text-center">
                                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hidden md:block md:mt-2">
                                  <Trash2 className="h-4 w-4 mx-auto" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <div className="p-4 flex justify-between">
                            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={clearCart}>
                              <Trash2 className="h-4 w-4 mr-2" /> Clear Cart
                            </Button>
                            <Button asChild variant="outline">
                              <Link to="/"><ChevronLeft className="h-4 w-4 mr-2" /> Continue Shopping</Link>
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                          <div className="space-y-3 mb-6">
                            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
                            <div className="flex justify-between"><span>Tax (7%)</span><span>${tax}</span></div>
                            {appliedDiscount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${appliedDiscount.toFixed(2)}</span></div>}
                            <div className="border-t pt-3 flex justify-between font-bold"><span>Total</span><span>${finalTotal}</span></div>
                          </div>
                          <label className="font-medium mb-2 block">Apply Coupon Code</label>
                          <div className="flex space-x-2 mb-2">
                            <Input type="text" placeholder="Enter code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                            <Button variant="outline" onClick={handleApplyCoupon}>Apply</Button>
                          </div>
                          {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
                          <div className="text-xs text-gray-500 mt-2">
                            <p>Try:</p>
                            <p><span className="bg-gray-100 px-2 py-1 rounded mr-2">DISCOUNT10</span>10% off</p>
                            <p><span className="bg-gray-100 px-2 py-1 rounded mr-2">FREESHIP</span>Free shipping</p>
                          </div>
                          <Button className="w-full bg-supermart-primary hover:bg-supermart-dark mt-6" onClick={handleCheckout}>
                            Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                          <div className="mt-4 text-sm text-gray-500 flex items-center justify-center">
                            <Clipboard className="h-4 w-4 mr-2" />
                            <span>Secure checkout powered by Stripe</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            };

            export default Cart;
