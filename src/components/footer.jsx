import Logo from "../assets/image/logo.png"; // Logo image

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-10 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    {/* Logo */}
                    <div>
                        <img className="w-20" src={Logo} alt="Logo" />
                    </div>
                    <p className="mt-5">High-quality t-shirt and shop your favorites customized tshirt from CyberTDesign.</p>
                </div>


                <div>
                    <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
                    <ul className="space-y-2">
                        <li><a href="/home" className="hover:underline">Home</a></li>
                        <li><a href="/products" className="hover:underline">Product</a></li>
                        <li><a href="/view-cart" className="hover:underline">View Card</a></li>
                        <li><a href="/orders" className="hover:underline">Order History</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                    <p>Email: support@cybertdesign.com</p>
                    <p>Phone: +1 234 567 890</p>
                    <p>Address: 123 Market St, City, Country</p>
                    <div className="flex mt-4 space-x-4">
                        <a href="#" aria-label="Facebook" className="hover:text-blue-500"><i className="fa-brands fa-facebook-f"/></a>
                        <a href="#" aria-label="Instagram" className="hover:text-pink-500"><i className="fa-brands fa-instagram"/></a>
                        <a href="#" aria-label="Twitter" className="hover:text-blue-400"><i className="fa-brands fa-twitter"/></a>
                    </div>
                </div>
            </div>

            <div className="mt-10 text-center border-t border-gray-700 pt-6 text-sm text-gray-400">
                © 2025 CyberTDesign. All rights reserved.
            </div>
        </footer>

    )
}