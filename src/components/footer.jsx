import Logo from "../assets/image/logo.png"; // Logo image

export default function Footer() {
    return (
        <footer class="bg-gray-900 text-white py-10 px-4">
            <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    {/* Logo */}
                    <div>
                        <img className="w-20" src={Logo} alt="Logo" />
                    </div>
                    <p>High-quality products with reliable service. Shop your favorites from the comfort of your home.</p>
                </div>

                <div>
                    <h3 class="text-lg font-semibold mb-4">Shop</h3>
                    <ul class="space-y-2">
                        <li><a href="#" class="hover:underline">T-shirt</a></li>
                        <li><a href="#" class="hover:underline">Hoodie</a></li>
                        <li><a href="#" class="hover:underline">Formal T-shirt</a></li>
                        <li><a href="#" class="hover:underline">Custom T-shirt</a></li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-lg font-semibold mb-4">Useful Links</h3>
                    <ul class="space-y-2">
                        <li><a href="/about" class="hover:underline">About Us</a></li>
                        <li><a href="/contact" class="hover:underline">Contact</a></li>
                        <li><a href="/faq" class="hover:underline">FAQ</a></li>
                        <li><a href="/returns" class="hover:underline">Return Policy</a></li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-lg font-semibold mb-4">Contact Us</h3>
                    <p>Email: support@cybertdesign.com</p>
                    <p>Phone: +1 234 567 890</p>
                    <p>Address: 123 Market St, City, Country</p>
                    <div class="flex mt-4 space-x-4">
                        <a href="#" aria-label="Facebook" class="hover:text-blue-500"><i class="fa-brands fa-facebook-f"/></a>
                        <a href="#" aria-label="Instagram" class="hover:text-pink-500"><i class="fa-brands fa-instagram"/></a>
                        <a href="#" aria-label="Twitter" class="hover:text-blue-400"><i class="fa-brands fa-twitter"/></a>
                    </div>
                </div>
            </div>

            <div class="mt-10 text-center border-t border-gray-700 pt-6 text-sm text-gray-400">
                © 2025 CyberTDesign. All rights reserved.
            </div>
        </footer>

    )
}