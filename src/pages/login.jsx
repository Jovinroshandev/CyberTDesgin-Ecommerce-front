// Import required hooks, libraries and components
import { useNavigate } from "react-router-dom" // Navigation hook for route redirection
import { motion } from "framer-motion"; // For animations
import { useState } from "react"; // React state hook
import LoginLayout from "../components/loginlayout"; // Custom layout component for login page
import axios from "axios"; // HTTP client for API requests
import { signInWithPopup } from "firebase/auth" // Firebase method for Google sign-in popup
import { auth, provider } from "../firebase"  // Firebase authentication and provider config


// Login component
export default function Login() {
    const navigate = useNavigate(); // Initialize navigation

    // Navigation handler for signup page
    const handleSignup = () => navigate("/signup")

    // State variables for form inputs and alerts
    const [email, setEmail] = useState(""); // Email input state
    const [password, setPassword] = useState(""); // Password input state
    const [emailAlert, setEmailAlert] = useState(false); // Email error alert
    const [passAlert, setPasssAlert] = useState(false); // Password error alert
    const [googleAlert, setGoogleAlert] = useState(false); // Google login alert

    // Backend API base URL (fallbacks to localhost)
    const backendAPI = process.env.REACT_APP_BACKEND_URI || "http://localhost:5000" // live Backend API URI not exists in env means local Backend API URI run
    
     // Handle login with email and password
    const handleLogin = () => {
        axios.post(`${backendAPI}/login`, { email, password })
            .then((response) => {
                const data = response.data;
                if (!data.success) {
                    // Show appropriate alert based on backend error response
                    if (data.error === "User not exists!") {
                        setEmailAlert(true) //Show alert wrong email message
                    } else if (data.error === 'Incorrect password!') {
                        setPasssAlert(true) //show wrong password message
                    }
                } else {
                    // Successful login, navigate to home page
                    navigate("/home")
                }
            }).catch((error) => {
                console.error(error);
                alert("Something went wrong. Please try again!");
            });
    }

    // Handle Google login
    const handleGoogleLogin = async () => {
        setGoogleAlert(false)  // Reset alert
        try {
            const result = await signInWithPopup(auth, provider) // Google sign-in popup
            const user = result.user;
            const email = user.email;
            const response = await axios.post(`${backendAPI}/google-login`, { email })
            const data = response.data
            if (!data.success) {
                setGoogleAlert(true) // Show alert if email not found
            }
            else {
                setGoogleAlert(false)
                navigate("/home")  // Navigate to home on success
            }
        }
        catch (error) {
            console.error("Google Login Failed:", error);
            alert("Google login failed. Please try again.");
        }
    }
    // Component render
    return (
        <LoginLayout>
            {/* Animated container */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    type: "keyframes",

                }}
                className="flex flex-col gap-8 mx-auto py-4">
                {/* Login Heading */}
                <div>
                    <h1 className="text-yellow-500 text-xl md:text-3xl font-bold">Login</h1>
                    <p className="text-gray-100 font-medium text-xs md:text-sm">Please Login to continue shopping</p>
                </div>

                <div className="flex flex-col gap-8 mx-auto w-72">
                     {/* Email input field */}
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
                        {/* Email error alert */}
                        {emailAlert && <p className="text-xs text-red-500">User not exists. Kindly create a account</p>}
                    </div>

                    {/* Password input field */}
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
                        {/* Password error alert */}
                        {passAlert && <p className="text-xs text-red-500">Incorrect password. Please try again!</p>}
                    </div>
                    <div className="bg-gray-800 w-fit text-white font-medium px-5 py-2 rounded-lg">
                        <button onClick={handleLogin}>Login</button>
                    </div>
                    
                    {/* Divider */}
                    <div className="flex items-center">
                        <div className="flex-grow bg-pink-400 h-px" />
                        <span className="mx-4 text-pink-400">OR</span>
                        <div className="flex-grow bg-pink-400 h-px" />
                    </div>

                    {/* Google login button */}
                    <div className="flex flex-col items-center">
                        <div className="flex justify-center">
                            <button
                                onClick={handleGoogleLogin}
                                className="text-pink-400 font-medium bg-white w-fit px-4 py-2 rounded-full">
                                <i className="fa-brands fa-google" /> Login with Google
                            </button>
                        </div>
                        {/* Google login alert */}
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
                            <p>Email not exists. Please create account</p>
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