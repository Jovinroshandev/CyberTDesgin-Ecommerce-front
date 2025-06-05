import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import ProfileImage from "../assets/image/profile.png";
import { useNavigate } from "react-router-dom";
export default function Profile({ setActiveMenu }) {
  const [email, setEmail] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  // Email edit states
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState("");

  // Password change states
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passChangeMsg, setPassChangeMsg] = useState("");
  const [passChangeAlertMsg, setPassChangeAlertMsg] = useState("");

  const backendAPI = process.env.REACT_APP_BACKEND_URI || "http://localhost:5000";
  useEffect(() => {
    let timeout;
    if (passChangeMsg) {
      timeout = setTimeout(() => {
        setPassChangeMsg("");
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [passChangeMsg]);

  useEffect(() => {
    setActiveMenu("Profile");
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const user = jwtDecode(token);
        setEmail(user.email);
        setUserData(user);
        setTempEmail(user.email);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [setActiveMenu]);

  const handleSaveEmail = async () => {
    try {
      const response = await axios.put(`${backendAPI}/update-email`, {
        oldEmail: email,
        newEmail: tempEmail,
      });

      setEmail(tempEmail);
      setIsEditingEmail(false);
      alert(response.data.message);
      localStorage.removeItem("accessToken")
      navigate("/")
    } catch (error) {
      console.error("Failed to update email", error);
      alert(error.response?.data?.message || "Email update failed");
    }
  };


  const handleChangePassword = async () => {
    setPassChangeAlertMsg("");
    setPassChangeMsg("");

    if (!oldPassword || !newPassword) {
      setPassChangeAlertMsg("Please fill all password fields.");
      return;
    }

    try {
      const response = await axios.put(`${backendAPI}/change-password`, {
        email,
        oldPassword,
        newPassword,
      });

      setPassChangeMsg(response.data.message || "Password changed successfully");
      setIsChangingPass(false);
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Password change error:", error);

      if (error.response) {
        const { status, data } = error.response;
        const msg = data?.message;

        switch (status) {
          case 400:
            setPassChangeAlertMsg(msg || "All fields are required.");
            break;
          case 401:
            setPassChangeAlertMsg(msg || "Old password is incorrect.");
            break;
          case 404:
            setPassChangeAlertMsg(msg || "User not found.");
            break;
          case 500:
            setPassChangeAlertMsg(msg || "Server error. Please try again.");
            break;
          default:
            setPassChangeAlertMsg(msg || "An unexpected error occurred.");
        }
      } else if (error.request) {
        setPassChangeAlertMsg("No response from server. Check your network connection.");
      } else {
        setPassChangeAlertMsg(`Error: ${error.message}`);
      }
    }
  };

  const handleLogout = ()=>{
    localStorage.removeItem("accessToken")
    navigate("/")
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-pink-100 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <div className="bg-indigo-100 rounded-full mr-4">
          <img className="w-24" src={ProfileImage} alt="Profile" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-pink-500">User Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Email Edit */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <h2 className="text-lg font-semibold text-pink-500 mb-4">Account Information</h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4">
            <div className="mb-2 sm:mb-0">
              <label className="block text-sm font-medium text-gray-500">Email Address</label>
              {isEditingEmail ? (
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                <p className="text-gray-900 font-medium">{email}</p>
              )}
            </div>
            {isEditingEmail ? (
              <button
                onClick={handleSaveEmail}
                disabled={tempEmail === email}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditingEmail(true)}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <h2 className="text-lg font-semibold text-pink-500 mb-4">Change Password</h2>

          {isChangingPass ? (
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-500">Old Password</label>
                <div className="flex items-center mt-1">
                  <input
                    type={showOldPass ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {showOldPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">New Password</label>
                <div className="flex items-center mt-1">
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {showNewPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>


              <div className="flex space-x-4">
                <button
                  onClick={handleChangePassword}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
                >
                  Save Password
                </button>
                <button
                  onClick={() => {
                    setIsChangingPass(false);
                    setOldPassword("");
                    setNewPassword("");
                    setPassChangeMsg("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsChangingPass(true)}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Change Password
            </button>
          )}
        </div>
        {passChangeMsg && (
          <p className="text-sm text-red-600 ml-5">{passChangeMsg}</p>
        )}

        {/* Additional Info */}
        {userData && (
          <div className="bg-gray-50 p-5 rounded-lg">
            <h2 className="text-lg font-semibold text-pink-500 mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Account Type</label>
                <p className="text-gray-900 font-medium capitalize">{userData.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Member Since</label>
                <p className="text-gray-900 font-medium">
                  {new Date(userData.iat * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <button onClick={handleLogout} className="bg-pink-500 text-white font-medium px-6 py-2 rounded-lg">Logout <i className="fa-solid fa-right-to-bracket" /></button>
        </div>
      </div>
    </div>
  );
}
