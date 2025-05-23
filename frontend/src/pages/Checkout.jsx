import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import axios from "axios";

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shipping info structure matches backend schema
  const [shippingInfo, setShippingInfo] = useState({
    fullName: currentUser?.name || "",
    address: "",
    city: "",
    zip: "",
  });

  // Example payment details structure (adjust as needed)
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  useEffect(() => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Unauthorized",
        description: "Please log in to continue with checkout.",
      });
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Update shipping info state
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Update payment info state
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validateShipping = () => {
    for (const [key, value] of Object.entries(shippingInfo)) {
      if (!value.trim()) {
        toast({
          variant: "destructive",
          title: "Missing Field",
          description: `Please enter your ${key}.`,
        });
        return false;
      }
    }
    return true;
  };

  // Basic validation for payment fields if paymentMethod is not COD
  const validatePayment = () => {
    if (paymentMethod === "Cash on Delivery") return true;

    for (const [key, value] of Object.entries(paymentDetails)) {
      if (!value.trim()) {
        toast({
          variant: "destructive",
          title: "Missing Payment Info",
          description: `Please enter your ${key}.`,
        });
        return false;
      }
    }
    return true;
  };

  const calculateShipping = () => (total > 50 ? 0 : 5.99);
  const calculateTax = () => total * 0.07;
  const finalTotal = +(total + calculateShipping() + calculateTax()).toFixed(2);

  // Transform cart products for backend order schema
  const formattedProducts = cart.map(({ _id, quantity }) => ({
    product: _id,
    quantity,
  }));

  const handleOrder = async (e) => {
    e.preventDefault();

    if (!validateShipping() || !validatePayment()) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        "http://localhost:3000/api/orders",
        {
          products: formattedProducts,
          totalAmount: finalTotal,
          shippingDetails: shippingInfo,
          paymentDetails: paymentMethod === "Cash on Delivery" ? {} : paymentDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({ title: "Order placed successfully!" });
      clearCart();
      navigate("/");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: err.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleOrder} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={shippingInfo.fullName}
                onChange={handleShippingChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={handleShippingChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={shippingInfo.city}
                onChange={handleShippingChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="zip">Zip Code</Label>
              <Input
                id="zip"
                name="zip"
                value={shippingInfo.zip}
                onChange={handleShippingChange}
                required
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mb-4 p-2 border rounded"
          >
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Card">Credit/Debit Card</option>
          </select>

          {paymentMethod === "Card" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentDetails.cardNumber}
                  onChange={handlePaymentChange}
                  required={paymentMethod === "Card"}
                />
              </div>
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  name="expiry"
                  value={paymentDetails.expiry}
                  onChange={handlePaymentChange}
                  placeholder="MM/YY"
                  required={paymentMethod === "Card"}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  value={paymentDetails.cvv}
                  onChange={handlePaymentChange}
                  required={paymentMethod === "Card"}
                  maxLength={4}
                />
              </div>
            </div>
          )}
        </div>

        <div className="text-right font-semibold">
          <p>Subtotal: ${total.toFixed(2)}</p>
          <p>Shipping: ${calculateShipping().toFixed(2)}</p>
          <p>Tax (7%): ${calculateTax().toFixed(2)}</p>
          <p className="text-lg mt-2">Total: ${finalTotal.toFixed(2)}</p>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
          Place Order
        </Button>
      </form>
    </div>
  );
};

export default Checkout;
