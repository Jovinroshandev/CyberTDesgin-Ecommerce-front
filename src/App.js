import { BrowserRouter, Routes, Route , useLocation} from "react-router-dom"
import Home from "./pages/home"
import Products from "./pages/products"
import Checkout from "./pages/checkout"
import Cards from "./pages/cards-page"
import Login from "./pages/login"
import Signup from "./pages/signup"
import SetPassword from "./pages/setpassword"
import Profile from "./pages/profile"
import { useState } from "react"
import Navbar from "./components/navbar"

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

        {/* Pages that require dynamic active menu tracking */}
        <Route path="/home" element={<Home setActiveMenu={setActiveMenu}/>}/> 
        <Route path="/profile" element={<Profile setActiveMenu={setActiveMenu}/>}/>
        <Route path="/products" element={<Products setActiveMenu={setActiveMenu}/>}/>
        <Route path="/checkout" element={<Checkout setActiveMenu={setActiveMenu}/>}/>
        <Route path="/view-card" element={<Cards setActiveMenu={setActiveMenu}/>}/>
      </Routes>
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