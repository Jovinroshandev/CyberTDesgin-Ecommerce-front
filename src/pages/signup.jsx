import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion";
import { useState } from "react";
import LoginLayout from "../components/loginlayout";
import axios from "axios";
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../firebase"

export default function Signup() {
    const navigate = useNavigate();

    // Redirect to login page
    const handleLogin = () => navigate("/")

    // Input states
    const [email, setEmail] = useState("")
    const [password, setPass] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // Validation alert states
    const [emailAlert, setEmailAlert] = useState(false);
    const [passwordAlert, setPassAlert] = useState(false)
    const [confirmAlert, setConfirmAlert] = useState(false);
    const [userExistAlert, setUserExistAlert] = useState(false)
    const [successAlert, setSuccessAlert] = useState(false)
    const [googleAlert, setGoogleAlert] = useState(false)
    const [loading, setLoading] = useState(false);

    // API URL (fallback to localhost if env var is not set)
    const backendAPI = process.env.REACT_APP_BACKEND_URI || "http://localhost:5000"

    // Regex email validation
    const validate = (email) => {
        const regexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexPattern.test(email)
    }

    // Handle email input change and validate
    const handleEmail = (e) => {
        const { value } = e.target;
        setEmail(value);
        // Validate Email
        setEmailAlert(value.length !== 0 && !validate(value));
    }

    // Handle password input change and validate length
    const handlePass = (e) => {
        const value = e.target.value;
        setPass(value);
        const strongPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        setPassAlert(value.length > 0 && !strongPassword.test(value));
    };



    // Handle confirm password and match with original password
    const handleConfirmPass = (e) => {
        const { value } = e.target;
        setConfirmPassword(value)
        // Check Password and Confirm Password are Same or not
        setConfirmAlert(password.length !== 0 && value.length !== 0 && value !== password);
    };

    // Handle form submission for signup
    const handleSubmit = () => {
        if (email.length === 0 || password.length === 0 || confirmPassword.length === 0) return;
        if (emailAlert || passwordAlert || confirmAlert) return;

        setLoading(true); // start loading

        const user_api = process.env.REACT_APP_BACKEND_URI || "http://localhost:5000";

        axios.post(`${user_api}/create-user`, { email, password })
            .then((data) => {
                setLoading(false); // done loading

                if (!data.data.success) {
                    setUserExistAlert(true);
                    setTimeout(() => setUserExistAlert(false), 3000);
                } else {
                    setSuccessAlert(true);
                    setEmail("");
                    setPass("");
                    setConfirmPassword("");
                    setTimeout(() => navigate("/"), 3000);
                }
            })
            .catch((error) => {
                setLoading(false); // done loading even on error
                console.error(error);
                alert("Something went wrong. Please try again!");
            });
    };



    // Handle Google Sign-in with Firebase
    const handleGoogleLogin = async () => {
        setGoogleAlert(false)
        try {
            const result = await signInWithPopup(auth, provider)
            const user = result.user;
            const email = user.email;
            const response = await axios.post(`${backendAPI}/google-signup`, { email })
            const data = response.data
            if (!data.success) {
                // Alert if email exists
                setGoogleAlert(true)
            }
            else {
                setGoogleAlert(false)
                // Navigate to set-password page with email
                navigate("/set-password", { state: { email: email } })
            }
        }
        catch (error) {
            console.error("Google Login Failed:", error);
            alert("Google login failed. Please try again.");
        }
    }
    return (
        <LoginLayout>
            {/* Animated Signup Form Container */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    type: "keyframes",

                }}
                className="relative flex flex-col gap-8 mx-auto py-4">


                {/* Signup Page Header */}
                <div>
                    <h1 className="text-yellow-500 text-xl font-bold">Create Your Account</h1>
                    <p className="text-gray-100 font-medium text-xs">Welcome! Sign up to start shopping</p>
                </div>

                {/* Input Fields and Actions */}
                <div className="flex flex-col gap-8 mx-auto w-72">
                    {/* Email Input*/}
                    <div className="inputContainer">
                        <input onChange={handleEmail}
                            className="inputStyle text-white bg-transparent outline-none border-b-2 border-orange-300 p-2 "
                            type="email"
                            id="email"
                            required
                            value={email}
                            placeholder=""
                            style={{ width: "100%" }}
                        />
                        <label htmlFor="email" className="labelStyle text-orange-300">Email</label>
                        {emailAlert && <p className="text-xs text-red-500">Please enter a valid email address</p>}
                    </div>

                    {/* Password Input */}
                    <div className="inputContainer">
                        <input onChange={handlePass}
                            className="inputStyle text-white bg-transparent outline-none border-b-2 border-orange-300 p-2"
                            type="password"
                            id="password"
                            required
                            value={password}
                            placeholder=""
                        />
                        <label htmlFor="password" className="labelStyle text-orange-300">Password</label>
                        {passwordAlert && <p className="text-xs text-red-500"> Password must be at least 8 characters, include a number and a special character</p>}

                    </div>
                    {/* Confirm Password Input */}
                    <div className="inputContainer">
                        <input onChange={handleConfirmPass}
                            className="inputStyle text-white bg-transparent outline-none border-b-2 border-orange-300 p-2"
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            required
                            placeholder=""
                        />
                        <label htmlFor="confirm-password" className="labelStyle text-orange-300">Confirm Password</label>
                        {confirmAlert && <p className="text-xs text-red-500">Password and Confirm Password not match</p>}
                    </div>

                    {/* Signup Button and Notifications */}
                    <div className="flex justify-between">
                        <div className="bg-gray-800 w-fit text-white font-medium px-5 py-2 rounded-lg">
                            <button onClick={handleSubmit} disabled={loading}>
                                {loading ? "Signing up..." : "Signup"}
                            </button>

                        </div>

                        {/* Success Alert */}
                        {successAlert && <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                type: "keyframe",
                                stiffness: 300
                            }}
                            className="text-green-300 text-xs py-2 rounded-lg">
                            <p>Account Created Successfully! <i className="fa-regular fa-circle-check" /></p>
                        </motion.div>}

                        {/* User Already Exists Alert */}
                        {userExistAlert && <motion.div
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

                    {/* Divider */}
                    <div className="flex items-center">
                        <div className="flex-grow bg-pink-400 h-px" />
                        <span className="mx-4 text-pink-400">OR</span>
                        <div className="flex-grow bg-pink-400 h-px" />
                    </div>

                    {/* Google Signin Button */}
                    <div className="flex flex-col items-center">
                        <div className="flex justify-center">
                            <button
                                onClick={handleGoogleLogin}
                                className="text-pink-600 font-medium bg-white w-fit px-4 py-2 rounded-full">
                                <i className="fa-brands fa-google" /> Signup with Google
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

                    {/* Redirect to Login */}
                    <div>
                        <p className="text-sm text-white text-center">Already have an account? <button onClick={handleLogin} className="font-medium text-[#ffbb73]">Login</button></p>
                    </div>
                </div>
            </motion.div>
        </LoginLayout>
    )
}