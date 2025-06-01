import { useEffect, useState, useCallback } from "react";
import cartImage from "../assets/cart-image/cart-image1.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Cards({ setActiveMenu }) {
    const navigate = useNavigate();
    const userId = "jovin"; // Ideally should come from auth/user context
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);

    const backendAPI = process.env.REACT_APP_BACKEND_URI || "http://localhost:5000";

    const fetchCartItems = useCallback(async () => {
        try {
            const response = await axios.get(`${backendAPI}/cart/${userId}`);
            setItems(response.data.items || []);
        } catch (error) {
            console.error("Failed to fetch cart items:", error);
        } finally {
            setLoading(false);
        }
    }, [backendAPI, userId]);

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    useEffect(() => {
        setActiveMenu("Cart");
    }, [setActiveMenu]);

    const totalAmount = items.reduce((acc, item) => acc + item.productPrice * item.quantity, 0);

    const incrCartHandler = async (id) => {
        try {
            await axios.post(`${backendAPI}/cart/add`, {
                UserId: userId,
                productId: id,
            });
            await fetchCartItems();
        } catch (err) {
            console.error("Error increasing cart quantity:", err);
        }
    };

    const descrCartHandler = async (id) => {
        try {
            await axios.put(`${backendAPI}/cart/descrease-cart`, {
                UserId: userId,
                productId: id,
            });
            await fetchCartItems();
        } catch (err) {
            console.error("Error decreasing cart quantity:", err);
        }
    };

    const deleteCartHandler = async (id) => {
        try {
            await axios.delete(`${backendAPI}/cart/remove`, {
                data: {
                    UserId: userId,
                    productId: id,
                },
            });
            setItems((prevItems) => prevItems.filter((item) => item.productId !== id));
        } catch (err) {
            console.error("Error removing from cart:", err);
        }
    };

    if (loading) {
        return <p className="text-center mt-20">Loading...</p>;
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="w-fit bg-pink-100 text-center my-5 px-16 py-5 md:px-64 md:py-16 rounded-xl">
                    <img className="w-52 mx-auto" src={cartImage} alt="Empty cart" />
                    <h1 className="font-medium mt-10 text-lg">Your Cart is Empty</h1>
                    <p className="text-sm w-64 md:w-auto">
                        Looks like you haven't added anything to your cart yet
                    </p>
                    <button
                        onClick={() => navigate("/products")}
                        className="bg-pink-500 mt-10 text-white font-medium px-5 py-2"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-pink-100 m-3 rounded-xl p-3 md:mx-52 md:my-10 md:p-5">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-3xl">My Cart</h1>
                <p className="bg-pink-700 font-medium text-white rounded-full px-3 py-2">
                    <a href="/products">Continue Shopping</a>
                </p>
            </div>

            <div className="mt-10 space-y-4">
                {items.map((item) => (
                    <div
                        key={item.productId}
                        className="bg-pink-200 rounded-xl p-4 flex justify-between items-center"
                    >
                        <div className="flex items-center gap-3">
                            <img className="w-14" src={item.imageURL} alt={item.productName} />
                            <p className="font-medium">{item.productName}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <p className="font-medium">Qty: {item.quantity}</p>
                            <div className="flex flex-col leading-none">
                                <button onClick={() => incrCartHandler(item.productId)}>
                                    <i className="fa-solid fa-caret-up text-sm"></i>
                                </button>
                                {item.quantity > 1 ? (
                                    <button onClick={() => descrCartHandler(item.productId)}>
                                        <i className="fa-solid fa-caret-down text-sm"></i>
                                    </button>
                                ) : (
                                    <button className="invisible">
                                        <i className="fa-solid fa-caret-down text-sm"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="font-bold">&#8377;{item.productPrice}</p>
                        <button onClick={() => deleteCartHandler(item.productId)}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                ))}

                <div className="flex justify-between items-center">
                    <h2 className="text-pink-500 font-medium text-xl mt-10">
                        Total <span className="text-gray-800">&#8377;{totalAmount}</span>
                    </h2>
                    <button className="bg-gray-800 text-white px-8 rounded font-medium py-2 mt-10">
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}
