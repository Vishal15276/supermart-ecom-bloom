import React, { useEffect, useState } from "react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null); // to track loading state on buttons

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You must be logged in to view orders.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:3000/api/admin/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) throw new Error("Unauthorized. Please log in again.");
          throw new Error("Failed to fetch orders.");
        }
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    setError(null); // clear previous errors
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You must be logged in to update orders.");
      return;
    }

    setUpdatingOrderId(orderId);

    try {
      const response = await fetch(`http://localhost:3000/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        // Try to parse error message from backend
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message || "Failed to update order status.";
        throw new Error(message);
      }

      const updatedOrder = await response.json();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: updatedOrder.status } : order
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10 text-lg font-semibold">
        Loading orders...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-600 mt-10 text-lg font-semibold">
        Error: {error}
      </p>
    );
  if (orders.length === 0)
    return (
      <p className="text-center text-gray-700 mt-10 text-lg font-semibold">
        No orders found.
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Your Orders
      </h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
          >
            <p className="text-sm text-gray-500 mb-1">
              <span className="font-semibold">Order ID:</span> {order._id}
            </p>
            <p className="text-base font-semibold text-indigo-700 mb-2">
              Status: {order.status}
            </p>
            <p className="text-base font-medium mb-2">
              <span className="font-semibold">Total Amount:</span>{" "}
              ${order.totalAmount.toFixed(2)}
            </p>
            <p className="mb-4 text-gray-700">
              <span className="font-semibold">Shipping to:</span>{" "}
              {order.shippingDetails.fullName}, {order.shippingDetails.address},{" "}
              {order.shippingDetails.city}, {order.shippingDetails.zip}
            </p>
            <div>
              <strong className="block mb-2 text-gray-800">Products:</strong>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {order.products.map(({ product, quantity }) => (
                  <li key={product._id}>
                    {product.name} - Quantity: {quantity}
                  </li>
                ))}
              </ul>
            </div>

            {/* Accept & Reject Buttons */}
            <div className="mt-4 flex space-x-4">
              <button
                disabled={updatingOrderId === order._id || order.status === "accepted"}
                onClick={() => updateOrderStatus(order._id, "accepted")}
                className={`px-4 py-2 rounded text-white font-semibold transition ${
                  order.status === "accepted"
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {updatingOrderId === order._id && order.status !== "accepted"
                  ? "Accepting..."
                  : "Accept"}
              </button>

              <button
                disabled={updatingOrderId === order._id || order.status === "rejected"}
                onClick={() => updateOrderStatus(order._id, "rejected")}
                className={`px-4 py-2 rounded text-white font-semibold transition ${
                  order.status === "rejected"
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {updatingOrderId === order._id && order.status !== "rejected"
                  ? "Rejecting..."
                  : "Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
