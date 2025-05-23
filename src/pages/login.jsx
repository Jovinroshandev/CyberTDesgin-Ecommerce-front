import LoginBG from "../assets/image/Ecommerce-Header-image.png"
import FooterImg from "../assets/image/Ecommerce-footer-image.png"
import { useNavigate } from "react-router-dom"

export default function Login() {
    const navigate = useNavigate();
    const handleSignup = ()=> navigate("/signup")
    return (
        <div className="text-sm flex flex-col gap-5 m-3 bg-[#FF8D44] rounded-xl">
            {/* Header Image Container */}
            <div>
                <img className="rounded-t-xl" src={LoginBG} alt="Login-bg-image" />
            </div>

            {/* Login Form Container */}
            <div className="flex flex-col gap-4 mx-auto py-16">
                {/* Heading */}
                <div>
                    <h1 className="text-white text-xl font-bold">Login</h1>
                    <p className="text-gray-100 text-xs">Please Login to continue shopping</p>
                </div>

                <div className="flex flex-col gap-4 mx-auto w-72">
                    {/* Email Input with Floating Label */}
                    <div className="inputContainer">
                        <input
                            className="inputStyle bg-transparent outline-none border-b-2 border-orange-300 p-2 "
                            type="email"
                            id="email"
                            required
                            placeholder=""
                            style={{ width: "100%" }}
                        />
                        <label htmlFor="email" className="labelStyle text-orange-300">Email</label>
                    </div>

                    {/* Password Input with Floating Label */}
                    <div className="inputContainer">
                        <input
                            className="inputStyle bg-transparent outline-none border-b-2 border-orange-300 p-2"
                            type="password"
                            id="password"
                            required
                            placeholder=""
                        />
                        <label htmlFor="password" className="labelStyle text-orange-300">Password</label>
                    </div>
                    <div className="bg-red-600 w-fit text-white font-medium px-5 py-2 rounded-lg">
                        <button>Submit</button>
                    </div>
                    
                    <div className="text-white text-center">
                        <p>OR</p>
                    </div>
                    {/* Google Signin Button */}
                    <div className="flex justify-center">
                        <button className="text-orange-600 font-medium bg-white w-fit px-4 py-2 rounded-full"><i class="fa-brands fa-google"></i> Continue with Google</button>
                    </div>

                    <div>
                        <p className="text-xs text-white text-center">New here? <button onClick={handleSignup} className="font-medium text-red-600">Create an Account</button> – Join our style squad</p>
                    </div>
                </div>
            </div>
            {/* Footer Image Container */}
            <div>
                <img className="rounded-b-xl" src={FooterImg} alt="Login-bg-image" />
            </div>
        </div>
    )
}