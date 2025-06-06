import { useState, useEffect, useRef,useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
/**
 * AdminManage Component - Provides an admin interface to:
 * - Upload product details (image, name, description, etc.)
 * - Display the stock list
 * - Delete products from inventory
 */
export default function AdminManage({ setActiveMenu }) {
  // Set the active menu on component mount
  useEffect(() => setActiveMenu("Dashboard"), [setActiveMenu]);

  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Reference to the file input element for resetting

  // ============================== STATE MANAGEMENT ==============================
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [imageUploadStatus, setImageUploadStatus] = useState(false);
  const [imageUploadPendingStatus, setImageUploadPendingStatus] = useState(false);
  const [productPrice, setProductPrice] = useState("");
  const [file, setFile] = useState(null);
  const [screenOption, setScreenOption] = useState("");
  const [badges, setBadges] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [addProductActive, setAddProductActive] = useState(false);
  const [imageNotSelectAlert, setImageNotSelectAlert] = useState(false);
  const [imgUploadError,setImgUploadError] = useState("")
  const [imgUploadErrorAlert,setImgUploadErrorAlert] = useState(false);
  const [stockData, setStockData] = useState([]);

  const backendAPI = process.env.REACT_APP_BACKEND_URI || "http://localhost:5000";

  // ============================== IMAGE UPLOAD HANDLER ==============================
  const handleImage = async () => {
    setImageUploadPendingStatus(true);
    setImgUploadError("");
      setImgUploadErrorAlert(false);
    if (!file) return setImageNotSelectAlert(true); // Alert if no image selected

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${backendAPI}/upload`, formData);
      setImageURL(res.data.url);            // Store uploaded image URL
      setImageUploadStatus(true);           // Set upload status as success
    } catch (err) {
      setImgUploadError(err.response.data.error)
      setImgUploadErrorAlert(true)
    } finally {
      setImageUploadPendingStatus(false);
    }
  };

  // ============================== ENABLE SUBMIT BUTTON LOGIC ==============================
  useEffect(() => {
    const isReady = productName && productDesc && productPrice && imageUploadStatus && screenOption;
    setAddProductActive(isReady); // Enable Add Product only when all required fields are filled
  }, [productName, productDesc, productPrice, imageUploadStatus, screenOption]);

  // ============================== FETCH ALL STOCK DATA ==============================
 const getData = useCallback(async () => {
  try {
    const res = await axios.get(`${backendAPI}/get-data`);
    setStockData(res.data.data);
  } catch (error) {
    console.error("Error fetching stock data:", error);
  }
}, [backendAPI]);

useEffect(() => {
  getData();
}, [getData]);


  // ============================== SEND NEW PRODUCT DATA ==============================
  const handleSend = async () => {
    const token = localStorage.getItem("accessToken");
    await axios.post(`${backendAPI}/admin-management`, {
      productName, productDesc, imageURL, productPrice,
      screenOption, color, badges, category
    }, { headers: { Authorization: `Bearer ${token}` } });

    // Refresh and reset fields after successful product creation
    getData();
    setProductName(""); setProductDesc(""); setImageURL(""); setProductPrice("");
    setScreenOption(""); setBadges(""); setCategory(""); setColor(""); setFile("");
    setImageUploadStatus(false); setImageUploadPendingStatus(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ============================== DELETE PRODUCT FROM STOCK ==============================
  const handleDelete = async (id) => {
    await axios.delete(`${backendAPI}/delete-product/${id}`);
    getData(); // Refresh stock data after deletion
  };

  // ============================== UI COMPONENT: Renders stock list ==============================
  const StockContainer = () => (
    <div className="mt-10 flex flex-col gap-3">
      <h2 className="text-lg font-semibold mb-3">Stock List:</h2>
      {!stockData.length ? (
        <p>No stock data available.</p>
      ) : (
        stockData.map((stock) => (
          <div key={stock._id} className="flex bg-white gap-2 items-center px-1">
            <img className="w-20" src={stock.imageURL} alt="product" />
            <div>
              <p className="w-52 text-xs truncate">{stock.productName}</p>
              <p className="w-52 text-xs truncate">&#8377;{stock.productPrice}</p>
              <div className="flex text-xs gap-1 flex-wrap">
                {[stock.screenOption, stock.badges, stock.category].map((item, i) => (
                  <p key={i} className="px-2 py-1 rounded-xl bg-pink-500 text-white font-medium">{item}</p>
                ))}
                <p className="px-2 py-1 rounded-xl" style={{
                  backgroundColor: stock.color,
                  color: ["black", "gray"].includes(stock.color) ? "white" : "black"
                }}>{stock.color}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(stock._id)}>
              <i className="text-gray-800 fa-solid fa-trash-can" />
            </button>
          </div>
        ))
      )}
    </div>
  );

  // ============================== UI REUSABLE: Input Field ==============================
  const inputRow = (label, value, setValue, type = "text") => (
    <div className="flex justify-between">
      <p>{label}</p>
      <input placeholder={label} value={value} onChange={(e) => setValue(e.target.value)} className="border rounded-lg p-1 w-[37%] md:w-[45%]" type={type} />
    </div>
  );

  // ============================== UI REUSABLE: Select Dropdown ==============================
  const selectRow = (label, value, setValue, options) => (
    <div className="flex justify-between">
      <p>{label}</p>
      <select value={value} onChange={(e) => setValue(e.target.value)} className="border rounded-lg px-3 py-2 w-[37%] md:w-[45%] text-center">
        <option value="">Select</option>
        {options.map((o, i) => <option key={i} value={o}>{o}</option>)}
      </select>
    </div>
  );

  // ============================== MAIN RENDER ==============================
  return (
    <div className="md:mx-auto bg-pink-100 m-5 md:w-fit p-5 md:p-20">
      {/* Header Section */}
      <div className="flex justify-between md:gap-5 items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-pink-600">Admin Management</h1>
        <button
          onClick={() => { localStorage.removeItem("accessToken"); navigate("/"); }}
          className="bg-pink-500 shadow-lg text-white border-[2px] border-pink-600 px-3 py-2 rounded-xl"
        >
          <i className="fa-solid fa-right-from-bracket" /> Logout
        </button>
      </div>

      {/* Product Form */}
      <div className="flex flex-col gap-5 mt-10">
        {inputRow("Product Name", productName, setProductName)}

        {/* Product Description */}
        <div className="flex justify-between">
          <p>Product Description</p>
          <textarea
            value={productDesc}
            onChange={(e) => setProductDesc(e.target.value)}
            className="border rounded-lg p-1 w-full md:w-[58%]"
          />
        </div>

        {/* Image Upload Section */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-5 w-full">
            <p>Product Image</p>
            <label htmlFor="fileInput" className="cursor-pointer bg-white border text-pink-600 rounded-lg px-3 py-2">
              {file ? file.name : "Choose File"}
            </label>
            <input id="fileInput" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])}
              type="file" className="hidden" />
          </div>

          {/* Upload Button */}
          {!imageUploadStatus ? (
            <button onClick={handleImage} disabled={imageUploadPendingStatus}
              className={`text-xs ${imageUploadPendingStatus ? 'bg-pink-400' : 'bg-pink-600'} text-white rounded-xl px-3 py-2`}>
              <i className="fa-solid fa-cloud-arrow-up mr-1" />
              {imageUploadPendingStatus ? "Uploading..." : "Upload"}
            </button>
          ) : (
            <button disabled className="text-xs bg-green-600 text-white rounded-xl px-3 py-2">
              <i className="fa-solid fa-circle-check mr-1" /> Done
            </button>
          )}
        </div>
        {imgUploadErrorAlert && <p className="text-red-500 text-xs">{imgUploadError}</p>}

        {/* Select Dropdowns */}
        {selectRow("Screening Page", screenOption, setScreenOption, ["home", "both"])}
        {selectRow("Product Badges", badges, setBadges, ["hot", "trending", "limited stock"])}
        {selectRow("Category", category, setCategory, ["new arrivals", "best sellers", "under ₹499", "gym wear"])}
        {selectRow("Colour", color, setColor, ["black", "white", "gray", "navy", "red", "yellow", "orange", "green", "blue","brown"])}

        {/* Price and Alerts */}
        {imageNotSelectAlert && <p className="text-red-500 text-xs">Please select product image</p>}
        {inputRow("Product Price", productPrice, setProductPrice)}

        {/* Add Product Button */}
        <div className="mx-auto mt-10">
          <button onClick={handleSend} disabled={!addProductActive}
            className={`${addProductActive ? "bg-pink-500" : "bg-pink-300"} text-white px-4 py-2 rounded-lg`}>
            Add Product
          </button>
        </div>
      </div>

      {/* Product Stock List */}
      <StockContainer />
    </div>
  );
}
