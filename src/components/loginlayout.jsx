import LoginBG from "../assets/image/Ecommerce-Header-image.png"
import FooterImg from "../assets/image/Ecommerce-footer-image.png"
import MdBG from "../assets/image/md-bg.png"
export default function LoginLayout({children}){
    return(
        <div className="text-sm flex flex-col md:flex-row md:items-center  gap-5 m-3 md:mx-36 md:mt-7 mb-2 bg-pink-800 rounded-xl">
            {/* Header Image Container */}
            <div className="hidden md:block">
                <img className="rounded-l-xl w-[600px]" src={MdBG} alt="" />
            </div>
            <div>
                <img className="md:hidden rounded-t-xl" src={LoginBG} alt="Login-bg-image" />
            </div>

            {children}
            {/* Footer Image Container */}
            <div>
                <img className="md:hidden rounded-b-xl" src={FooterImg} alt="Login-bg-image" />
            </div>
        </div>
    )
}