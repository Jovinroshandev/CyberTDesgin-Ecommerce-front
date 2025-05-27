import { useEffect } from "react"
import BannerImageMobile from "../assets/image/Home_Page_Banner_Mobile.png"
import BannerImageLaptop from "../assets/image/Home_Page_Banner_Laptop.png"
import ItemCard from "../components/item-card"
import Tshirt1 from "../assets/dress-image/tshirt1.png"
import { useNavigate } from "react-router-dom"


const ShopCard = () => {
    const CardDetails = [
        {
            image: Tshirt1,
            headinfo: "T-shirt with Sunglasses",
            descinfo: "Best Summer Ware and Beach Party Ware",
            starCount: "3",
            reviewCount: "100",
            price: "2000"
        },
        {
            image: Tshirt1,
            headinfo: "T-shirt with Sunglasses",
            descinfo: "Best Summer Ware and Beach Party Ware",
            starCount: "4",
            reviewCount: "23",
            price: "2000"
        },
        {
            image: Tshirt1,
            headinfo: "T-shirt with Sunglasses",
            descinfo: "Best Summer Ware and Beach Party Ware",
            starCount: "4",
            reviewCount: "23",
            price: "2000"
        },
        {
            image: Tshirt1,
            headinfo: "T-shirt with Sunglasses",
            descinfo: "Best Summer Ware and Beach Party Ware",
            starCount: "4",
            reviewCount: "23",
            price: "2000"
        },
        {
            image: Tshirt1,
            headinfo: "T-shirt with Sunglasses",
            descinfo: "Best Summer Ware and Beach Party Ware",
            starCount: "4",
            reviewCount: "23",
            price: "2000"
        },
        {
            image: Tshirt1,
            headinfo: "T-shirt with Sunglasses",
            descinfo: "Best Summer Ware and Beach Party Ware",
            starCount: "4",
            reviewCount: "23",
            price: "2000"
        },
    ]
    return (
        <>
            {CardDetails.map((item, index) => (
                <ItemCard
                    key={index}
                    image={item.image}
                    head={item.headinfo}
                    desc={item.descinfo}
                    star_count={item.starCount}
                    review_count={item.reviewCount}
                    price={item.price}
                />
            ))}
        </>
    )
}

export default function Home({ setActiveMenu }) {
    useEffect(
        () => {
            setActiveMenu("Home")
        }, []
    )
    const navigate = useNavigate();
    return (
        <div>
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
                <button onClick={()=>navigate("/products")} aria-label="View More Product" className="bg-pink-500 px-5 py-1 text-white font-medium rounded-lg">Explore More</button>
            </div>
        </div>
    )
}