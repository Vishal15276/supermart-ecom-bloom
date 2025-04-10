import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ShoppingBag,
  ChevronRight,
  Printer,
  Calendar,
  Truck,
  MapPin,
} from "lucide-react";

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:3000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Order not found");
        }

        const data = await response.json();
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order:", error);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="bg-gray-100 rounded-lg p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-6">
          The order you are looking for does not exist.
        </p>
        <Button asChild>
          <Link to="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Order Success Message */}
        <div className="text-center mb-10">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Order Details</h2>
            <Button variant="outline" size="sm" className="flex items-center">
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-gray-600 text-sm">Order Number</p>
              <p className="font-medium">{order._id}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Date</p>
              <p className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(order.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Status</p>
              <p className="font-medium capitalize">{order.status}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total</p>
              <p className="font-medium">${order.total.toFixed(2)}</p>
            </div>
          </div>

          <div className="border-t pt-6 mb-6">
            <h3 className="font-bold mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <ShoppingBag className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-3">Shipping Information</h3>
              <div className="text-gray-700">
                <p>
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-3">Payment Information</h3>
              <p className="text-gray-700 capitalize">
                {order.paymentMethod.replace("-", " ")}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Delivery Information</h2>

          <div className="bg-gray-50 p-4 rounded-lg flex items-center mb-4">
            <Truck className="h-6 w-6 text-supermart-primary mr-3" />
            <div>
              <p className="font-medium">Estimated Delivery Date</p>
              <p className="text-gray-600">
                {formatDate(order.estimatedDelivery)}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg flex items-center">
            <MapPin className="h-6 w-6 text-supermart-primary mr-3" />
            <div>
              <p className="font-medium">Delivery Address</p>
              <p className="text-gray-600">
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button asChild variant="outline" className="flex-1">
            <Link to="/">Continue Shopping</Link>
          </Button>
          <Button
            asChild
            className="flex-1 bg-supermart-primary hover:bg-supermart-dark"
          >
            <Link to="/profile?tab=orders">
              View Your Orders <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
