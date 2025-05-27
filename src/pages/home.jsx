import { useEffect } from "react"
import BannerImageMobile from "../assets/image/Home_Page_Banner_Mobile.png"
import BannerImageLaptop from "../assets/image/Home_Page_Banner_Laptop.png"
export default function Home({setActiveMenu}){
    useEffect(
        ()=>{
            setActiveMenu("Home")
        },[]
    )
    return(
        <div>
            {/* Offer Banner for Mobile */}
            <div className="hidden md:block md:bg-[#BE185D] md:px-80">
                <img src={BannerImageLaptop} alt="" />
            </div>
            {/* Offer Banner for Laptop */}
            <div className="md:hidden md:bg-[#BE185D] md:px-80">
                <img src={BannerImageMobile} alt="" />
            </div>
            {/*  */}
            <div>

            </div>
        </div>
    )
}