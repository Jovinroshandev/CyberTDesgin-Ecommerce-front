import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion";
import { useState } from "react";
import LoginLayout from "../components/loginlayout";
import axios from "axios";
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, provider } from "../firebase"



export default function Login() {

    const navigate = useNavigate();
    
    const handleSignup = () => navigate("/signup") //switch to signup page
    const [email, setEmail] = useState("") //hold email value
    const [password, setPassword] = useState("") //hold password value
    const [emailAlert, setEmailAlert] = useState(false)
    const [passAlert, setPasssAlert] = useState(false)
    const [googleAlert, setGoogleAlert] = useState(false)
    const backendAPI = process.env.REACT_APP_BACKEND_URI || "http://localhost:5000"
    const handleLogin = () => {
        axios.post(`${backendAPI}/login`, { email, password })
            .then((response) => {
                const data = response.data;
                if (!data.success) {
                    // Check user email id is exist or not
                    if (data.error === "User not exists!") {
                        setEmailAlert(true) //Show alert wrong email message
                    } else if (data.error === 'Incorrect password!') {
                        setPasssAlert(true) //show wrong password message
                    }
                } else {
                    navigate("/home") // email id and password correct means switch to home screen
                }
            }).catch((error) => {
                console.error(error);
                alert("Something went wrong. Please try again!");
            });
    }

    const handleGoogleLogin = async () => {
        setGoogleAlert(false)
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        try {
            const result = await signInWithPopup(auth, provider)
            const user = result.user;
            const email = user.email;
            const response = await axios.post(`${backendAPI}/google-login`, { email })
            const data = response.data
            if (!data.success) {
                setGoogleAlert(true)
            }
            else {
                setGoogleAlert(false)
                navigate("/home")
            }
        }
        catch (error) {
            console.error("Google Login Failed:", error);
            alert("Google login failed. Please try again.");
        }
    }
    
    return (
        <LoginLayout>
            {/* Login Form Container */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    type: "keyframes",

                }}
                className="flex flex-col gap-8 mx-auto py-4">
                {/* Heading */}
                <div>
                    <h1 className="text-yellow-500 text-xl md:text-3xl font-bold">Login</h1>
                    <p className="text-gray-100 font-medium text-xs md:text-sm">Please Login to continue shopping</p>
                </div>

                <div className="flex flex-col gap-8 mx-auto w-72">
                    {/* Email Input with Floating Label */}
                    <div className="inputContainer">
                        <input
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setEmailAlert(false); //reset alert msg
                            }}
                            className="inputStyle text-white bg-transparent outline-none border-b-2 border-orange-300"
                            type="email"
                            id="email"
                            required
                            placeholder=""
                            style={{ width: "100%" }}
                        />
                        <label htmlFor="email" className="labelStyle text-orange-300">Email</label>
                        {/* Email Alert Message */}
                        {emailAlert && <p className="text-xs text-red-500">User not exists. Kindly create a account</p>}
                    </div>

                    {/* Password Input with Floating Label */}
                    <div className="inputContainer">
                        <input
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setPasssAlert(false) //reset alert msg
                            }}
                            className="inputStyle text-white bg-transparent outline-none border-b-2 border-orange-300"
                            type="password"
                            id="password"
                            required
                            placeholder=""
                        />
                        <label htmlFor="password" className="labelStyle text-orange-300">Password</label>
                        {/* Password Alert Message */}
                        {passAlert && <p className="text-xs text-red-500">Incorrect password. Please try again!</p>}
                    </div>
                    <div className="bg-gray-800 w-fit text-white font-medium px-5 py-2 rounded-lg">
                        <button onClick={handleLogin}>Login</button>
                    </div>

                    <div className="flex items-center">
                        <div className="flex-grow bg-pink-400 h-px" />
                        <span className="mx-4 text-pink-400">OR</span>
                        <div className="flex-grow bg-pink-400 h-px" />
                    </div>
                    {/* Google Signin  Button */}
                    <div className="flex flex-col items-center">
                        <div className="flex justify-center">
                            <button
                                onClick={handleGoogleLogin}
                                className="text-pink-600 font-medium bg-white w-fit px-4 py-2 rounded-full">
                                <i className="fa-brands fa-google" /> Login with Google
                            </button>
                        </div>
                        {googleAlert && <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 5,
                                duration: 0.3

                            }}
                            className="text-red-500 text-xs py-2 rounded-lg">
                            <p>Email id already exists. Please Login</p>
                        </motion.div>}
                    </div>
                    

                    <div className="mb-16 md:mb-0">
                        <p className="text-sm text-white text-center">Don't have an account? <button onClick={handleSignup} className="font-medium text-[#ffbb73]">Create an Account</button></p>
                    </div>
                </div>
            </motion.div>
        </LoginLayout>

    )
}