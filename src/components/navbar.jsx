// Import required modules and components
import Logo from "../assets/image/logo.png"; // Logo image
import { useNavigate } from "react-router-dom"; // Navigation hook
import { useState, useEffect, useRef } from "react"; // React hooks
import { motion } from "framer-motion";  // For animations

// Navbar component 
export default function Navbar({ activeMenu }) {
    const [sideNav, setSideNav] = useState(false);  // State to control sidebar visibility
    const sideNavRef = useRef(null); // Ref to detect clicks outside sidebar
    const navigate = useNavigate(); // Hook to navigate between routes

    // Close sidebar if user clicks outside it
    useEffect(() => {
        function handleClickOutside(event) {
            if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
                setSideNav(false); // Close sidebar
            }
        }
        // Add event listener only if sidebar is open
        if (sideNav) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        // Cleanup event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [sideNav]);

    // Active and non-active button styles
    const activeBtn = "bg-pink-200 text-pink-900 px-5 py-1 rounded-full";
    const nonActiveBtn = "bg-pink-800 text-pink-100 px-5 py-1 rounded-full";

    // Navigation button details
    const MenuDetail = [
        { btnname: "Home", navigator: "/home" ,icon:"fa-solid fa-house-chimney"},
        { btnname: "Profile", navigator: "/profile" ,icon:"fa-solid fa-user"},
        { btnname: "Products", navigator: "/products",icon:"fa-solid fa-bag-shopping" },
        { btnname: "Card", navigator: "/view-card" ,icon:"fa-solid fa-cart-shopping"},
    ];

    // Function to generate navigation buttons
    const MenuBtn = () => {
        return MenuDetail.map((item) => (
            <button
                key={item.navigator}
                onClick={() => {
                    navigate(item.navigator)
                    setSideNav(false); // close menu after navigation
                }}
                aria-label={`Navigate to ${item.btnname}`}
                className={item.btnname === activeMenu ? activeBtn : nonActiveBtn}
            >
                <div className="flex  items-center gap-2">
                    <i className={item.icon}></i>
                    {item.btnname}
                </div>
            </button>
        ));
    };

    // Navbar layout
    return (
        <div className="sticky top-0 z-50 flex justify-between items-center py-1 px-3 md:py-3 md:px-8 lg:px-16 bg-pink-700">
             {/* Logo */}
            <div>
                <img className="w-20" src={Logo} alt="Logo" />
            </div>

             {/* Hamburger menu for mobile */}
            <div className="md:hidden">
                <button aria-label="Open Menu" onClick={() => setSideNav(true)}>
                    <i className="text-white fa-solid fa-bars"></i>
                </button>
            </div>

            {/* Menu buttons for desktop */}
            <div className="hidden md:flex gap-4">
                <MenuBtn />
            </div>

            {/* Sidebar for mobile */}
            {sideNav && (
                <motion.div
                    initial={{opacity:0,x:50}}
                    animate={{opacity:1,x:0}}
                    transition={{
                        type:"tween",
                        duration:0.4
                    }}
                    ref={sideNavRef}
                    className="absolute flex flex-col gap-4 h-screen top-0 right-0 bg-pink-900 text-white px-8 py-5 z-50"
                >
                    {/* Close button inside sidebar */}
                    <button aria-label="Close Menu" onClick={() => setSideNav(false)}>
                        <i className="absolute top-3 right-3 text-lg fa-solid fa-circle-xmark"></i>
                    </button>

                    {/* Sidebar menu buttons */}
                    <MenuBtn />
                </motion.div>
            )}
        </div>
    );
}
