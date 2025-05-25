import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion";
import { useState } from "react";
import LoginLayout from "../components/loginlayout";
import axios from "axios";
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../firebase"

export default function Signup() {
    const navigate = useNavigate();
    // redirect to login page
    const handleLogin = () => navigate("/")
    const [email, setEmail] = useState("")
    const [password, setPass] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [emailAlert, setEmailAlert] = useState(false);
    const [passwordAlert, setPassAlert] = useState(false)
    const [confirmAlert, setConfirmAlert] = useState(false);
    const [userExistAlert, setUserExistAlert] = useState(false)
    const [successAlert, setSuccessAlert] = useState(false)
    const [googleAlert, setGoogleAlert] = useState(false)
    const backendAPI = process.env.REACT_APP_BACKEND_URI || "http://localhost:5000"

    const validate = (email) => {
        // validate using regax pattern
        const regexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexPattern.test(email)
    }

    const handleEmail = (e) => {
        const { value } = e.target;
        setEmail(value);

        // Validate Email
        if (value.length !== 0 && !validate(value)) {
            setEmailAlert(true)
        }
        else {
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
        setConfirmPassword(value)
        // Check Password and Confirm Password are Same or not
        if (password.length !== 0 && value.length !== 0 && value !== password) {
            setConfirmAlert(true);
        } else {
            setConfirmAlert(false);
        }
    };

    const handleSubmit = () => {
        if (email.length !== 0 && password.length !== 0) {
            const user_api = process.env.REACT_APP_DB_URI||"http://localhost:5000"
            axios.post(`${user_api}/create-user`, { email, password })
                .then((data) => {
                    if (!data.data.success) {
                        setUserExistAlert(true);
                        setTimeout(() => setUserExistAlert(false), 3000); // hide after 3s
                    } else {
                        setSuccessAlert(true)
                        setEmail("")
                        setPass("")
                        setConfirmPassword("")
                        setTimeout(() => navigate("/"), 3000); // After 3s redirect to login/home
                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert("Something went wrong. Please try again!");
                });
        }
    };

    const handleGoodleLogin = async () => {
        setGoogleAlert(false)
        try {
            const result = await signInWithPopup(auth, provider)
            const user = result.user;
            const email = user.email;
            const response = await axios.post(`${backendAPI}/google-signup`, { email })
            const data = response.data
            if (!data.success) {
                setGoogleAlert(true)
            }
            else {
                setGoogleAlert(false)
                navigate("/set-password",{state:{email:email}}) // go to set-password page for need password account creation
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
                className="relative flex flex-col gap-8 mx-auto py-4">


                {/* Heading */}
                <div>
                    <h1 className="text-red-500 text-xl font-bold">Create Your Account</h1>
                    <p className="text-gray-100 font-medium text-xs">Welcome! Sign up to start shopping</p>
                </div>

                <div className="flex flex-col gap-8 mx-auto w-72">
                    {/* Email Input with Floating Label */}
                    <div className="inputContainer">
                        <input onChange={handleEmail}
                            className="inputStyle bg-transparent outline-none border-b-2 border-orange-300 p-2 "
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

                    {/* Password Input with Floating Label */}
                    <div className="inputContainer">
                        <input onChange={handlePass}
                            className="inputStyle bg-transparent outline-none border-b-2 border-orange-300 p-2"
                            type="password"
                            id="password"
                            required
                            value={password}
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
                            value={confirmPassword}
                            required
                            placeholder=""
                        />
                        <label htmlFor="confirm-password" className="labelStyle text-orange-300">Confirm Password</label>
                        {confirmAlert && <p className="text-xs text-red-500">Password and Confirm Password not match</p>}
                    </div>
                    {/* SignUp Button*/}
                    <div className="flex justify-between">
                        <div className="bg-red-600 w-fit text-white font-medium px-5 py-2 rounded-lg">
                            <button onClick={handleSubmit}>Signup</button>
                        </div>
                        {/* notification */}
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
                        {userExistAlert && <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 5,
                                duration:0.3

                            }}
                            className="text-red-500 text-xs py-2 rounded-lg">
                            <p>Email id already exists. Please Login</p>
                        </motion.div>}
                    </div>

                    <div className="flex items-center">
                        <div className="flex-grow bg-orange-300 h-px" />
                        <span className="mx-4 text-orange-300">OR</span>
                        <div className="flex-grow bg-orange-300 h-px" />
                    </div>
                    {/* Google Signin Button */}
                    <div className="flex flex-col items-center">
                        <div className="flex justify-center">
                            <button
                                onClick={handleGoodleLogin}
                                className="text-orange-600 font-medium bg-white w-fit px-4 py-2 rounded-full">
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
                    <div>
                        <p className="text-xs text-white text-center mt-6">Already have an account? <button onClick={handleLogin} className="font-medium text-red-600">Login</button></p>
                    </div>
                </div>
            </motion.div>
        </LoginLayout>
    )
}