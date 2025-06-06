import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Library to decode JWT tokens and extract user data
import axios from "axios"; // HTTP client for API calls
import ProfileImage from "../assets/image/profile.png"; // Default profile picture
import { useNavigate } from "react-router-dom"; // For programmatic navigation between routes

export default function Profile({ setActiveMenu }) {
  // State to hold the currently logged-in user's email
  const [email, setEmail] = useState(null);

  // State to hold additional decoded user data from JWT
  const [userData, setUserData] = useState(null);

  // React Router's navigation hook to redirect users programmatically
  const navigate = useNavigate();

  // States related to editing the email address
  const [isEditingEmail, setIsEditingEmail] = useState(false); // Toggles email edit mode
  const [tempEmail, setTempEmail] = useState(""); // Holds temporary email value during editing

  // States related to password change functionality
  const [isChangingPass, setIsChangingPass] = useState(false); // Toggles password change UI
  const [oldPassword, setOldPassword] = useState(""); // Stores user input for old password
  const [newPassword, setNewPassword] = useState(""); // Stores user input for new password
  const [showOldPass, setShowOldPass] = useState(false); // Toggles visibility of old password input
  const [showNewPass, setShowNewPass] = useState(false); // Toggles visibility of new password input

  // Messages to provide feedback on password change operations
  const [passChangeAlertMsg, setPassChangeAlertMsg] = useState(""); // Error/warning message
  const [passChangeSuccessMsg, setPassChangeSuccessMsg] = useState(""); // Success message

  // Backend API base URL, configurable via environment variable or fallback to localhost
  const backendAPI = process.env.REACT_APP_BACKEND_URI || "http://localhost:5000";

  // Effect to clear password alert messages after 3 seconds automatically
  useEffect(() => {
    let timeout;
    if (passChangeAlertMsg) {
      timeout = setTimeout(() => {
        setPassChangeAlertMsg("");
      }, 3000);
    }
    return () => clearTimeout(timeout); // Cleanup timeout on component unmount or msg change
  }, [passChangeAlertMsg]);

  // Effect to clear password success messages after 3 seconds automatically
  useEffect(() => {
    let timeout;
    if (passChangeSuccessMsg) {
      timeout = setTimeout(() => {
        setPassChangeSuccessMsg("");
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [passChangeSuccessMsg]);

  // Initial effect runs once on mount:
  // 1. Sets the active menu item in the parent component to "Profile"
  // 2. Retrieves the JWT token from localStorage, decodes it, and extracts user info
  // 3. Initializes email, userData, and temporary email input with the decoded email
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

  // Handler to save updated email:
  // Sends PUT request to backend API to update email
  // On success, updates the email state, disables edit mode, alerts the user,
  // removes JWT token to force re-login with new email, and navigates to home page
  const handleSaveEmail = async () => {
    try {
      const response = await axios.put(`${backendAPI}/update-email`, {
        oldEmail: email,
        newEmail: tempEmail,
      });

      setEmail(tempEmail);
      setIsEditingEmail(false);
      alert(response.data.message);
      localStorage.removeItem("accessToken"); // Logout user after email change
      navigate("/");
    } catch (error) {
      console.error("Failed to update email", error);
      alert(error.response?.data?.message || "Email update failed");
    }
  };

  // Handler for changing user password:
  // Validates input fields, then sends PUT request with old and new passwords
  // Displays success or error messages based on backend response
  // Resets inputs and toggles UI state accordingly
  const handleChangePassword = async () => {
    // Clear any previous messages
    setPassChangeAlertMsg("");
    setPassChangeSuccessMsg("");

    // Basic client-side validation
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

      setPassChangeSuccessMsg(response.data.message || "Password changed successfully");
      setIsChangingPass(false);
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Password change error:", error);

      // Detailed error handling based on HTTP status codes
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
        // No response received from server
        setPassChangeAlertMsg("No response from server. Check your network connection.");
      } else {
        // Other unexpected errors
        setPassChangeAlertMsg(`Error: ${error.message}`);
      }
    }
  };

  // Logout handler: clears JWT token and redirects user to homepage/login
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  // Component JSX UI rendering
  return (
    <div className="max-w-2xl mx-auto p-6 bg-pink-100 rounded-lg shadow-md">
      {/* Profile Header */}
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
        {/* Email Editing Section */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <h2 className="text-lg font-semibold text-pink-500 mb-4">Account Information</h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4">
            <div className="mb-2 sm:mb-0">
              <label className="block text-sm font-medium text-gray-500">Email Address</label>
              {/* Conditionally render input or static text based on edit mode */}
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

            {/* Conditionally render Save or Edit button */}
            {isEditingEmail ? (
              <button
                onClick={handleSaveEmail}
                disabled={tempEmail === email} // Disable save if no change
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

        {/* Password Change Section */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <h2 className="text-lg font-semibold text-pink-500 mb-4">Change Password</h2>

          {/* Show password change form or button based on toggle */}
          {isChangingPass ? (
            <div className="space-y-4 max-w-md">
              {/* Old Password Input with show/hide toggle */}
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

              {/* New Password Input with show/hide toggle */}
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

              {/* Save and Cancel Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleChangePassword}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
                >
                  Save Password
                </button>
                <button
                  onClick={() => {
                    // Reset form and hide password change UI
                    setIsChangingPass(false);
                    setOldPassword("");
                    setNewPassword("");
                    setPassChangeAlertMsg("");
                    setPassChangeSuccessMsg("");
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

        {/* Display password change feedback messages */}
        {passChangeAlertMsg && (
          <p className="text-sm text-red-600 ml-5">{passChangeAlertMsg}</p>
        )}
        {passChangeSuccessMsg && (
          <p className="text-sm text-green-500 ml-5">{passChangeSuccessMsg}</p>
        )}

        {/* Additional user info section */}
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
                  {/* Convert issued-at timestamp from JWT to readable date */}
                  {new Date(userData.iat * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className="bg-pink-500 text-white font-medium px-6 py-2 rounded-lg"
          >
            Logout <i className="fa-solid fa-right-to-bracket" />
          </button>
        </div>
      </div>
    </div>
  );
}
