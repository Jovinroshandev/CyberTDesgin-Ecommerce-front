import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Backend API base URL
const backendAPI = process.env.REACT_APP_BACKEND_URI || "http://localhost:5000";



export default function ItemCard({
  id,
  image,
  name,
  desc,
  star_count = 4,
  review_count = 89,
  price
}) {
  const token = localStorage.getItem("accessToken");
  const decoded = jwtDecode(token);
  const userId = decoded.email;
  const navigate = useNavigate();
  const [cartQuantity, setCartQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch cart quantity on mount
  useEffect(() => {
    const fetchCartQuantity = async () => {
      try {
        const res = await axios.get(`${backendAPI}/cart/${userId}/quantity`);
        const items = res.data.items;
        const match = items.find((item) => item.productId === id);
        if (match) {
          setCartQuantity(match.quantity);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartQuantity();
  }, [id, userId]);

  const renderStars = () => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`fa-${i < star_count ? "solid" : "regular"} fa-star text-yellow-400`}
      ></i>
    ));
  };

  const addCartHandler = async () => {
    setLoading(true);
    try {
      await axios.post(`${backendAPI}/cart/addtocart`, {
        UserId: userId,
        productId: id
      });
      setCartQuantity((prev) => prev + 1);
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const incrCartHandler = async () => {
    setLoading(true);
    try {
      await axios.post(`${backendAPI}/cart/increase`, {
        UserId: userId,
        productId: id,
        cartQuantity,
      });
      setCartQuantity((prev) => prev + 1);
    } catch (err) {
      console.error("Error increasing cart quantity:", err);
    } finally {
      setLoading(false);
    }
  };

  const descrCartHandler = async () => {
    try {
        const response = await axios.put(`${backendAPI}/cart/decrease-cart`, {
            UserId: userId,
            productId: id,
        });
        const newQty = response.data.newQuantity ?? cartQuantity - 1; // fallback
        setCartQuantity(Math.max(0, newQty));
    } catch (err) {
        console.error("Error decreasing cart quantity:", err);
    }
};


  const deleteCartHandler = async () => {
    setLoading(true);
    try {
      await axios.delete(`${backendAPI}/cart/remove`, {
        data: {
          UserId: userId,
          productId: id,
        },
      });
      setCartQuantity(0);
    } catch (err) {
      console.error("Error removing from cart:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", damping: 5, stiffness: 300 }}
      className="bg-pink-100 w-fit p-2 rounded-md shadow-lg"
    >
      <button onClick={() => navigate("/product-details",{state:{image,name,desc}})} className="text-left">
        <img className="w-36 h-36" src={image} alt={name} />
        <h1 className="text-pink-600 w-40 truncate text-lg md:text-lg font-bold">{name}</h1>
        <p className="w-40 truncate text-sm text-gray-700 mt-1">{desc}</p>
        <p className="text-sm mt-1">
          <span>{renderStars()}</span>
          <span className="text-gray-600 text-xs md:text-sm ml-1">({review_count})</span>
        </p>
      </button>

      <div className="flex justify-between items-center mt-2">
        <p className="text-lg font-medium mt-1">&#8377;{price}/-</p>

        {cartQuantity === 0 ? (
          <div className="relative group">
            <span className="hidden md:block">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-[-25px] right-[-22px] text-xs font-medium bg-gray-700 text-white p-1 rounded shadow">
                Add to Cart
              </span>
            </span>
            <p className="flex px-[3px] py-[2px] justify-center bg-pink-500 rounded font-medium text-white">
              <button
                disabled={loading}
                onClick={addCartHandler}
                className="text-lg"
              >
                <i className="fa-solid fa-cart-plus" /> Add
              </button>
            </p>
          </div>
        ) : (
          <div className="flex gap-2 px-1 py-[2px] text-lg justify-center bg-pink-500 rounded font-medium text-white">
            <button
              disabled={loading}
              onClick={() => {
                if (cartQuantity !== 1) {
                  descrCartHandler();
                } else {
                  deleteCartHandler();
                }
              }}
            >
              <i className="fa-solid fa-square-minus"></i>
            </button>
            <p>{Math.max(cartQuantity, 0)}</p>
            <button disabled={loading} onClick={incrCartHandler}>
              <i className="fa-solid fa-square-plus"></i>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
