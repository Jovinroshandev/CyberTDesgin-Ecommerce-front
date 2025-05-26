import { useLocation,useNavigate } from "react-router-dom"
import { motion } from "framer-motion";
import { useState } from "react";
import LoginLayout from "../components/loginlayout";
import axios from "axios";

export default function SetPassword() {
    const [password, setPass] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordAlert, setPassAlert] = useState(false)
    const [confirmAlert, setConfirmAlert] = useState(false);
    const [accountStatus,setAccountStatus] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const backendAPI = process.env.REACT_APP_BACKEND_URI || "http://localhost:5000"
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

    const handleSubmit = ()=>{
        const {email} = location.state || {} //use empty object for error handle
        if (email.length !== 0 && password.length !== 0) {
            axios.post(`${backendAPI}/create-user`, { email, password })
                .then((data) => {
                    if (data.data.success) {
                        setAccountStatus(true) // Enable Account creation success notifiv=cation
                        setPass("") // clear password in input field
                        setConfirmPassword("") // clear confirm password in input field
                        setTimeout(() => navigate("/home"), 3000); // After 3s redirect to home page
                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert("Something went wrong. Please try again!");
                });
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
                    <h1 className="text-yellow-500  text-xl font-bold">Set Password</h1>
                    <p className="text-gray-100 font-medium text-xs">Set password to login</p>
                </div>

                <div className="flex flex-col gap-8 mx-auto w-72">
                    {/* Password Input with Floating Label */}
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
                        {passwordAlert && <p className="text-xs text-red-500">At least 8 characters, including a number and a special character</p>}
                    </div>
                    {/* Confirm Password */}
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
                    {/* SignUp Button*/}
                    <div className="flex justify-between mb-56">
                        <div className="bg-gray-800 w-fit text-white font-medium px-5 py-2 rounded-lg">
                            <button onClick={handleSubmit}>Login</button>
                        </div>
                        {/* notification */}
                        {accountStatus &&<motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                type: "keyframe",
                                stiffness: 300
                            }}
                            className="text-green-300 text-xs py-2 rounded-lg">
                            <p>Account Created Successfully! <i className="fa-regular fa-circle-check" /></p>
                        </motion.div>}
                    </div>
                    

                    
                </div>
            </motion.div>
        </LoginLayout>
    )
}