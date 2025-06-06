CYBERTDESIGN - E-COMMERCE WEBSITE
 ![image](https://github.com/user-attachments/assets/31944d1d-1226-4619-bde7-22a0a70a5965)

Functionality:
1.	Signup
 ![image](https://github.com/user-attachments/assets/8c6531fa-50c4-4693-b41a-92ec09814a58)

•	Manual Signup
•	Google Signup
2.	Login
 ![image](https://github.com/user-attachments/assets/0c0073a4-3110-47e5-b554-a9d6b2f4530c)

•	Manual Login
•	Google Login
3.	Home – Special offer product showcase
 ![image](https://github.com/user-attachments/assets/5c977c02-ac33-47d8-8f54-c88eb0f8fb2d)

4.	Admin Page – Admin only able to access

5.	Product – All products

 ![image](https://github.com/user-attachments/assets/be396772-7070-4626-b4ee-012390bf6298)

6.	Product Details – View product details
   ![image](https://github.com/user-attachments/assets/ad02e76f-df8a-4414-8299-9db0d7940a72)

7.	Cart – Place order and manage quantity
 ![image](https://github.com/user-attachments/assets/f0611f82-6c81-4e7f-930a-eb5528b290d4)

 ![image](https://github.com/user-attachments/assets/f07d23fa-de7b-44bc-9c05-e5b85865955b)

8.	Order History – View order history
 ![image](https://github.com/user-attachments/assets/2d82e288-cca0-4ece-95d8-8775247e2980)

Overview:
📦 Tech Stack
•	React (Frontend)
•	Firebase Authentication (Google Sign-In)
•	Express.js API (User creation & Google signup verification)
•	Axios (HTTP requests)
•	Framer Motion (Animations)
•	Tailwind CSS (Styling)

📄 Login Component Documentation
📸 Screenshot:
Laptop View
 ![image](https://github.com/user-attachments/assets/d2b67d00-d1cb-44cf-8bc5-4e3be087b14d)

Mobile View
 ![image](https://github.com/user-attachments/assets/22b277ab-f134-4c74-8689-7813b632ba93)

Overview (Modern Login System in React with Firebase & JWT)
This component provides user authentication via:
•	Email and password (standard login)
•	Google Sign-In (using Firebase)
It supports:
•	JWT token storage & validation
•	Conditional redirection based on user roles (admin or general user)
•	Inline error handling and animated UI feedback

🔐 JWT Token Logic
•	On component load (useEffect), checks if token exists in localStorage
•	Validates token structure and expiration
•	Redirects:
o	Admin users → /admin
o	Regular users → /home
________________________________________
📲 Email/Password Login Flow
Function: handleLogin
1.	POST request sent to /login endpoint.
2.	On success:
o	Token saved to localStorage
o	User redirected based on role
3.	On failure:
o	404 → Email alert: "User does not exist!"
o	401 → Password alert: "Incorrect password!"
o	Network/server issues prompt appropriate alert
________________________________________
🔑 Google Login Flow
Function: handleGoogleLogin
1.	Initiates signInWithPopup(auth, provider) (Firebase)
2.	Sends retrieved email to backend: /google-login
3.	On success:
o	Token stored in localStorage
o	User navigated to /home
4.	On failure:
o	Inline alert: "Email not exists. Please create account"
________________________________________
🖥️ UI Structure
•	Animated container: motion.div
•	Form:
o	Email + Password fields with labels
o	Inline validation error messages
•	Login button:
o	Loading state support
•	Divider
•	Google login button
•	Signup redirect
________________________________________
🧪 Validation and Feedback
State Variable	Purpose
emailAlert	Show error if user not found
passAlert	Show error if incorrect password
googleAlert	Alert if Google account email not found
loading	Disables login button and shows loading text
🔁 Redirection Logic
•	Valid Token → Auto-redirect to /home or /admin
•	Expired or Invalid Token → Stay on login, clear local storage


📝 Signup.jsx — React Signup Page with Firebase & Express
📸 Screenshot:
Laptop View
 ![image](https://github.com/user-attachments/assets/75e07350-1e9f-4c95-bc39-e4cc940e0768)

Mobile View
 ![image](https://github.com/user-attachments/assets/3ceebcf7-8e84-47fb-9142-50cca8095b5d)

This component implements a fully functional Signup Page using React. It supports:
•	Email/password registration
•	Google Sign-In using Firebase
•	Backend validation and error handling
•	Animated UI using framer-motion
🚀 Features
•	Email format and password strength validation
•	Confirm password match check
•	Real-time validation alerts
•	Responsive UI with animation
•	Google account signup with Firebase
•	Redirect to login page if user exists
•	Navigate to set-password page after Google signup
🧪 Validation Logic
•	Email: Must follow valid email format via RegEx.
•	Password: Must contain at least 8 characters, 1 number, and 1 special character.
•	Confirm Password: Must match the password field.
🛠️ Main Functions
handleSubmit()
•	Triggered when the user clicks Signup
•	Sends a POST request to /create-user
•	Handles success/failure messages
handleGoogleLogin()
•	Triggered when user clicks Signup with Google
•	Uses Firebase's signInWithPopup
•	Sends the email to /google-signup endpoint
•	On success, redirects to /set-password
________________________________________
🔄 Navigation
Trigger	Redirect
On successful signup	/ (login page)
On successful Google signup	/set-password with email in state
Already have an account?	Button redirects to /

📦 AdminManage Screen Documentation
Overview:
The AdminManage component is an admin dashboard interface that allows administrators to:
•	Upload new product data (including image, description, category, etc.)
•	View a live list of all available product stock
•	Delete products from the inventory
•	Log out of the dashboard
🔧 Props
setActiveMenu: Function
•	Used to highlight/set the active menu item (Dashboard) in the parent layout/navigation.
🔐 Authentication
•	Uses a bearer token (accessToken) from localStorage to authorize requests (e.g. handleSend for adding products).
•	Clears token on logout and redirects to login/home page.

📤 Image Upload Logic: handleImage
Uploads the selected file to Cloudinary (via backend) and stores the image URL.
Behavior:
•	Validates that a file is selected
•	Shows loading status during upload
•	Updates error state if upload fails
🧪 Product Submission Logic: handleSend
Sends a POST request with the complete product data to the backend.
On success:
•	Resets form fields
•	Refreshes stock list
•	Clears file input using useRef
________________________________________
📥 Fetching Product Stock: getData
Fetches all product data from the backend and populates the stockData array.
Hook Dependencies:
•	Memoized with useCallback
•	Called on initial load with useEffect
________________________________________
❌ Deleting Product: handleDelete
Deletes a product by ID and refreshes the stock list.
________________________________________
🖼️ UI Subcomponents
StockContainer
Displays a list of all products with image, details, and a delete icon.
🧾 Form Validation
A useEffect ensures that the Add Product button is only enabled when all required fields are filled:
•	productName, productDesc, productPrice, screenOption, and successful image upload
🚪 Logout Functionality
On clicking Logout:
•	Clears the token
•	Navigates back to the root ("/")
📁 Backend Endpoints Used
Endpoint	Method	Purpose
/upload	POST	Upload image to Cloudinary
/get-data	GET	Fetch all products
/admin-management	POST	Submit new product data
/delete-product/:id	DELETE	Remove product by ID


