import { useEffect, useState } from "react"
import BannerImageMobile from "../assets/image/Home_Page_Banner_Mobile.png"
import BannerImageLaptop from "../assets/image/Home_Page_Banner_Laptop.png"
import ItemCard from "../components/item-card"
import { useNavigate } from "react-router-dom"
import axios from "axios"
// Backend API base URL (fallbacks to localhost)
const backendAPI = process.env.REACT_APP_BACKEND_URI || "http://localhost:5000";

const ShopCard = () => {
    const [products, setProducts] = useState([]);
    // console.log(products)
    useEffect(() => {
        const fetchCardData = async () => {
            try {
                const response = await axios.get(`${backendAPI}/get-data`);
                const items = response.data.data
                const filteredItems = items.filter(i=>i.screenOption == "both")
                setProducts(filteredItems);
            } catch (error) {
                console.error("Failed to fetch card data:", error);
            }
        };

        fetchCardData();
    }, []);

    return (
        <>
            {products.map((item, index) => (
                <ItemCard
                    id={item._id}
                    key={index}
                    image={item.imageURL}
                    name={item.productName}
                    desc={item.productDesc}
                    price={item.productPrice}
                />
            ))}
        </>
    );
};

export default function Home({ setActiveMenu }) {
    useEffect(
        () => {
            setActiveMenu("Home")
        }, []
    )
    const navigate = useNavigate();
    return (
        <div>
            {/* <ScrollToTop/> */}
            {/* Offer Banner for Laptop */}
            <div className="hidden md:block md:bg-[#BE185D] md:px-5">
                <img src={BannerImageLaptop} alt="" />
            </div>
            {/* Offer Banner for Mobile */}
            <div className="md:hidden">
                <img src={BannerImageMobile} alt="" />
            </div>
            {/* Shop Card */}
            <div className="px-4 py-8 md:px-14 lg:px-20">
                <h1 className="text-2xl font-bold text-pink-600 mb-4">Best Deals</h1>

                <div className="grid grid-cols-2  gap-y-6 md:gap-y-16  gap-x-5 w-full md:grid-cols-3 lg:grid-cols-5">
                    <ShopCard />
                </div>
            </div>

            {/* Explore More Button*/}
            <div className="flex justify-center mb-8">
                <button onClick={() => navigate("/products")} aria-label="View More Product" className="bg-pink-500 px-5 py-1 text-white font-medium rounded-lg">Explore More</button>
            </div>
        </div>
    )
}