import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createMockOrder } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Loader2, CreditCard, Landmark, CircleDollarSign } from "lucide-react";

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: currentUser?.name?.split(" ")[0] || "",
    lastName: currentUser?.name?.split(" ")[1] || "",
    email: currentUser?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  });
  
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  });
  
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  
  const subtotal = total;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = (subtotal * 0.07).toFixed(2);
  const finalTotal = (parseFloat(subtotal) + parseFloat(shipping) + parseFloat(tax)).toFixed(2);
  
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCardInfoChange = (e) => {
    const { name, value } = e.target;
    setCardInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = () => {
    for (const [key, value] of Object.entries(shippingInfo)) {
      if (!value && key !== 'phone') {
        toast({
          variant: "destructive",
          title: "Missing shipping information",
          description: `Please enter your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
        });
        return false;
      }
    }
    
    if (!sameAsShipping) {
      for (const [key, value] of Object.entries(billingInfo)) {
        if (!value) {
          toast({
            variant: "destructive",
            title: "Missing billing information",
            description: `Please enter your billing ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          });
          return false;
        }
      }
    }
    
    if (paymentMethod === "credit-card") {
      for (const [key, value] of Object.entries(cardInfo)) {
        if (!value) {
          toast({
            variant: "destructive",
            title: "Missing payment information",
            description: `Please enter your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          });
          return false;
        }
      }
      
      if (cardInfo.cardNumber.replace(/\s/g, '').length !== 16) {
        toast({
          variant: "destructive",
          title: "Invalid card number",
          description: "Please enter a valid 16-digit card number",
        });
        return false;
      }
      
      if (cardInfo.cvv.length < 3) {
        toast({
          variant: "destructive",
          title: "Invalid CVV",
          description: "Please enter a valid CVV code",
        });
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const orderData = {
        items: cart,
        total: parseFloat(finalTotal),
        shippingAddress: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
        },
        billingAddress: sameAsShipping 
          ? {
              firstName: shippingInfo.firstName,
              lastName: shippingInfo.lastName,
              address: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              zipCode: shippingInfo.zipCode,
              country: shippingInfo.country,
            }
          : {
              firstName: billingInfo.firstName,
              lastName: billingInfo.lastName,
              address: billingInfo.address,
              city: billingInfo.city,
              state: billingInfo.state,
              zipCode: billingInfo.zipCode,
              country: billingInfo.country,
            },
        paymentMethod: paymentMethod,
        customer: {
          id: currentUser?.id,
          name: currentUser?.name,
          email: currentUser?.email,
        },
      };
      
      const response = await createMockOrder(orderData);
      
      if (response.success) {
        clearCart();
        navigate(`/order-confirmation/${response.order.id}`);
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmitOrder}>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="city">District *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select 
  value={shippingInfo.state} 
  onValueChange={(value) => setShippingInfo(prev => ({ ...prev, state: value }))}
>
  <SelectTrigger>
    <SelectValue placeholder="Select State" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
    <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
    <SelectItem value="Assam">Assam</SelectItem>
    <SelectItem value="Bihar">Bihar</SelectItem>
    <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
    <SelectItem value="Goa">Goa</SelectItem>
    <SelectItem value="Gujarat">Gujarat</SelectItem>
    <SelectItem value="Haryana">Haryana</SelectItem>
    <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
    <SelectItem value="Jharkhand">Jharkhand</SelectItem>
    <SelectItem value="Karnataka">Karnataka</SelectItem>
    <SelectItem value="Kerala">Kerala</SelectItem>
    <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
    <SelectItem value="Manipur">Manipur</SelectItem>
    <SelectItem value="Meghalaya">Meghalaya</SelectItem>
    <SelectItem value="Mizoram">Mizoram</SelectItem>
    <SelectItem value="Nagaland">Nagaland</SelectItem>
    <SelectItem value="Odisha">Odisha</SelectItem>
    <SelectItem value="Punjab">Punjab</SelectItem>
    <SelectItem value="Rajasthan">Rajasthan</SelectItem>
    <SelectItem value="Sikkim">Sikkim</SelectItem>
    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
    <SelectItem value="Telangana">Telangana</SelectItem>
    <SelectItem value="Tripura">Tripura</SelectItem>
    <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
    <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
    <SelectItem value="West Bengal">West Bengal</SelectItem>
    <SelectItem value="Delhi">Delhi</SelectItem>
    <SelectItem value="Jammu and Kashmir">Jammu and Kashmir</SelectItem>
    <SelectItem value="Ladakh">Ladakh</SelectItem>
  </SelectContent>
</Select>

                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code *</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
              </div>
              
              
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Billing Information</h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sameAsShipping"
                    checked={sameAsShipping}
                    onChange={() => setSameAsShipping(!sameAsShipping)}
                    className="rounded text-supermart-primary focus:ring-supermart-primary"
                  />
                  <Label htmlFor="sameAsShipping" className="cursor-pointer">
                    Same as shipping address
                  </Label>
                </div>
              </div>
              
              {!sameAsShipping && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingFirstName">First Name *</Label>
                      <Input
                        id="billingFirstName"
                        name="firstName"
                        value={billingInfo.firstName}
                        onChange={handleBillingChange}
                        required={!sameAsShipping}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingLastName">Last Name *</Label>
                      <Input
                        id="billingLastName"
                        name="lastName"
                        value={billingInfo.lastName}
                        onChange={handleBillingChange}
                        required={!sameAsShipping}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billingAddress">Address *</Label>
                    <Input
                      id="billingAddress"
                      name="address"
                      value={billingInfo.address}
                      onChange={handleBillingChange}
                      required={!sameAsShipping}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="billingCity">City *</Label>
                      <Input
                        id="billingCity"
                        name="city"
                        value={billingInfo.city}
                        onChange={handleBillingChange}
                        required={!sameAsShipping}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingState">State *</Label>
                      <Select 
  value={shippingInfo.state} 
  onValueChange={(value) => setShippingInfo(prev => ({ ...prev, state: value }))}
>
  <SelectTrigger>
    <SelectValue placeholder="Select State" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
    <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
    <SelectItem value="Assam">Assam</SelectItem>
    <SelectItem value="Bihar">Bihar</SelectItem>
    <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
    <SelectItem value="Goa">Goa</SelectItem>
    <SelectItem value="Gujarat">Gujarat</SelectItem>
    <SelectItem value="Haryana">Haryana</SelectItem>
    <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
    <SelectItem value="Jharkhand">Jharkhand</SelectItem>
    <SelectItem value="Karnataka">Karnataka</SelectItem>
    <SelectItem value="Kerala">Kerala</SelectItem>
    <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
    <SelectItem value="Manipur">Manipur</SelectItem>
    <SelectItem value="Meghalaya">Meghalaya</SelectItem>
    <SelectItem value="Mizoram">Mizoram</SelectItem>
    <SelectItem value="Nagaland">Nagaland</SelectItem>
    <SelectItem value="Odisha">Odisha</SelectItem>
    <SelectItem value="Punjab">Punjab</SelectItem>
    <SelectItem value="Rajasthan">Rajasthan</SelectItem>
    <SelectItem value="Sikkim">Sikkim</SelectItem>
    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
    <SelectItem value="Telangana">Telangana</SelectItem>
    <SelectItem value="Tripura">Tripura</SelectItem>
    <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
    <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
    <SelectItem value="West Bengal">West Bengal</SelectItem>
    <SelectItem value="Delhi">Delhi</SelectItem>
    <SelectItem value="Jammu and Kashmir">Jammu and Kashmir</SelectItem>
    <SelectItem value="Ladakh">Ladakh</SelectItem>
  </SelectContent>
</Select>

                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingZipCode">Zip Code *</Label>
                      <Input
                        id="billingZipCode"
                        name="zipCode"
                        value={billingInfo.zipCode}
                        onChange={handleBillingChange}
                        required={!sameAsShipping}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="credit-card" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" /> Credit Card
                  </TabsTrigger>
                  <TabsTrigger value="paypal" className="flex items-center">
                    <CircleDollarSign className="mr-2 h-4 w-4" /> PayPal
                  </TabsTrigger>
                  <TabsTrigger value="bank-transfer" className="flex items-center">
                    <Landmark className="mr-2 h-4 w-4" /> Bank Transfer
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="credit-card" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardInfo.cardNumber}
                      onChange={handleCardInfoChange}
                      required={paymentMethod === "credit-card"}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card *</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      placeholder="John Doe"
                      value={cardInfo.cardName}
                      onChange={handleCardInfoChange}
                      required={paymentMethod === "credit-card"}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={cardInfo.expiryDate}
                        onChange={handleCardInfoChange}
                        required={paymentMethod === "credit-card"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={cardInfo.cvv}
                        onChange={handleCardInfoChange}
                        required={paymentMethod === "credit-card"}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="paypal">
                  <p className="text-center py-6 text-gray-600">
                    You'll be redirected to PayPal to complete your purchase securely.
                  </p>
                </TabsContent>
                
                <TabsContent value="bank-transfer">
                  <p className="mb-4 text-gray-600">
                    Make your payment directly to our bank account. Your order will be shipped after we receive your payment.
                  </p>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="font-medium">Bank Account Details:</p>
                    <p>Bank: Example Bank</p>
                    <p>Account Number: XXXX-XXXX-XXXX-XXXX</p>
                    <p>Routing Number: XXXXXXXXX</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-supermart-primary hover:bg-supermart-dark text-lg py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing Order...
                </>
              ) : (
                `Complete Order - $${finalTotal}`
              )}
            </Button>
          </form>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex justify-between">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded overflow-hidden mr-3">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (7%)</span>
                <span>${tax}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>${finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
