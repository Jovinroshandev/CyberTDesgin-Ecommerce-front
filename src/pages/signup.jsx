import LoginBG from "../assets/image/Ecommerce-Header-image.png"
import FooterImg from "../assets/image/Ecommerce-footer-image.png"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion";
import { useState } from "react";

export default function Signup() {
    const navigate = useNavigate();
    // redirect to login page
    const hanldeLogin = () => navigate("/")
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [confirmpass, setConfirmPass] = useState("")
    const [emailAlert, setEmailAlert] = useState(false);
    const [passwordAlert, setPassAlert] = useState(false)
    const [confirmAlert, setConfirmAlert] = useState(false);

    const validate = (email)=>{
        // validate using regax pattern
        const regexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexPattern.test(email)
    }

    const handleEmail = (e)=>{
        const {value} = e.target;
        setEmail(value);

        // Validate Email
        if (value.length !== 0 && !validate(value)){
            setEmailAlert(true)
        }
        else{
            setEmailAlert(false)
        }
    }

    const handlePass = (e) => {
        const { value } = e.target
        setPass(value)
        // Check the new password
        if (value.length > 0 && value.length < 8) {
            setPassAlert(true);
        } else {
            setPassAlert(false);
        }
    }
    const handleConfirmPass = (e) => {
        const { value } = e.target;
        setConfirmPass(value);
        // Check Password and Confirm Password are Same or not
        if (pass.length !== 0 && value.length !==0 && value !== pass) {
            setConfirmAlert(true);
        } else {
            setConfirmAlert(false);
        }
    };

    return (
        <div className="text-sm flex flex-col gap-5 mx-3 mt-10 mb-2 bg-[#FF8D44] rounded-xl">
            {/* Header Image Container */}
            <div>
                <img className="rounded-t-xl" src={LoginBG} alt="Login-bg-image" />
            </div>

            {/* Login Form Container */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    type: "keyframes",

                }}
                className="flex flex-col gap-4 mx-auto py-8">
                {/* Heading */}
                <div>
                    <h1 className="text-red-500 text-xl font-bold">Create Your Account</h1>
                    <p className="text-gray-100 font-medium text-xs">Welcome! Sign up to start shopping</p>
                </div>

                <div className="flex flex-col gap-4 mx-auto w-72">
                    {/* Email Input with Floating Label */}
                    <div className="inputContainer">
                        <input onChange={handleEmail}
                            className="inputStyle bg-transparent outline-none border-b-2 border-orange-300 p-2 "
                            type="email"
                            id="email"
                            required
                            placeholder=""
                            style={{ width: "100%" }}
                        />
                        <label htmlFor="email" className="labelStyle text-orange-300">Email</label>
                        {emailAlert && <p className="text-xs text-red-500">Please enter a valid email address</p>}
                        {<p className="text-xs text-red-500">User already exists. Please login!</p>}
                    </div>

                    {/* Password Input with Floating Label */}
                    <div className="inputContainer">
                        <input onChange={handlePass}
                            className="inputStyle bg-transparent outline-none border-b-2 border-orange-300 p-2"
                            type="password"
                            id="password"
                            required
                            placeholder=""
                        />
                        <label htmlFor="password" className="labelStyle text-orange-300">Password</label>
                        {passwordAlert && <p className="text-xs text-red-500">At least 8 characters, including a number and a special character</p>}
                    </div>
                    {/* Confirm Password */}
                    <div className="inputContainer">
                        <input onChange={handleConfirmPass}
                            className="inputStyle bg-transparent outline-none border-b-2 border-orange-300 p-2"
                            type="password"
                            id="confirm-password"
                            required
                            placeholder=""
                        />
                        <label htmlFor="confirm-password" className="labelStyle text-orange-300">Confirm Password</label>
                        {confirmAlert && <p className="text-xs text-red-500">Password and Confirm Password not match</p>}
                    </div>
                    <div className="bg-red-600 w-fit text-white font-medium px-5 py-2 rounded-lg">
                        <button>Submit</button>
                    </div>

                    <div>
                        <p className="text-xs text-white text-center mt-6">Already have an account? <button onClick={hanldeLogin} className="font-medium text-red-600">Login</button></p>
                    </div>
                </div>
            </motion.div>
            {/* Footer Image Container */}
            <div>
                <img className="rounded-b-xl" src={FooterImg} alt="Login-bg-image" />
            </div>
        </div>
    )
}