import { useEffect, useState } from "react";
import EmptyCartImage from "../assets/image/empty-cart.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrderPage({ setActiveMenu }) {
  const navigate = useNavigate();
  const userId = "jovin"; // Ideally from auth context or Redux
  const backendAPI = process.env.REACT_APP_BACKEND_URI || "http://localhost:5000";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch order history when component mounts
  useEffect(() => {
    setActiveMenu("My Orders");

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${backendAPI}/order/history/${userId}`);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching order history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [setActiveMenu, userId, backendAPI]);

  // Loading state
  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  // If no orders
  if (orders.length === 0) {
    return (
      <div className="md:mx-52 md:py-16 flex flex-col items-center bg-pink-100 m-5 p-5 rounded-xl">
        <img className="w-48" src={EmptyCartImage} alt="empty-cart" />
        <p className="mt-5 text-lg font-medium text-gray-900">No Order History</p>
        <p className="mb-8 text-center text-gray-900 text-xs">
          No history of transactions made on CyberTDesign
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-pink-600 font-medium text-white px-5 py-2 rounded"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // Sort by newest order first
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="bg-pink-50 m-3 rounded-xl p-3 md:mx-52 md:my-10 md:p-5">
      <h1 className="font-bold text-2xl md:text-3xl mb-6 text-pink-600">My Orders</h1>

      <div className="space-y-6">
        {sortedOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl p-4 md:p-6 border border-pink-200 shadow-sm"
          >
            {/* Order Info */}
            <div className="mb-4 text-sm text-gray-600">
              <p>
                <span className="font-semibold text-gray-800">Order Date:</span>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Order Items */}
            {order.Items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center justify-between bg-pink-100 rounded-md p-3 mb-2"
              >
                <div className="flex items-center gap-3">
                  <img className="w-14 h-14 object-cover rounded" src={item.imageURL} alt={item.productName}/>
                  <div>
                    <p className="font-medium text-sm md:text-base truncate w-40 text-gray-800">
                        {item.productName}
                    </p>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div>
                    <p className="font-semibold text-gray-800">
                    &#8377;{item.productPrice.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex justify-between md:gap-10 gap-3 mt-2 md:mt-0 text-sm md:text-base">
                  <p className="text-green-700 font-semibold"><i class="fa-solid fa-circle-check"/> Ordered</p>
                </div>
              </div>
            ))}

            {/* Total Amount */}
            <div className="mt-4 flex justify-between">
                <p className="text-sm"><span className="font-semibold text-gray-800">Order ID:</span> <span className="text-gray-500">{order._id}</span></p>
                <p className="text-sm md:text-base font-semibold text-gray-800">
                    Total: &#8377;
                    {order.Items.reduce(
                    (total, item) => total + item.productPrice * item.quantity,
                    0
                    ).toLocaleString("en-IN")}
                </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
