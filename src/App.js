import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import Products from "./pages/products"
import Checkout from "./pages/checkout"
import Cards from "./pages/cards-page"
import Login from "./pages/login"
import Signup from "./pages/signup"
import SetPassword from "./pages/setpassword"

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/set-password" element={<SetPassword/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/cards" element={<Cards/>}/>
      </Routes>
    </BrowserRouter>
  )
}