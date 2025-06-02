import { useEffect, useState } from "react";
import ItemCard from "../components/item-card";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SpecailOfferBanner from "../assets/image/special-offer.png"
const backendAPI = process.env.REACT_APP_BACKEND_URI || "http://localhost:5000";

const ShopCard = ({ products }) => {
    return (
        <>
            {products.map((item) => (
                <ItemCard
                    id={item._id}
                    key={item._id}
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
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [resultNotification, setResultNotification] = useState(false);
    const [lastSearch, setLastSearch] = useState("");

    useEffect(() => {
        setActiveMenu("Products");

        const fetchCardData = async () => {
            try {
                const response = await axios.get(`${backendAPI}/get-data`);
                const items = response.data.data;
                setAllProducts(items);
                setProducts(items);
                setResultNotification(false);
            } catch (error) {
                console.error("Failed to fetch card data:", error);
            }
        };

        fetchCardData();
    }, [setActiveMenu]);

    const handleSearchSubmit = () => {
        if (searchInput.length > 0){
            const searchTerm = searchInput.toLowerCase();
        const filtered = allProducts.filter((product) =>
            product.productName?.toLowerCase().includes(searchTerm) ||
            product.productDesc?.toLowerCase().includes(searchTerm) ||
            product.category?.toLowerCase().includes(searchTerm) ||
            product.color?.toLowerCase().includes(searchTerm) ||
            product.badges?.toLowerCase().includes(searchTerm) ||
            product.productPrice?.toString().toLowerCase().includes(searchTerm)
        );

        setProducts(filtered);
        setLastSearch(searchInput);
        setResultNotification(true);
        setSearchInput("");
        }
    };

    const handleReset = () => {
        setProducts(allProducts);
        setResultNotification(false);
        setLastSearch("");
    };

    return (
        <div className="mx-auto">
            <div className="px-4 mx-auto py-8 md:px-14 lg:px-20">
                {/* Search box */}
                <div className="flex justify-between items-center mx-auto w-[98%] md:w-[70%] py-1 px-2 rounded-full border border-pink-500 bg-pink-50">
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                        placeholder="Find your perfect match.."
                        className="w-[80%] outline-none bg-transparent mx-2"
                        type="text"
                    />
                    <button
                        onClick={handleSearchSubmit}
                        className="rounded-full bg-pink-600 text-white font-medium px-3 py-2"
                    >
                        Search
                    </button>
                </div>

                {resultNotification && (
                    <div className="mt-2 flex items-center gap-2">
                        <p className="font-medium">
                            <span className="text-pink-600">Result for</span> "{lastSearch}"
                        </p>
                        <button
                            onClick={handleReset}
                            className="rounded-lg bg-pink-600 text-white px-2 font-medium"
                        >
                            Reset
                        </button>
                    </div>
                )}

                <h1 className="mt-6 text-2xl font-bold text-pink-600 mb-4">Featured Products</h1>

                <div className="grid grid-cols-2 gap-y-6 md:gap-y-16 gap-x-4 w-full md:grid-cols-3 lg:grid-cols-5">
                    <ShopCard products={products} />
                </div>

                {products.length === 0 && (
                    <div className="mb-20">
                        <p className="text-center text-gray-500 mt-6">
                            No products found for "{lastSearch}".
                        </p>
                    </div>
                )}
                <div>
                    <img className="mt-5" src={SpecailOfferBanner} alt={SpecailOfferBanner} />
                </div>
            </div>
        </div>
    );
}
