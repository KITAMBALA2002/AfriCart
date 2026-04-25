export default function Home() {
  const categories = [
    { name: "Agriculture", icon: "🌿", color: "bg-green-50" },
    { name: "Fashion", icon: "👗", color: "bg-orange-50" },
    { name: "Electronics", icon: "📱", color: "bg-blue-50" },
    { name: "Beauty", icon: "💄", color: "bg-pink-50" },
    { name: "Home", icon: "🛋️", color: "bg-yellow-50" },
    { name: "Auto", icon: "🏍️", color: "bg-indigo-50" },
    { name: "Books", icon: "🎓", color: "bg-purple-50" },
    { name: "More", icon: "⬛", color: "bg-gray-100" },
  ];

  const trust = [
    "💳 Mobile Money",
    "🚚 Fast Delivery",
    "🛍️ Local Brands",
    "📩 SMS Updates",
  ];

  return (
    <main className="min-h-screen bg-stone-50 text-gray-900">
      {/* Top Bar */}
      <div className="bg-green-950 text-white text-sm px-6 py-3 flex justify-between">
        <p className="tracking-wide">🌍 Built for Africa. By Africa.</p>

        <div className="hidden md:flex gap-6">
          <span className="hover:text-yellow-300 cursor-pointer transition">
            Help
          </span>
          <span className="hover:text-yellow-300 cursor-pointer transition">
            Track Order
          </span>
          <span className="hover:text-yellow-300 cursor-pointer transition">
            English
          </span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur sticky top-0 z-50 shadow-sm px-6 py-5">
        <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">
          <h1 className="text-4xl font-black tracking-tight">
            <span className="text-orange-500">Afri</span>
            <span className="text-green-900">Cart</span>
          </h1>

          <div className="flex-1 lg:max-w-2xl flex shadow-sm rounded-xl overflow-hidden">
            <input
              placeholder="Search products, brands and more..."
              className="w-full px-4 py-3 outline-none"
            />
            <button className="bg-orange-500 text-white px-6 hover:bg-orange-600 transition">
              🔍
            </button>
          </div>

          <div className="flex gap-6 font-medium items-center">
            <a href="#" className="hover:text-orange-500 transition">
              🏪 Sell
            </a>
            <a href="#" className="hover:text-orange-500 transition">
              👤 Login
            </a>
            <a
              href="#"
              className="text-xl hover:scale-110 transition inline-block"
            >
              🛒
            </a>
          </div>
        </div>
      </nav>

      {/* Menu */}
      <div className="bg-stone-100 px-6 py-4 flex flex-wrap gap-6 text-sm font-medium border-y">
        <button className="bg-green-900 text-white px-5 py-2 rounded-xl hover:bg-green-950 transition">
          ☰ All Categories
        </button>
        <a href="#" className="hover:text-orange-500">Deals</a>
        <a href="#" className="hover:text-orange-500">Brands</a>
        <a href="#" className="hover:text-orange-500">Forum</a>
        <a href="#" className="hover:text-orange-500">Learn Hub</a>
        <a href="#" className="hover:text-orange-500">Become Seller</a>
      </div>

      {/* Hero */}
      <section className="px-6 py-20 bg-gradient-to-r from-stone-100 via-orange-50 to-green-50">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-green-900 font-semibold mb-3 uppercase tracking-wider">
              Africa’s Marketplace
            </p>

            <h2 className="text-5xl md:text-6xl font-black leading-tight mb-6">
              Buy Local. <br />
              Sell Local. <br />
              <span className="text-orange-500">Grow Together.</span>
            </h2>

            <p className="text-lg text-gray-700 mb-8 max-w-xl">
              Built for African commerce with trusted sellers, mobile money,
              low-data access and community growth.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 text-sm font-medium">
              {trust.map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="bg-orange-500 text-white px-8 py-3 rounded-xl hover:bg-orange-600 hover:scale-105 transition shadow-md">
                Shop Now
              </button>

              <button className="bg-green-900 text-white px-8 py-3 rounded-xl hover:bg-green-950 hover:scale-105 transition shadow-md">
                Sell on AfriCart
              </button>
            </div>
          </div>

          <div className="bg-green-900 rounded-[32px] h-[460px] flex items-center justify-center shadow-2xl hover:scale-[1.02] transition duration-500">
            <div className="text-[190px] drop-shadow-xl">🌍</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-16 bg-white">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold">Top Categories</h3>
          <a href="#" className="text-green-900 font-semibold hover:text-orange-500 transition">
            View All →
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((item) => (
            <div
              key={item.name}
              className={`${item.color} rounded-2xl p-5 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition cursor-pointer`}
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <p className="font-medium">{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Promo Cards */}
      <section className="px-6 py-14 bg-stone-100">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-orange-500 text-white rounded-3xl p-8 hover:scale-[1.02] transition shadow-lg">
            <h3 className="text-3xl font-bold mb-4">
              Support African Brands
            </h3>
            <p className="mb-6">Discover products made across the continent.</p>
            <button className="bg-white text-orange-500 px-6 py-3 rounded-xl font-semibold">
              Explore
            </button>
          </div>

          <div className="bg-green-900 text-white rounded-3xl p-8 hover:scale-[1.02] transition shadow-lg">
            <h3 className="text-3xl font-bold mb-4">Pay Your Way</h3>
            <p className="mb-6">Mobile money, transfer or card checkout.</p>
            <button className="bg-white text-green-900 px-6 py-3 rounded-xl font-semibold">
              Learn More
            </button>
          </div>

          <div className="bg-yellow-50 rounded-3xl p-8 hover:scale-[1.02] transition shadow-lg">
            <h3 className="text-3xl font-bold mb-4">Low Data App</h3>
            <p className="mb-6 text-gray-700">
              Shop faster even with slower internet.
            </p>
            <button className="bg-green-900 text-white px-6 py-3 rounded-xl">
              Get App
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-950 text-white px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-3">Languages</h4>
            <p>English</p>
            <p>French</p>
            <p>Swahili</p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Payments</h4>
            <p>M-Pesa</p>
            <p>Airtel Money</p>
            <p>Mpamba</p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Company</h4>
            <p>About</p>
            <p>Support</p>
            <p>Terms</p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Newsletter</h4>
            <input
              placeholder="Email address"
              className="w-full rounded-xl px-4 py-2 text-white bg-black"
            />
            <button className="bg-orange-500 px-5 py-2 rounded-xl mt-3 w-full">
              Subscribe
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-green-100 mt-10">
          © 2026 AfriCart. Built for African commerce.
        </p>
      </footer>
    </main>
  );
}