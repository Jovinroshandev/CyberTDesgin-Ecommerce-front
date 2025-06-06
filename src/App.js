// Import necessary modules and components
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

// Importing pages
import Home from "./pages/home";
import Products from "./pages/products";
import Cards from "./pages/cart-page";
import Login from "./pages/login";
import Signup from "./pages/signup";
import SetPassword from "./pages/setpassword";
import Profile from "./pages/profile";
import AdminManage from "./pages/adminpage";
import OrderPage from "./pages/order_page";
import ProductDetails from "./pages/product-details";

// Importing shared UI components
import Navbar from "./components/navbar";
import Footer from "./components/footer";

/**
 * PrivateRoute component to protect routes based on authentication and role.
 * - Checks for valid JWT in localStorage.
 * - Decodes the token to verify user role if specified.
 * - Redirects unauthorized users or missing tokens to appropriate pages.
 * 
 * @param {ReactNode} children - The component to render if authorized.
 * @param {string} role - Optional role requirement (e.g., 'user', 'admin').
 * @returns {ReactNode} - Rendered children if authorized; otherwise a redirect.
 */
export function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("accessToken");

  // Redirect if token is missing
  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token); // Decode token to get role

    // Redirect if user role does not match required role
    if (role && decoded.role !== role) {
      return <Navigate to="/unauthorized" />;
    }

    // Authorized access
    return children;
  } catch (error) {
    // If token is invalid or expired, clear it and redirect to login
    localStorage.removeItem("accessToken");
    return <Navigate to="/" />;
  }
}

/**
 * AppContent component manages the main route rendering and conditional layout
 * - Uses `useLocation()` to determine which routes should hide the Navbar/Footer.
 * - Passes `setActiveMenu()` to sub-pages to dynamically highlight navbar links.
 */
function AppContent() {
  const [activeMenu, setActiveMenu] = useState("Home"); // Track active navigation menu item
  const location = useLocation(); // Access current route path

  
  // Routes where Navbar and Footer should be hidden (typically auth pages)
  const hideNavRoutes = ["/", "/signup", "/set-password"];
  const showNavRoutes = !hideNavRoutes.includes(location.pathname); // Show navbar/footer conditionally

  return (
    <>
      {/* Conditionally render Navbar if not on hidden routes */}
      {showNavRoutes && <Navbar activeMenu={activeMenu} />}

      {/* Define application routes and route protection using PrivateRoute */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/set-password" element={<SetPassword />} />

        {/* Unauthorized access fallback */}
        <Route path="/unauthorized" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-500">401 - Unauthorized</h1>
              <p>You don't have permission to access this page.</p>
            </div>
          </div>
        } />

        {/* Private Routes: Require valid login and roles */}
        <Route path="/home" element={<PrivateRoute role="user"><Home setActiveMenu={setActiveMenu} /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute role="user"><Profile setActiveMenu={setActiveMenu}  /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute role="user"><Products setActiveMenu={setActiveMenu}  /></PrivateRoute>} />
        <Route path="/view-cart" element={<PrivateRoute role="user"><Cards setActiveMenu={setActiveMenu} /></PrivateRoute>} />
        <Route path="/product-details" element={<PrivateRoute role="user"><ProductDetails /></PrivateRoute>}/>
        <Route path="/admin" element={<PrivateRoute role="admin"><AdminManage setActiveMenu={setActiveMenu} /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute role="user"><OrderPage setActiveMenu={setActiveMenu} /></PrivateRoute> } />

        {/* Fallback Route: redirect unmatched paths to login */}
        <Route path="*" element={<Navigate to="/" />} /></Routes>

      {/* Conditionally render Footer if not on hidden routes */}
      {showNavRoutes && <Footer />}
    </>
  );
}

/**
 * Root App component that wraps the entire app with BrowserRouter.
 * - Allows usage of routing hooks (like `useLocation`) in children.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
