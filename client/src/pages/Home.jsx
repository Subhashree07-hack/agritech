import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { E } from '../icons'
import { DEFAULT_PRODUCTS } from '../data/productsData'

export default function Home() {
  const navigate = useNavigate()
  const [activeStockTab, setActiveStockTab] = useState('vegetable') // 'vegetable' | 'greens' | 'fruit'

  // Extract at least 5 produce items for each category
  const vegStock = DEFAULT_PRODUCTS.filter((p) => p.category === 'vegetable').slice(0, 5)
  const greensStock = DEFAULT_PRODUCTS.filter((p) => p.category === 'greens').slice(0, 5)
  const fruitsStock = DEFAULT_PRODUCTS.filter((p) => p.category === 'fruit').slice(0, 5)

  const activeStockList =
    activeStockTab === 'vegetable' ? vegStock : activeStockTab === 'greens' ? greensStock : fruitsStock

  return (
    <main className="pb-16 bg-[#f9fbf8]">
      {/* Hero Section */}
      <section className="hero-bg text-white relative overflow-hidden">
        <span className="float absolute top-10 left-10 text-5xl opacity-80">{E.tomato}</span>
        <span className="float absolute top-24 right-16 text-5xl opacity-80" style={{ animationDelay: '1s' }}>{E.carrot}</span>
        <span className="float absolute bottom-10 left-1/3 text-5xl opacity-80" style={{ animationDelay: '2s' }}>{E.greens}</span>

        <div className="max-w-5xl mx-auto text-center py-20 md:py-24 px-4">
          <div className="inline-block bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 border border-white/30">
            🌱 AgriTech • Direct Farm Sourcing & Agro-Ecosystem Platform
          </div>
          <h1 className="fade-up text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Fresh Produce Stock, Health Benefits & Direct Markets
          </h1>
          <p className="fade-up delay-1 mt-4 text-base md:text-xl text-green-50 max-w-3xl mx-auto font-medium">
            Browse verified live stock of vegetables, fruits, and greens directly from Tamil Nadu farmers. Connect with local cow shelters to sell farm waste, and route surplus fruits directly to juice bars!
          </p>

          {/* Quick Action Navigation Bar */}
          <div className="fade-up delay-2 mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/products"
              className="px-6 py-3.5 rounded-full bg-white text-green-900 font-extrabold text-sm md:text-base hover:scale-105 shadow-xl transition"
            >
              🛒 View All 27 Stock
            </Link>

            {/* Direct Button: Selling to Market Buyers */}
            <button
              onClick={() => navigate('/map')}
              className="px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm md:text-base shadow-xl transition flex items-center gap-1.5"
            >
              <span>🏛️</span> Sell to Market Buyers / Mandis
            </button>

            {/* Direct Button: Fruits to Juice Shops */}
            <Link
              to="/fruits-juice"
              className="px-6 py-3.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm md:text-base shadow-xl transition flex items-center gap-1.5"
            >
              <span>🥤</span> Fruits & 5+ Juice Shops
            </Link>

            <Link
              to="/waste-listing"
              className="px-6 py-3.5 rounded-full bg-emerald-800 text-white border-2 border-emerald-300 font-bold text-sm md:text-base hover:bg-emerald-900 transition flex items-center gap-1.5"
            >
              <span>{E.cow}</span> Cow Shelters
            </Link>
          </div>

          <p className="fade-up delay-3 mt-8 flex items-center justify-center gap-2 text-xs md:text-sm text-green-100">
            <span className="live-dot inline-block w-2.5 h-2.5 rounded-full bg-green-300"></span>
            <span>Over 270 verified farmers, 6 Gaushalas & 5 Juice Bars active near you</span>
          </p>
        </div>
      </section>

      {/* 1. PRODUCE STOCK SHOWCASE (At least 5 real images each for Vegetables, Greens, and Fruits) */}
      <section className="max-w-7xl mx-auto px-4 pt-14">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-wider text-green-700 bg-green-100 px-3 py-1 rounded-full">
            📦 Live Produce Stock & Availability
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight mt-2">
            Available Produce Stock from Farmers
          </h2>
          <p className="text-gray-600 text-xs md:text-sm mt-1">
            Real photographic stock from verified local farmers with current harvest quantities and immediate buy options
          </p>
        </div>

        {/* Category Switcher Tabs with Real Photo Previews */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex p-1.5 bg-white rounded-3xl border border-gray-200 shadow-sm gap-2">
            <button
              onClick={() => setActiveStockTab('vegetable')}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs md:text-sm transition flex items-center gap-2 ${
                activeStockTab === 'vegetable'
                  ? 'bg-green-700 text-white shadow-md'
                  : 'text-gray-700 hover:bg-green-50'
              }`}
            >
              <span>🥕</span> Vegetables Stock (5 Varieties)
            </button>
            <button
              onClick={() => setActiveStockTab('greens')}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs md:text-sm transition flex items-center gap-2 ${
                activeStockTab === 'greens'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'text-gray-700 hover:bg-teal-50'
              }`}
            >
              <span>🌿</span> Greens (Keerai) (5 Varieties)
            </button>
            <button
              onClick={() => setActiveStockTab('fruit')}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs md:text-sm transition flex items-center gap-2 ${
                activeStockTab === 'fruit'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-orange-50'
              }`}
            >
              <span>🍎</span> Fruits Stock (5 Varieties)
            </button>
          </div>
        </div>

        {/* 5 Real Images Grid for Active Tab with Stock Availability */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {activeStockList.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
            >
              <div className="relative">
                {/* Real High-Resolution Photographic Image */}
                <div className="h-44 w-full overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                </div>
                {/* Live Stock Left Badge */}
                <span className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow">
                  {item.quantity} {item.unit} in stock
                </span>
                {item.discount > 0 && (
                  <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                    {item.discount}% OFF
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 leading-snug line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span>{E.farmer}</span> {item.farmer?.name || 'Local Farmer'}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{E.pin} {item.place}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xl font-black text-green-800">
                      {E.rupee}{Math.round(item.price * (1 - (item.discount || 0) / 100))}
                      <span className="text-xs font-semibold text-gray-500">/{item.unit}</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      ⭐ {item.rating}
                    </span>
                  </div>

                  <Link
                    to={`/products?category=${item.category}`}
                    className="w-full block text-center py-2 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs shadow-sm transition"
                  >
                    ⚡ Buy Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Full 27 Products CTA */}
        <div className="mt-8 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-green-800 hover:bg-green-900 text-white font-black text-sm shadow-md transition"
          >
            <span>🛒</span> Click to View All 27 Farm Products in Stock →
          </Link>
        </div>
      </section>

      {/* 2. DIRECT SELLING TO MARKET BUYERS & MANDIS BANNER */}
      <section className="max-w-7xl mx-auto px-4 pt-14">
        <div className="rounded-3xl bg-gradient-to-r from-amber-700 via-amber-800 to-orange-900 text-white p-8 md:p-10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-black bg-white/20 backdrop-blur px-3 py-1 rounded-full uppercase tracking-wider">
              🏛️ Farmer Direct Mandi Network
            </span>
            <h3 className="text-2xl md:text-3xl font-black mt-2 leading-tight">
              Sell Directly to Wholesale Market Buyers & Mandis
            </h3>
            <p className="mt-2 text-amber-100 text-xs md:text-sm leading-relaxed">
              Connect directly with wholesale produce buyers, APMC mandis, and Uzhavar Sandhais (0% commission direct farmer bazaars). Enter your farm location to view distance, operating hours, and today's arrival rates!
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/map"
                className="px-6 py-3 rounded-full bg-white text-amber-950 font-black text-xs md:text-sm shadow-lg hover:bg-amber-50 transition"
              >
                🏛️ Open Market Buyers & Mandis Locator
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-72 h-44 rounded-2xl overflow-hidden border-2 border-white/30 shrink-0 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
              alt="Wholesale Vegetable Market"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 3. FRUITS & 5+ JUICE SHOPS BANNER */}
      <section className="max-w-7xl mx-auto px-4 pt-10">
        <div className="rounded-3xl bg-gradient-to-r from-orange-600 to-amber-600 text-white p-8 md:p-10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-black bg-white/20 backdrop-blur px-3 py-1 rounded-full uppercase tracking-wider">
              🥤 Zero Fruit Rot • Partner Juice Bars
            </span>
            <h3 className="text-2xl md:text-3xl font-black mt-2 leading-tight">
              Have Ripe or Surplus Fruits? Sell to 5+ Partner Juice Shops!
            </h3>
            <p className="mt-2 text-orange-100 text-xs md:text-sm leading-relaxed">
              Touch any fruit in our catalog to instantly see 5 local commercial juice shops (Green Sip, Nectar Juices, Tropical Pulp) offering guaranteed wholesale purchase rates with free farm gate pickup!
            </p>
            <div className="mt-5 flex gap-3">
              <Link
                to="/fruits-juice"
                className="px-6 py-3 rounded-full bg-white text-orange-950 font-black text-xs md:text-sm shadow-lg hover:bg-orange-50 transition"
              >
                🥤 Touch Fruits & Sell to Juice Shops
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-72 h-44 rounded-2xl overflow-hidden border-2 border-white/30 shrink-0 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&auto=format&fit=crop&q=80"
              alt="Fresh Juice Shop"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4. COW SHELTERS & GAUSHALA WASTE DISPOSAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 pt-10">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-8 md:p-10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-black bg-white/20 backdrop-blur px-3 py-1 rounded-full uppercase tracking-wider">
              {E.cow} Sustainable Agriculture • Gaushala Feed Recovery
            </span>
            <h3 className="text-2xl md:text-3xl font-black mt-2 leading-tight">
              Sell Agricultural Green Residue to 6 Verified Cow Shelters
            </h3>
            <p className="mt-2 text-green-100 text-xs md:text-sm leading-relaxed">
              Don't throw away vegetable peels, crop cuts, and damaged greens! Verified Gaushalas purchase organic waste @ ₹4.50/kg with free doorstep truck pickup for loads over 80 kg.
            </p>
            <div className="mt-5 flex gap-3">
              <Link
                to="/waste-listing"
                className="px-6 py-3 rounded-full bg-white text-emerald-950 font-black text-xs md:text-sm shadow-lg hover:bg-emerald-50 transition"
              >
                🐄 View 6 Cow Shelters & Sell Waste
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-72 h-44 rounded-2xl overflow-hidden border-2 border-white/30 shrink-0 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&auto=format&fit=crop&q=80"
              alt="Cow Farm Sanctuary"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
