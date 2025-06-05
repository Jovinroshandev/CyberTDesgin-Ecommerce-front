import { BrowserRouter, Routes, Route , useLocation} from "react-router-dom"
import Home from "./pages/home"
import Products from "./pages/products"
import Checkout from "./pages/checkout"
import Cards from "./pages/cart-page"
import Login from "./pages/login"
import Signup from "./pages/signup"
import SetPassword from "./pages/setpassword"
import Profile from "./pages/profile"
import { useState } from "react"
import Navbar from "./components/navbar"
import Footer from "./components/footer"
import ProductDetails from "./pages/product-details"
import AdminManage from "./pages/adminpage"
import OrderPage from "./pages/order_page"

import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token);

    if (role && decoded.role !== role) {
      return <Navigate to="/unauthorized" />;
    }
    return children;
  } catch (error) {
    localStorage.removeItem("accessToken");
    return <Navigate to="/" />;
  }
}


// AppContent component handles route rendering and navbar visibility
function AppContent(){
  const [activeMenu,setActiveMenu] = useState("Home") // Track which navbar button is active
  const location = useLocation(); // Get current route path

  // List of routes where the Navbar should be hidden (e.g. login/signup pages)
  const hideNavRoutes = ["/","/signup","/set-password"]
  const showNavRoutes = !hideNavRoutes.includes(location.pathname); // Check if current route should show navbar
  return(
    <>
      {/* Conditionally render the Navbar only if not on login/signup/set-password pages */}
      {showNavRoutes && <Navbar activeMenu={activeMenu}/>}

      {/* Define all application routes */}
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/set-password" element={<SetPassword/>}/>
        <Route path="/unauthorized" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-500">401 - Unauthorized</h1>
              <p>You don't have permission to access this page.</p>
            </div>
          </div>
        }/>
        {/* Pages that require dynamic active menu tracking */}
        <Route path="/home" element={<PrivateRoute role="user"><Home setActiveMenu={setActiveMenu}/></PrivateRoute>}/> 
        <Route path="/profile" element={<PrivateRoute role="user"><Profile setActiveMenu={setActiveMenu}/></PrivateRoute>}/>
        <Route path="/products" element={<PrivateRoute role="user"><Products setActiveMenu={setActiveMenu}/></PrivateRoute>}/>
        <Route path="/checkout" element={<Checkout setActiveMenu={setActiveMenu}/>}/>
        <Route path="/view-cart" element={<PrivateRoute role="user"><Cards setActiveMenu={setActiveMenu}/></PrivateRoute>}/>
        <Route path="/product-details" element={<PrivateRoute role="user"><ProductDetails/></PrivateRoute>}/>
        <Route path="/admin" element={<PrivateRoute role="admin"><AdminManage setActiveMenu={setActiveMenu}/></PrivateRoute>}/>
        <Route path="/orders" element={<PrivateRoute role="user"><OrderPage setActiveMenu={setActiveMenu}/></PrivateRoute>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {/* Conditionally render the Navbar only if not on login/signup/set-password pages */}
      {showNavRoutes && <Footer/>}
    </>
  )
}

// Root App component that wraps AppContent in the router
export default function App(){
  return(
    <BrowserRouter>
      <AppContent/>
    </BrowserRouter>
  )
}