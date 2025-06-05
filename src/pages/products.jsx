import { useEffect, useState } from "react";
import ItemCard from "../components/item-card";
import axios from "axios";
import SpecailOfferBanner from "../assets/image/special-offer.png";
import { motion } from "framer-motion";

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
    const [lastSearch, setLastSearch] = useState("");
    const [resultNotification, setResultNotification] = useState(false);

    const [categoryFilter, setCategoryFilter] = useState("");
    const [badgeFilter, setBadgeFilter] = useState("");
    const [colorFilter, setColorFilter] = useState("");

    const [categoryFilterNav, setCategoryFilterNav] = useState(false);
    const [badgesFilterNav, setBadgesFilterNav] = useState(false);
    const [colorFilterNav, setColorFilterNav] = useState(false);

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

    const applyAllFilters = (search = "", category = categoryFilter, badge = badgeFilter, color = colorFilter) => {
        const searchTerm = search.toLowerCase();

        const filtered = allProducts.filter((product) =>
            (!searchTerm ||
                product.productName?.toLowerCase().includes(searchTerm) ||
                product.productDesc?.toLowerCase().includes(searchTerm) ||
                product.category?.toLowerCase().includes(searchTerm) ||
                product.color?.toLowerCase().includes(searchTerm) ||
                product.badges?.toLowerCase().includes(searchTerm) ||
                product.productPrice?.toString().includes(searchTerm)) &&
            (!category || product.category?.toLowerCase().includes(category)) &&
            (!badge || product.badges?.toLowerCase().includes(badge)) &&
            (!color || product.color?.toLowerCase().includes(color))
        );

        setProducts(filtered);
        setResultNotification(true);
    };

    const handleSearchSubmit = () => {
        if (searchInput.length > 0) {
            setLastSearch(searchInput);
            applyAllFilters(searchInput);
            setSearchInput("");
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    };

    const handleReset = () => {
        setCategoryFilter("");
        setBadgeFilter("");
        setColorFilter("");
        setLastSearch("");
        setProducts(allProducts);
        setResultNotification(false);
    };

    const handleCategoryFilter = (e) => {
        const value = e.target.value.toLowerCase();
        setLastSearch(value)
        setCategoryFilter(value);
        setCategoryFilterNav(false)
        applyAllFilters(lastSearch, value, badgeFilter, colorFilter);
        // Hide result notification if all filters are cleared
        if (value === "") {
            setCategoryFilter("");
            setProducts(allProducts);
            setResultNotification(false);
        }
        window.scrollTo({ top: 0, behavior: "smooth" })
    };

    const handleBadgeFilter = (e) => {
        const value = e.target.value.toLowerCase();
        setLastSearch(value)
        setBadgeFilter(value);
        setBadgesFilterNav(false)
        applyAllFilters(lastSearch, categoryFilter, value, colorFilter);
        // Hide result notification if all filters are cleared
        if (value === "") {
            setBadgeFilter("")
            setProducts(allProducts);
            setResultNotification(false);
        }
        window.scrollTo({ top: 0, behavior: "smooth" })
    };

    const handleColorFilter = (e) => {
        const value = e.target.value.toLowerCase();
        setLastSearch(value)
        setColorFilter(value);
        setColorFilterNav(false)
        applyAllFilters(lastSearch, categoryFilter, badgeFilter, value);
        // Hide result notification if all filters are cleared
        if (value === "") {
            setColorFilter("")
            setProducts(allProducts)
            setResultNotification(false);
        }
        window.scrollTo({ top: 0, behavior: "smooth" })
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

                {/* Filter buttons */}
                <div className="md:mx-44 flex justify-end gap-2">
                    <button onClick={() => {
                        setCategoryFilterNav(!categoryFilterNav);
                        setBadgesFilterNav(false);
                        setColorFilterNav(false);
                    }} className="bg-gray-800 text-white px-3 py-1 mt-2 rounded-lg text-xs md:text-sm"><i className="fa-solid fa-filter" /> Category</button>
                    <button onClick={() => {
                        setBadgesFilterNav(!badgesFilterNav);
                        setCategoryFilterNav(false);
                        setColorFilterNav(false);
                    }} className="bg-gray-800 text-white px-3 py-1 mt-2 rounded-lg text-xs md:text-sm"><i className="fa-solid fa-filter" /> Badges</button>
                    <button onClick={() => {
                        setColorFilterNav(!colorFilterNav);
                        setCategoryFilterNav(false);
                        setBadgesFilterNav(false);
                    }} className="bg-gray-800 text-white px-3 py-1 mt-2 rounded-lg text-xs md:text-sm"><i className="fa-solid fa-filter" /> Color</button>
                </div>

                {/* Category Filter */}
                {categoryFilterNav && (
                    <motion.div
                        initial={{ opacity: 0, x: 600 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "tween" }}
                        className="absolute right-1 z-40 flex justify-end mt-1"
                    >
                        <div className="w-64 bg-pink-600 text-white rounded-lg shadow-lg p-5 space-y-4">
                            <h2 className="text-sm font-semibold">Filter by Category</h2>
                            {[
                                { label: "None", value: "" },
                                { label: "New Arrivals", value: "new arrivals" },
                                { label: "Best Sellers", value: "best sellers" },
                                { label: "Under ₹499", value: "under ₹499" },
                                { label: "Gym Wear", value: "gym wear" }
                            ].map(({ label, value }) => (
                                <label key={value} className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors duration-200 ${categoryFilter === value ? "bg-white text-pink-600 font-semibold text-xs" : "hover:bg-pink-500 text-xs"}`}>
                                    <input
                                        type="radio"
                                        name="category"
                                        value={value}
                                        onChange={handleCategoryFilter}
                                        checked={categoryFilter === value}
                                        className="form-radio text-pink-600"
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Badge Filter */}
                {badgesFilterNav && (
                    <motion.div
                        initial={{ opacity: 0, x: 600 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "tween" }}
                        className="absolute right-1 z-40 flex justify-end mt-1"
                    >
                        <div className="w-64 bg-pink-600 text-white rounded-lg shadow-lg p-5 space-y-4">
                            <h2 className="text-sm font-semibold">Filter by Badge</h2>
                            {[
                                { label: "None", value: "" },
                                { label: "Hot", value: "hot" },
                                { label: "Trending", value: "trending" },
                                { label: "Limited Stock", value: "limited stock" }
                            ].map(({ label, value }) => (
                                <label key={value} className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors duration-200 ${badgeFilter === value ? "bg-white text-pink-600 font-semibold text-xs" : "hover:bg-pink-500 text-xs"}`}>
                                    <input
                                        type="radio"
                                        name="badge"
                                        value={value}
                                        onChange={handleBadgeFilter}
                                        checked={badgeFilter === value}
                                        className="form-radio text-pink-600"
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Color Filter */}
                {colorFilterNav && (
                    <motion.div
                        initial={{ opacity: 0, x: 600 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "tween" }}
                        className="absolute right-1 z-40 flex justify-end mt-1"
                    >
                        <div className="w-64 bg-pink-600 text-white rounded-lg shadow-lg p-5 space-y-4">
                            <h2 className="text-sm font-semibold">Filter by Color</h2>
                            {[
                                { label: "None", value: "" },
                                { label: "Black", value: "black" },
                                { label: "White", value: "white" },
                                { label: "Gray", value: "gray" },
                                { label: "Navy", value: "navy" },
                                { label: "Red", value: "red" },
                                { label: "Yellow", value: "yellow" },
                                { label: "Orange", value: "orange" },
                                { label: "Green", value: "green" },
                                { label: "Blue", value: "blue" }
                            ].map(({ label, value }) => (
                                <label key={value} className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors duration-200 ${colorFilter === value ? "bg-white text-pink-600 font-semibold text-xs" : "hover:bg-pink-500 text-xs"}`}>
                                    <input
                                        type="radio"
                                        name="color"
                                        value={value}
                                        onChange={handleColorFilter}
                                        checked={colorFilter === value}
                                        className="form-radio text-pink-600"
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Product Grid */}
                <div className="mt-3 grid grid-cols-2 gap-y-6 md:gap-y-16 gap-x-4 w-full md:grid-cols-3 lg:grid-cols-5">
                    <ShopCard products={products} />
                </div>

                {/* No Products */}
                {products.length === 0 && (
                    <div className="mb-20">
                        <p className="text-center text-gray-500 mt-6">
                            No products found for "{lastSearch}".
                        </p>
                    </div>
                )}

                {/* Special Offer */}
                <div>
                    <img className="mt-5" src={SpecailOfferBanner} alt="Special Offer Banner" />
                </div>
            </div>
        </div>
    );
}
