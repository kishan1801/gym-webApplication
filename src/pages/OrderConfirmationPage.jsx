import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

// Configure axios
axios.defaults.baseURL = "https://fitlyfy.onrender.com";

// Create socket connection (for real-time updates)

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("polling");

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // Try to fetch from API first
        const response = await axios.get(`/api/orders/${orderId}`);

        if (response.data.success) {
          setOrder(response.data.data);
          setLoading(false);
          return;
        }
      } catch (apiError) {
        // console.log('API fetch failed, trying localStorage:', apiError);

        // Fallback to localStorage
        try {
          const savedOrder = localStorage.getItem(`fitlyf_order_${orderId}`);
          if (savedOrder) {
            setOrder(JSON.parse(savedOrder));
          } else {
            // Try to get from last order
            const lastOrder = localStorage.getItem("fitlyf_last_order");
            if (lastOrder) {
              const parsedOrder = JSON.parse(lastOrder);
              if (parsedOrder.orderId === orderId) {
                setOrder(parsedOrder);
              } else {
                throw new Error("Order not found");
              }
            } else {
              throw new Error("Order not found");
            }
          }
        } catch (localError) {
          setError("Order not found. Please check your order ID.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();

      // Set up polling for status updates (fallback if socket fails)
      const pollInterval = setInterval(fetchOrderDetails, 30000); // Poll every 30 seconds

      return () => clearInterval(pollInterval);
    }
  }, [orderId]);

  // Get status steps based on current order status
  const getStatusSteps = (currentStatus) => {
    const allStatuses = ["confirmed", "processing", "shipped", "delivered"];
    const currentIndex = allStatuses.indexOf(currentStatus);

    return [
      {
        id: 1,
        name: "Order Placed",
        description: "Order has been received",
        date: order?.createdAt,
        completed: true,
        active: false,
      },
      {
        id: 2,
        name: "Confirmed",
        description: "Order has been confirmed",
        date: order?.updatedAt,
        completed: currentIndex >= 0,
        active: currentStatus === "confirmed",
      },
      {
        id: 3,
        name: "Processing",
        description: "Preparing your order",
        date: order?.updatedAt,
        completed: currentIndex >= 1,
        active: currentStatus === "processing",
      },
      {
        id: 4,
        name: "Shipped",
        description: "Order is on the way",
        date: order?.shipping?.shippedAt,
        completed: currentIndex >= 2,
        active: currentStatus === "shipped",
      },
      {
        id: 5,
        name: "Delivered",
        description: "Order has been delivered",
        date: order?.deliveredAt,
        completed: currentIndex >= 3,
        active: currentStatus === "delivered",
      },
    ];
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Soon";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Download receipt
  const downloadReceipt = () => {
    if (!order) return;

    const receiptContent = `
      FITLYF Fitness Store
      =====================
      
      Order Confirmation
      =====================
      Order ID: ${order.orderId}
      Date: ${new Date(order.createdAt).toLocaleDateString()}
      Time: ${new Date(order.createdAt).toLocaleTimeString()}
      Status: ${order.status || "pending"}
      
      Customer Details:
      -----------------
      Name: ${order.customer?.firstName || ""} ${order.customer?.lastName || ""}
      Email: ${order.customer?.email || ""}
      Phone: ${order.customer?.phone || ""}
      
      Shipping Address:
      -----------------
      ${order.shipping?.address || ""}
      ${order.shipping?.city || ""}, ${order.shipping?.state || ""} - ${order.shipping?.pinCode || ""}
      
      Order Items:
      ------------
      ${order.items
        ?.map(
          (item) => `
        • ${item.name || "Item"}
          Qty: ${item.quantity || 1} × ₹${item.price || 0} = ₹${(item.price || 0) * (item.quantity || 1)}
      `,
        )
        .join("")}
      
      Order Summary:
      --------------
      Subtotal: ₹${order.orderTotal?.subtotal?.toLocaleString() || "0"}
      Shipping: ₹${order.orderTotal?.shipping?.toLocaleString() || "0"}
      Tax (18%): ₹${order.orderTotal?.tax?.toFixed(2) || "0.00"}
      Total: ₹${order.orderTotal?.total?.toFixed(2) || "0.00"}
      
      Payment Method:
      ---------------
      ${order.payment?.method === "cod" ? "Cash on Delivery" : "Online Payment"}
      Status: ${order.payment?.status || "pending"}
      
      Estimated Delivery:
      -------------------
      ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : "Soon"}
      
      Current Status:
      ---------------
      ${order.status || "Pending"}
      Last Updated: ${order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "N/A"}
      
      Thank you for shopping with FITLYF!
      =====================================
      
      Contact Support:
      📞 +91-99999-99999
      📧 support@fitlyf.com
      🌐 www.fitlyf.com
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fitlyf-receipt-${order.orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Refresh order status manually
  const refreshOrderStatus = async () => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      if (response.data.success) {
        setOrder(response.data.data);
        // Save to localStorage as fallback
        localStorage.setItem(
          `fitlyf_order_${orderId}`,
          JSON.stringify(response.data.data),
        );
      }
    } catch (error) {
      // console.error('Failed to refresh order:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading order details...</p>
          {connectionStatus !== "connected" && (
            <p className="text-yellow-500 text-sm mt-2">
              Connection: {connectionStatus}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-dark-bg pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            {error || "The order you are looking for does not exist."}
          </p>
          <Link
            to="/store"
            className="px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg font-semibold transition duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps(order.status || "confirmed");
  const currentStatus = order.status || "confirmed";

  return (
    <div className="min-h-screen bg-dark-bg pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Connection Status Indicator */}
        {connectionStatus !== "connected" && (
          <div className="mb-6 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-yellow-400 text-sm">
                  {connectionStatus === "disconnected"
                    ? "Connection lost. Updates may be delayed."
                    : connectionStatus === "error"
                      ? "Connection error. Trying to reconnect..."
                      : "Connecting to live updates..."}
                </span>
              </div>
              <button
                onClick={refreshOrderStatus}
                className="text-sm px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition duration-300"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Success Header */}
        <div className="text-center mb-12">
          <div
            className={`w-20 h-20 ${
              currentStatus === "delivered"
                ? "bg-green-600"
                : currentStatus === "shipped"
                  ? "bg-blue-600"
                  : currentStatus === "processing"
                    ? "bg-purple-600"
                    : "bg-brand-primary"
            } rounded-full flex items-center justify-center mx-auto mb-6`}
          >
            <span className="text-4xl">
              {currentStatus === "delivered"
                ? "✅"
                : currentStatus === "shipped"
                  ? "🚚"
                  : currentStatus === "processing"
                    ? "⚙️"
                    : "📦"}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {currentStatus === "delivered"
              ? "Order Delivered!"
              : currentStatus === "shipped"
                ? "Order Shipped!"
                : currentStatus === "processing"
                  ? "Order Processing!"
                  : "Order Confirmed!"}
          </h1>
          <p className="text-gray-400 text-lg mb-2">
            Thank you for your purchase,{" "}
            {order.customer?.firstName || "Customer"}!
          </p>
          <p className="text-gray-500">
            Your order ID:{" "}
            <span className="text-brand-primary font-bold">
              {order.orderId}
            </span>
          </p>

          {/* Real-time status indicator */}
          <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                connectionStatus === "connected"
                  ? "bg-green-500 animate-pulse"
                  : "bg-yellow-500"
              }`}
            ></div>
            <span className="text-sm text-gray-400">
              {connectionStatus === "connected"
                ? "Live updates active"
                : "Manual refresh required"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2">
            {/* Order Status Timeline */}
            <div className="bg-dark-card rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Order Status Timeline
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentStatus === "delivered"
                      ? "bg-green-900/30 text-green-400"
                      : currentStatus === "shipped"
                        ? "bg-blue-900/30 text-blue-400"
                        : currentStatus === "processing"
                          ? "bg-purple-900/30 text-purple-400"
                          : "bg-yellow-900/30 text-yellow-400"
                  }`}
                >
                  {currentStatus.charAt(0).toUpperCase() +
                    currentStatus.slice(1)}
                </span>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-700"></div>

                {/* Timeline steps */}
                <div className="space-y-8">
                  {statusSteps.map((step, index) => (
                    <div key={step.id} className="relative flex items-start">
                      <div
                        className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                          step.completed
                            ? "bg-brand-primary"
                            : step.active
                              ? "bg-blue-600"
                              : "bg-gray-700"
                        }`}
                      >
                        {step.completed ? (
                          <span className="text-white">✓</span>
                        ) : step.active ? (
                          <span className="text-white animate-pulse">●</span>
                        ) : (
                          <span className="text-gray-400">{step.id}</span>
                        )}
                      </div>
                      <div className="ml-6 flex-1">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`text-lg font-semibold ${
                              step.completed || step.active
                                ? "text-white"
                                : "text-gray-400"
                            }`}
                          >
                            {step.name}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {step.date ? formatDate(step.date) : "Pending"}
                          </span>
                        </div>
                        <p
                          className={`mt-1 ${
                            step.completed || step.active
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          {step.description}
                        </p>
                        {step.active && (
                          <div className="mt-2 flex items-center text-sm text-blue-400">
                            <span className="animate-pulse mr-2">●</span>
                            Currently at this stage
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-dark-card rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg"
                  >
                    <div className="flex items-center">
                      <img
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w-400&q=80"
                        }
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                      <div>
                        <h4 className="text-white font-medium">
                          {item.name || "Product"}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Quantity: {item.quantity || 1}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">
                        ₹
                        {(
                          (item.price || 0) * (item.quantity || 1)
                        ).toLocaleString()}
                      </p>
                      <p className="text-gray-400 text-sm">
                        ₹{item.price?.toLocaleString() || "0"} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-card rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Shipping Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Recipient</p>
                    <p className="text-white">
                      {order.customer?.firstName || ""}{" "}
                      {order.customer?.lastName || ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Address</p>
                    <p className="text-gray-300">
                      {order.shipping?.address || "No address provided"}
                    </p>
                    <p className="text-gray-300">
                      {order.shipping?.city || ""},{" "}
                      {order.shipping?.state || ""} -{" "}
                      {order.shipping?.pinCode || ""}
                    </p>
                  </div>
                  <div className="flex space-x-6">
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-gray-300">
                        📧 {order.customer?.email || "No email"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Phone</p>
                      <p className="text-gray-300">
                        📱 {order.customer?.phone || "No phone"}
                      </p>
                    </div>
                  </div>
                  {order.shipping?.trackingNumber && (
                    <div className="pt-3 border-t border-gray-800">
                      <p className="text-gray-400 text-sm">Tracking Number</p>
                      <p className="text-white font-mono">
                        {order.shipping.trackingNumber}
                      </p>
                      {order.shipping?.courier && (
                        <p className="text-gray-300 text-sm mt-1">
                          Courier: {order.shipping.courier}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-dark-card rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Payment Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Method</p>
                    <p className="text-white text-lg">
                      {order.payment?.method === "cod"
                        ? "💵 Cash on Delivery"
                        : order.payment?.method === "razorpay"
                          ? "💳 Card/UPI Payment"
                          : order.payment?.method === "online"
                            ? "💳 Online Payment"
                            : "👛 Wallet"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <p
                      className={`text-lg font-bold ${
                        order.payment?.status === "completed"
                          ? "text-green-400"
                          : order.payment?.status === "pending"
                            ? "text-yellow-400"
                            : order.payment?.status === "failed"
                              ? "text-red-400"
                              : "text-gray-400"
                      }`}
                    >
                      {order.payment?.status?.charAt(0).toUpperCase() +
                        order.payment?.status?.slice(1) || "Pending"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Amount</p>
                    <p className="text-white text-xl font-bold">
                      ₹{order.orderTotal?.total?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  {order.payment?.method === "cod" && (
                    <div className="mt-3 p-3 bg-yellow-900/20 rounded-lg">
                      <p className="text-yellow-300 text-sm">
                        💡 Please keep exact change ready for delivery.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Info */}
          <div>
            <div className="bg-dark-card rounded-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">
                Order Actions
              </h2>

              <div className="space-y-6">
                {/* Status Updates Info */}
                <div className="p-4 bg-gray-800/30 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">
                    🔄 Live Updates
                  </h4>
                  <p className="text-gray-400 text-sm">
                    This page updates automatically when order status changes.
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Last updated:</span>
                    <span className="text-gray-300 text-sm">
                      {order.updatedAt
                        ? formatDate(order.updatedAt)
                        : "Just now"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={downloadReceipt}
                    className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition duration-300 flex items-center justify-center"
                  >
                    <span className="mr-2">📄</span> Download Receipt
                  </button>
                  <button
                    onClick={refreshOrderStatus}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-300 flex items-center justify-center"
                  >
                    <span className="mr-2">🔄</span> Refresh Status
                  </button>
                  <Link
                    to="/store"
                    className="block w-full py-3 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg font-semibold transition duration-300 text-center"
                  >
                    🛍️ Continue Shopping
                  </Link>
                  <button
                    onClick={() => window.print()}
                    className="w-full py-3 bg-transparent border border-gray-600 text-gray-300 hover:text-white rounded-lg font-semibold transition duration-300"
                  >
                    🖨️ Print Order
                  </button>
                </div>

                {/* Support Info */}
                <div className="pt-6 border-t border-gray-800">
                  <h4 className="text-white font-semibold mb-3">
                    📞 Need Help?
                  </h4>
                  <p className="text-gray-400 text-sm mb-3">
                    Questions about your order? Our support team is here to
                    help.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-3">📧</span>
                      <span className="text-gray-300 text-sm">
                        support@fitlyf.com
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-3">📱</span>
                      <span className="text-gray-300 text-sm">
                        +91-99999-99999
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-3">🕒</span>
                      <span className="text-gray-300 text-sm">
                        Mon-Sun: 8AM-10PM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Delivery */}
        {order.estimatedDelivery && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Estimated Delivery
                </h3>
                <p className="text-gray-300">
                  Your order is expected to arrive by{" "}
                  <span className="text-white font-semibold">
                    {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </span>
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white">🚚</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Delivery Status</p>
                    <p className="text-white font-semibold">
                      {currentStatus === "delivered"
                        ? "Delivered"
                        : currentStatus === "shipped"
                          ? "In Transit"
                          : currentStatus === "processing"
                            ? "Preparing for Shipment"
                            : "Order Confirmed"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
