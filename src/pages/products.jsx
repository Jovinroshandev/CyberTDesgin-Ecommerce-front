import { useEffect, useState } from "react"
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
                const items = response.data.data;
                setProducts(items);
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

export default function Products({ setActiveMenu }) {
    const [searchInput,setSearchInput] = useState("")
    useEffect(
        () => {
            setActiveMenu("Products")
        }, []
    )
    const navigate = useNavigate();
    return (
        <div>
            {/* Shop Card */}
            <div className="px-4 py-8 md:px-14 lg:px-20">
                {/* Search box */}
                <div className="flex justify-between mx-auto w-[98%] py-1 px-2 rounded-full  border border-pink-500 bg-pink-50">
                    <input value={searchInput} onChange={(e)=>setSearchInput(e.target.value)} placeholder="Find your perfect match.." className="w-[80%] outline-none bg-transparent mx-2" type="text" />
                    <button className="rounded-full bg-pink-600 text-white font-medium px-3 py-2">Search</button>
                </div>

                {/* Content */}
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