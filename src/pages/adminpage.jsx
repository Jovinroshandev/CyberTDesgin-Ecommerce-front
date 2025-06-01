import { useState, useEffect,useRef } from "react"
import axios from "axios";

export default function AdminManage() {
    const fileInputRef = useRef(null);
    const [productName, setProductName] = useState("");
    const [productDesc, setProductDesc] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [imageUploadStatus, setImageUploadStatus] = useState(false)
    const [imageUploadPendingStatus, setImageUploadPendingStatus] = useState(false)
    const [productPrice, setProductPrice] = useState("");
    const [file, setFile] = useState("");
    const[screenOption,setScreenOption] = useState("")
    const[badges,setBadges] = useState("")
    const[category,setCategory] = useState("")
    const[color,setColor] = useState("")
    const [addProductActive, setAddProductActive] = useState("")
    const [imageNotSelectAlert, setImageNotSelectAlert] = useState("");
    // Backend API base URL (fallbacks to localhost)
    const backendAPI = process.env.REACT_APP_BACKEND_URI || "http://localhost:5000"
    const handleName = (e) => {
        setProductName(e.target.value)
    }
    const handleDesc = (e) => {
        setProductDesc(e.target.value)
    }
    const handleImage = async () => {
        setImageUploadPendingStatus(true)
        if (file) {
            const formData = new FormData();
            formData.append("image", file)
            try {
                const res = await axios.post(`${backendAPI}/upload`, formData);
                setImageUploadStatus(true)
                setImageURL(res.data.url)
            } catch (err) {
                console.error("Upload failed", err);
            }
        } else {
            setImageNotSelectAlert(true)
        }
    }
    const handlePrice = (e) => {
        setProductPrice(e.target.value)
    }
    useEffect(() => {
        if (productName && productDesc && productPrice && imageUploadStatus && screenOption) {
            setAddProductActive(true);
        } else {
            setAddProductActive(false);
        }
    }, [productName, productDesc, productPrice, imageUploadStatus ,screenOption]);

    const handleSend = async () => {

        await axios.post(`${backendAPI}/admin-management`, { 
            productName, 
            productDesc, 
            imageURL, 
            productPrice,
            screenOption,
            color,
            badges,
            category
         }).then((res) => {
            console.log(res.data)

        })
        // Clear file input manually
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // reset input
        }
        setProductName("");
        setProductDesc("")
        setImageURL("");
        setImageUploadStatus(false);
        setImageUploadPendingStatus(false);
        setProductPrice("");
        setScreenOption("")
        setBadges("")
        setCategory("")
        setColor("")
        setFile("");
    }
    return (
        <div className="md:mx-auto bg-pink-100 m-5 md:w-fit p-5 md:p-20">
            <h1 className="text-2xl md:text-3xl font-bold text-pink-600 md:text-center">Admin Management</h1>
            <div className="flex md:text-lg md:font-medium flex-col gap-5 md:gap-10 mt-10">
                <div className="flex justify-between items-center gap-5 md:gap-20">
                    <p>Product Name</p>
                    <input value={productName} onChange={handleName} className="border border-pink-300 rounded-lg p-1 outline-none" type="text" name="" id="" />
                </div>
                <div className="flex justify-between items-center gap-5 md:gap-20">
                    <p>Product Description</p>
                    <textarea value={productDesc} onChange={handleDesc} className="border border-pink-300 w-[54%] md:w-[58%] rounded-lg p-1 outline-none" type="text" name="" id="" />
                </div>
                <div className="flex  justify-between items-center">
                    <div>
                        <p>Product Image</p>
                        <input ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} className="py-1" type="file" name="" id="" />
                    </div>
                    {!imageUploadStatus && <div>
                        <button onClick={handleImage} className="text-xs bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-xl px-2 py-3"><i className="fa-solid fa-cloud-arrow-up" />{imageUploadPendingStatus ? "Uploading" : "Upload"}</button>
                    </div>}
                    {imageUploadStatus && <div>
                        <button disabled className="text-xs bg-green-600 hover:bg-gray-800 text-white font-medium rounded-xl px-2 py-3"><i className="fa-solid fa-circle-check" />Done</button>
                    </div>}
                </div>
                <div className="flex justify-between">
                    <p>Screening Page</p>
                    <select value={screenOption} onChange={(e)=>setScreenOption(e.target.value)} className="border focus:outline-none text-center border-pink-300 rounded-lg px-3 py-2">
                        <option value="">-- Select display Page --</option>
                        <option value="home"> Home </option>
                        <option value="both"> Both </option>
                    </select>
                </div>
                <div className="flex justify-between">
                    <p>Product Badges</p>
                    <select value={badges} onChange={(e)=>setBadges(e.target.value)} className="border focus:outline-none text-center border-pink-300 rounded-lg px-3 py-2">
                        <option value="">-- Select Product Badges --</option>
                        <option value="hot"> Hot </option>
                        <option value="trending"> Trending </option>
                        <option value="limited stock"> Limited Stock </option>
                    </select>
                </div>
                <div className="flex justify-between">
                    <p>Category</p>
                    <select value={category} onChange={(e)=>setCategory(e.target.value)} className="border focus:outline-none text-center border-pink-300 rounded-lg px-3 py-2">
                        <option value="">-- Select Product Badges --</option>
                        <option value="new arrivals"> New Arrivals </option>
                        <option value="best sellers"> Best Sellers </option>
                        <option value="under ₹499"> Under ₹499 </option>
                        <option value="gym wear"> Gym Wear </option>
                    </select>
                </div>
                <div className="flex justify-between">
                    <p>Colour</p>
                    <select value={color} onChange={(e)=>setColor(e.target.value)} className="border focus:outline-none text-center border-pink-300 rounded-lg px-3 py-2">
                        <option value="">-- Select Colour --</option>
                        <option value="black"> Black </option>
                        <option value="white"> White </option>
                        <option value="gray"> Gray </option>
                        <option value="navy"> Navy </option>
                        <option value="red"> Red </option>
                        <option value="yellow"> Yellow </option>
                        <option value="orange"> Orange </option>
                        <option value="green"> Green </option>
                        <option value="blue"> Blue </option>
                    </select>
                </div>
                {imageNotSelectAlert && <p className="text-red-500 text-xs">Please select product image</p>}
                <div className="flex  justify-between items-center gap-5 md:gap-20">
                    <p>Product Price</p>
                    <input value={productPrice} onChange={handlePrice} className="border border-pink-300 rounded-lg p-1 outline-none" type="text" name="" id="" />
                </div>
                <div className="mx-auto mt-10">
                    {addProductActive ?
                        <button onClick={handleSend} className="bg-pink-500 text-white font-medium px-4 py-2 rounded-lg">Add Product</button>
                        : <button disabled onClick={handleSend} className="bg-pink-300 text-white font-medium px-4 py-2 rounded-lg">Add Product</button>}
                </div>
            </div>
        </div>
    )
}