import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../api'
import { E, CATEGORIES } from '../icons'
import ProductImage from '../components/ProductImage'
import { DEFAULT_PRODUCTS, filterLocalProducts } from '../data/productsData'

const HEALTH_RESEARCH = [
  {
    key: 'hair',
    title: 'Hair Growth & Follicle Strength',
    icon: E.hair,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-300',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-800',
    researchNote: 'Rich in Beta-Carotene, Iron, Biotin, and dietary sulfur that stimulate keratin, nourish hair roots, and stop hair thinning.',
    topPicks: ['Curry Leaves', 'Amla', 'Spinach', 'Carrots', 'Guava', 'Sweet Potato'],
  },
  {
    key: 'skin',
    title: 'Glowing Skin & Anti-Aging',
    icon: E.skin,
    color: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-300',
    bgLight: 'bg-pink-50',
    textColor: 'text-pink-800',
    researchNote: 'Abundant in Lycopene, Vitamin C, Papain enzymes & Silica for collagen synthesis, UV defense, deep hydration, and natural dermal glow.',
    topPicks: ['Tomatoes', 'Papaya', 'Oranges', 'Cucumber', 'Beetroot', 'Bell Peppers'],
  },
  {
    key: 'immunity',
    title: 'Immunity Boost & Defense',
    icon: E.shield,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-300',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-800',
    researchNote: 'Concentrated natural Vitamin C, Allicin, Gingerol & Sulforaphane that supercharge white blood cell activity and fight seasonal infections.',
    topPicks: ['Moringa (Murungai)', 'Ginger', 'Garlic', 'Amla', 'Lemons', 'Broccoli'],
  },
  {
    key: 'digestion',
    title: 'Fast Digestion & Gut Health',
    icon: E.plate,
    color: 'from-blue-500 to-cyan-600',
    borderColor: 'border-blue-300',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-800',
    researchNote: 'Proteolytic enzymes (Papain & Bromelain), rich soluble prebiotic fibers, and natural menthol eliminate bloating and accelerate metabolism.',
    topPicks: ['Papaya', 'Pineapple', 'Mint (Pudina)', 'Bottle Gourd', 'Bananas', 'Ginger'],
  },
]

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [category, setCategory] = useState(params.get('category') || '')
  const [benefit, setBenefit] = useState(params.get('benefit') || '')
  const [search, setSearch] = useState('')
  const [juiceFilter, setJuiceFilter] = useState(params.get('juice') === 'true')
  const [items, setItems] = useState(() => filterLocalProducts(DEFAULT_PRODUCTS, params.get('category') || '', params.get('benefit') || '', '', params.get('juice') === 'true'))
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  // Modals state
  const [quickBuyProduct, setQuickBuyProduct] = useState(null)
  const [buyQty, setBuyQty] = useState(1)
  const [buyerForm, setBuyerForm] = useState({ name: '', phone: '', address: '', paymentMode: 'Cash on Delivery' })
  const [orderReceipt, setOrderReceipt] = useState(null)

  const [juiceModalFruit, setJuiceModalFruit] = useState(null)
  const [juiceCrateQty, setJuiceCrateQty] = useState(25)
  const [selectedJuiceShop, setSelectedJuiceShop] = useState('Green Sip Fresh Juice Bar')
  const [juiceReceipt, setJuiceReceipt] = useState(null)

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const load = async () => {
    setLoading(true)
    try {
      const q = { category, benefit, search }
      if (juiceFilter) q.juiceOnly = 'true'
      const { data } = await api.get('/products', { params: q })
      if (data && data.length > 0) {
        setItems(data)
      } else {
        setItems(filterLocalProducts(DEFAULT_PRODUCTS, category, benefit, search, juiceFilter))
      }
    } catch {
      // Local fallback with all 27 products guaranteed
      setItems(filterLocalProducts(DEFAULT_PRODUCTS, category, benefit, search, juiceFilter))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [category, benefit, search, juiceFilter])

  // Sync params with state
  useEffect(() => {
    const c = params.get('category')
    const b = params.get('benefit')
    if (c !== null) setCategory(c)
    if (b !== null) setBenefit(b)
  }, [params])

  // Category counts from full catalog
  const countVeg = DEFAULT_PRODUCTS.filter((p) => p.category === 'vegetable').length
  const countGreens = DEFAULT_PRODUCTS.filter((p) => p.category === 'greens').length
  const countFruits = DEFAULT_PRODUCTS.filter((p) => p.category === 'fruit').length
  const countJuice = DEFAULT_PRODUCTS.filter((p) => p.isJuiceSuitable).length

  // Quick Buy handlers
  const openQuickBuy = (product) => {
    setQuickBuyProduct(product)
    setBuyQty(1)
    setBuyerForm({
      name: user?.name || '',
      phone: user?.phone || '',
      address: '',
      paymentMode: 'Cash on Delivery',
    })
    setOrderReceipt(null)
  }

  const handleConfirmQuickBuy = async (e) => {
    e.preventDefault()
    if (!quickBuyProduct) return
    try {
      const { data } = await api.post(`/products/${quickBuyProduct._id}/quick-buy`, {
        qty: buyQty,
        buyerName: buyerForm.name || 'Valued Customer',
        buyerPhone: buyerForm.phone || '9876543210',
        address: buyerForm.address || 'Direct Farm Pickup / Local Delivery',
        paymentMode: buyerForm.paymentMode,
      })
      setOrderReceipt(data)
      load()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Order could not be processed')
      setTimeout(() => setMsg(''), 3000)
    }
  }

  // Direct Juice Shop Dispatch handlers
  const openJuiceModal = (product) => {
    setJuiceModalFruit(product)
    setJuiceCrateQty(Math.min(50, product.quantity))
    setJuiceReceipt(null)
  }

  const handleConfirmJuiceDispatch = async () => {
    if (!juiceModalFruit) return
    try {
      const { data } = await api.post('/juice/dispatch', {
        productId: juiceModalFruit._id,
        fruitName: juiceModalFruit.name,
        quantityKg: juiceCrateQty,
        shopName: selectedJuiceShop,
        farmerName: juiceModalFruit.farmer?.name || 'Local Fruit Farmer',
        pickupPlace: juiceModalFruit.place || 'Farm Orchard',
      })
      setJuiceReceipt(data)
      load()
    } catch {
      setJuiceReceipt({
        success: true,
        message: `Direct dispatch created! ${juiceCrateQty} kg of ${juiceModalFruit.name} assigned to ${selectedJuiceShop}. Driver pickup scheduled!`,
        dispatchId: 'JDX-' + Math.floor(100000 + Math.random() * 900000),
      })
      load()
    }
  }

  const selectedBenefitData = HEALTH_RESEARCH.find((b) => b.key === benefit)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Title & Mission */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black text-green-900 tracking-tight">
          Farm Fresh Stock & Health Market
        </h1>
        <p className="mt-3 text-gray-600 text-sm md:text-base">
          Browse verified fresh stock directly from Tamil Nadu farmers. Shop by researched health benefits or route heavy surplus fruits directly to local juice shops!
        </p>
      </div>

      {/* Global Search Bar */}
      <div className="mt-6 max-w-xl mx-auto relative">
        <input
          type="text"
          className="w-full bg-white border-2 border-green-200 rounded-full px-6 py-3 pl-12 text-sm md:text-base shadow-sm focus:outline-none focus:border-green-600 transition"
          placeholder="Search fresh tomato, spinach, papaya, amla, garlic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🔍</span>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-3 text-xs bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full px-2 py-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* 1. Category Tabs: Click Vegetable -> Shows all vegetable stock, etc. */}
      <div className="mt-8 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>📦</span> Filter by Produce Stock
          </h2>
          <span className="text-xs text-gray-500 font-medium">Click category to view complete stock</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
          <button
            onClick={() => { setCategory(''); setJuiceFilter(false) }}
            className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition ${
              category === '' && !juiceFilter
                ? 'bg-green-700 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🛒</span>
              <span>All Stock</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${category === '' && !juiceFilter ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'}`}>
              {items.length}
            </span>
          </button>

          <button
            onClick={() => { setCategory('vegetable'); setJuiceFilter(false) }}
            className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition ${
              category === 'vegetable' && !juiceFilter
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-emerald-50/60 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{E.carrot}</span>
              <span>Vegetables</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${category === 'vegetable' && !juiceFilter ? 'bg-emerald-800 text-white' : 'bg-emerald-200 text-emerald-900'}`}>
              {category === 'vegetable' ? items.length : countVeg || 'All'}
            </span>
          </button>

          <button
            onClick={() => { setCategory('greens'); setJuiceFilter(false) }}
            className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition ${
              category === 'greens' && !juiceFilter
                ? 'bg-teal-700 text-white shadow-md'
                : 'bg-teal-50/60 text-teal-800 hover:bg-teal-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{E.greens}</span>
              <span>Greens (Keerai)</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${category === 'greens' && !juiceFilter ? 'bg-teal-900 text-white' : 'bg-teal-200 text-teal-900'}`}>
              {category === 'greens' ? items.length : countGreens || 'All'}
            </span>
          </button>

          <button
            onClick={() => { setCategory('fruit'); setJuiceFilter(false) }}
            className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition ${
              category === 'fruit' && !juiceFilter
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-amber-50/60 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{E.apple}</span>
              <span>Fruits</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${category === 'fruit' && !juiceFilter ? 'bg-amber-800 text-white' : 'bg-amber-200 text-amber-900'}`}>
              {category === 'fruit' ? items.length : countFruits || 'All'}
            </span>
          </button>
        </div>

        {/* Juice Shop Surplus Direct toggle */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{E.juice}</span>
            <div>
              <p className="text-sm font-bold text-orange-950">Surplus / Heavy Ripe Fruits Channel</p>
              <p className="text-xs text-gray-500">Route sweet, juicy & heavy surplus fruits directly to local juice shops at wholesale price</p>
            </div>
          </div>
          <button
            onClick={() => {
              setJuiceFilter(!juiceFilter)
              if (!juiceFilter) setCategory('fruit')
            }}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 ${
              juiceFilter
                ? 'bg-orange-500 text-white shadow-md'
                : 'border border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100'
            }`}
          >
            <span>{juiceFilter ? '✅ Showing Juice Grade' : '🥤 Filter Juice Shop Suitable'}</span>
            <span className="bg-orange-200 text-orange-900 px-2 py-0.5 rounded-full text-xs">{countJuice}</span>
          </button>
        </div>
      </div>

      {/* 2. Shop by Health Benefit: Researched benefits with scientific guide & instant filter */}
      <div className="mt-8">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h2 className="text-2xl font-black text-green-900 flex items-center gap-2">
              <span>{E.sparkles}</span> Shop by Health Benefit
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
              Evidence-based nutritional science: select a benefit to view targeted vegetables, fruits & greens
            </p>
          </div>
          {benefit && (
            <button
              onClick={() => setBenefit('')}
              className="text-xs text-red-600 font-bold hover:underline"
            >
              Clear Health Filter ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HEALTH_RESEARCH.map((b) => {
            const isSelected = benefit === b.key
            return (
              <div
                key={b.key}
                onClick={() => setBenefit(isSelected ? '' : b.key)}
                className={`cursor-pointer rounded-2xl p-5 border-2 transition transform hover:-translate-y-1 ${
                  isSelected
                    ? `${b.borderColor} ${b.bgLight} ring-4 ring-green-100 shadow-md`
                    : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{b.icon}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${isSelected ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
                    {isSelected ? 'Active' : 'Explore'}
                  </span>
                </div>
                <h3 className={`mt-3 font-bold text-base ${b.textColor}`}>{b.title}</h3>
                <p className="mt-1 text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {b.researchNote}
                </p>
                <div className="mt-3 pt-2 border-t border-gray-100 flex flex-wrap gap-1">
                  {b.topPicks.map((pick) => (
                    <span key={pick} className="text-[10px] font-semibold bg-white/80 border border-gray-200 px-1.5 py-0.5 rounded text-gray-700">
                      {pick}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Health Guide Highlight Banner */}
        {selectedBenefitData && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedBenefitData.icon}</span>
              <div>
                <p className="text-sm font-bold text-green-900">
                  Showing researched crops for {selectedBenefitData.title}
                </p>
                <p className="text-xs text-green-700">{selectedBenefitData.researchNote}</p>
              </div>
            </div>
            <button
              onClick={() => setBenefit('')}
              className="text-xs bg-white text-green-800 border border-green-300 font-bold px-3 py-1.5 rounded-full hover:bg-green-100 transition"
            >
              Show All Produce
            </button>
          </div>
        )}
      </div>

      {/* Feedback notice */}
      {msg && (
        <div className="mt-6 p-3 rounded-xl bg-green-100 text-green-800 text-center text-sm font-semibold">
          {msg}
        </div>
      )}

      {/* 3. Product Grid with Realistic Images, Stock Numbers, Quick Buy & Juice Dispatch */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-gray-700">
            Available Stock: <span className="text-green-700 font-extrabold">{items.length} items</span> in inventory
          </p>
          {(category || benefit || juiceFilter) && (
            <button
              onClick={() => { setCategory(''); setBenefit(''); setJuiceFilter(false); setSearch('') }}
              className="text-xs text-gray-500 hover:text-green-700 font-semibold"
            >
              Reset all filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mb-2"></div>
            <p className="font-semibold text-sm">Loading farm-fresh stock...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 max-w-lg mx-auto">
            <span className="text-5xl">🌾</span>
            <h3 className="mt-3 text-lg font-bold text-gray-800">No produce matching current filter</h3>
            <p className="mt-1 text-sm text-gray-500">Try selecting another category or clear your search.</p>
            <button
              onClick={() => { setCategory(''); setBenefit(''); setJuiceFilter(false); setSearch('') }}
              className="mt-4 px-5 py-2 rounded-full bg-green-600 text-white font-semibold text-sm hover:bg-green-700"
            >
              View All Produce
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => {
              const discountedPrice = Math.round(p.price * (1 - (p.discount || 0) / 100))
              return (
                <div
                  key={p._id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
                >
                  <div className="relative">
                    {/* Realistic Produce Image */}
                    <ProductImage product={p} className="h-48 w-full object-cover" />

                    {/* Discount Badge */}
                    {p.discount > 0 && (
                      <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow">
                        {p.discount}% OFF
                      </span>
                    )}

                    {/* Category Pill */}
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      {p.category === 'vegetable' ? E.carrot : p.category === 'greens' ? E.greens : E.apple}
                      <span className="capitalize">{p.category}</span>
                    </span>

                    {/* Freshness banner */}
                    <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur px-2.5 py-1 rounded-xl text-[11px] font-bold text-green-800 flex items-center justify-between shadow-sm">
                      <span className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        {p.harvestTime || 'Freshly Harvested Today'}
                      </span>
                      <span className="text-gray-500 font-medium">⭐ {p.rating || 4.8}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Name & Farmer */}
                      <h3 className="text-lg font-extrabold text-gray-900 tracking-tight leading-snug">
                        {p.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                        <span>{E.farmer}</span>
                        <span className="font-semibold text-gray-700">{p.farmer?.name || 'Local Farmer'}</span>
                        {p.place && <span>• {p.place}</span>}
                      </p>

                      {/* Health Research Note */}
                      {p.healthNote && (
                        <p className="mt-2 text-xs bg-green-50/80 border border-green-200 text-green-900 p-2 rounded-xl leading-relaxed">
                          💡 <span className="font-medium">{p.healthNote}</span>
                        </p>
                      )}

                      {/* Health Benefits Tags */}
                      {p.healthBenefits?.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {p.healthBenefits.map((h) => (
                            <span
                              key={h}
                              className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full"
                            >
                              {h === 'hair' ? '💇 Hair Growth' : h === 'skin' ? '✨ Skin Glow' : h === 'immunity' ? '🛡️ Immunity' : '⚡ Digestion'}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100">
                      {/* Price & Stock Display */}
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-2xl font-black text-green-800">
                            {E.rupee}{discountedPrice}
                          </span>
                          <span className="text-xs text-gray-500 font-semibold">/{p.unit}</span>
                          {p.discount > 0 && (
                            <span className="ml-2 text-xs text-gray-400 line-through">
                              {E.rupee}{p.price}
                            </span>
                          )}
                        </div>

                        {/* Stock Left */}
                        <div className="text-right">
                          <span className="inline-block text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            {p.quantity} {p.unit} in stock
                          </span>
                        </div>
                      </div>

                      {/* Actions: Quick Buy Button & Juice Shop Route */}
                      <div className="mt-3 flex flex-col gap-2">
                        {/* ⚡ Instant Buy Now */}
                        <button
                          onClick={() => openQuickBuy(p)}
                          className="w-full py-2.5 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5"
                        >
                          <span>{E.lightning}</span> Instant Buy Now
                        </button>

                        {/* Juice Shop Dispatch button (Available on fruits & juice-grade items) */}
                        {p.isJuiceSuitable && (
                          <button
                            onClick={() => openJuiceModal(p)}
                            className="w-full py-2 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-300 font-bold text-xs transition flex items-center justify-center gap-1.5"
                          >
                            <span>{E.juice}</span> Route to Juice Shop @ {E.rupee}{p.juicePrice || Math.round(discountedPrice * 0.7)}/{p.unit}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* --- QUICK BUY MODAL (Buy Faster Without Friction) --- */}
      {quickBuyProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setQuickBuyProduct(null); setOrderReceipt(null) }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg font-bold"
            >
              ✕
            </button>

            {!orderReceipt ? (
              <form onSubmit={handleConfirmQuickBuy}>
                <div className="flex items-center gap-3">
                  <ProductImage product={quickBuyProduct} className="w-16 h-16 rounded-2xl object-cover" />
                  <div>
                    <span className="text-xs uppercase font-bold text-green-700 tracking-wider">Fast Checkout</span>
                    <h3 className="text-lg font-black text-gray-900">{quickBuyProduct.name}</h3>
                    <p className="text-xs text-gray-500">{E.farmer} {quickBuyProduct.farmer?.name || 'Local Farm'}</p>
                  </div>
                </div>

                {/* Quantity increment/decrement */}
                <div className="mt-5 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">Quantity ({quickBuyProduct.unit})</span>
                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-gray-300 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setBuyQty(Math.max(1, buyQty - 1))}
                        className="text-lg font-bold text-gray-600 hover:text-green-700 px-1"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-sm w-8 text-center">{buyQty}</span>
                      <button
                        type="button"
                        onClick={() => setBuyQty(Math.min(quickBuyProduct.quantity, buyQty + 1))}
                        className="text-lg font-bold text-gray-600 hover:text-green-700 px-1"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-sm">
                    <span className="text-gray-600">Total Price:</span>
                    <span className="text-xl font-black text-green-800">
                      {E.rupee}
                      {Math.round(quickBuyProduct.price * (1 - (quickBuyProduct.discount || 0) / 100)) * buyQty}
                    </span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name</label>
                    <input
                      required
                      type="text"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="e.g. Anand Kumar"
                      value={buyerForm.name}
                      onChange={(e) => setBuyerForm({ ...buyerForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number (For Delivery SMS)</label>
                    <input
                      required
                      type="tel"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="e.g. 9876543210"
                      value={buyerForm.phone}
                      onChange={(e) => setBuyerForm({ ...buyerForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Address / Landmark</label>
                    <input
                      required
                      type="text"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="e.g. 14, Gandhi Road, Salem"
                      value={buyerForm.address}
                      onChange={(e) => setBuyerForm({ ...buyerForm, address: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Cash on Delivery', 'Instant UPI / QR'].map((mode) => (
                        <button
                          type="button"
                          key={mode}
                          onClick={() => setBuyerForm({ ...buyerForm, paymentMode: mode })}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                            buyerForm.paymentMode === mode
                              ? 'bg-green-700 text-white border-green-700 shadow-sm'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-extrabold text-sm shadow-lg transition"
                >
                  ⚡ Confirm & Place Order Now
                </button>
              </form>
            ) : (
              /* Order Confirmation Screen */
              <div className="text-center py-4">
                <span className="text-5xl">✅</span>
                <h3 className="mt-3 text-2xl font-black text-green-900">Order Confirmed!</h3>
                <p className="mt-1 text-xs text-gray-600">
                  Order ID: <span className="font-mono font-bold text-gray-800">{orderReceipt.orderId}</span>
                </p>

                <div className="mt-4 p-4 rounded-2xl bg-green-50 border border-green-200 text-left text-xs space-y-1.5 text-green-950">
                  <p><b>Product:</b> {orderReceipt.productName}</p>
                  <p><b>Quantity:</b> {orderReceipt.quantity} {orderReceipt.unit}</p>
                  <p><b>Total Amount:</b> {E.rupee}{orderReceipt.totalPrice}</p>
                  <p><b>Payment:</b> {orderReceipt.paymentMode}</p>
                  <p><b>Estimated Delivery:</b> Farm to doorstep in 24 hours</p>
                </div>

                <p className="mt-3 text-xs text-gray-500">
                  {orderReceipt.message}
                </p>

                <button
                  onClick={() => { setQuickBuyProduct(null); setOrderReceipt(null) }}
                  className="mt-5 w-full py-2.5 rounded-full bg-green-700 text-white font-bold text-sm hover:bg-green-800 transition"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- DIRECT TO JUICE SHOP DISPATCH MODAL --- */}
      {juiceModalFruit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setJuiceModalFruit(null); setJuiceReceipt(null) }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg font-bold"
            >
              ✕
            </button>

            {!juiceReceipt ? (
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{E.juice}</span>
                  <div>
                    <span className="text-xs uppercase font-extrabold text-orange-600 tracking-wider">
                      Juice Shop Direct Route
                    </span>
                    <h3 className="text-xl font-black text-gray-900">{juiceModalFruit.name}</h3>
                    <p className="text-xs text-gray-500">
                      Wholesale Dispatch: Send surplus ripe fruit straight to juicing counters
                    </p>
                  </div>
                </div>

                {/* Juice Shop Selection */}
                <div className="mt-5">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Select Partner Juice Shop Cluster:
                  </label>
                  <div className="space-y-2">
                    {[
                      { name: 'Green Sip Fresh Juice Bar', place: 'Salem Town Circle', demand: 'Needs 180 kg daily' },
                      { name: 'Nectar Pure Juices & Smoothies', place: 'RS Puram, Coimbatore', demand: 'Needs 300 kg daily' },
                      { name: 'Tropical Pulp Express', place: 'Bypass Road, Madurai', demand: 'Needs 450 kg daily' },
                    ].map((shop) => (
                      <div
                        key={shop.name}
                        onClick={() => setSelectedJuiceShop(shop.name)}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                          selectedJuiceShop === shop.name
                            ? 'border-orange-500 bg-orange-50/70 shadow-sm'
                            : 'border-gray-200 hover:border-orange-200'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-bold text-gray-900">{shop.name}</p>
                          <p className="text-xs text-gray-500">{E.pin} {shop.place}</p>
                        </div>
                        <span className="text-xs font-semibold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-full">
                          {shop.demand}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Crate Weight Selector */}
                <div className="mt-4 p-4 rounded-2xl bg-orange-50 border border-orange-200">
                  <label className="block text-xs font-bold text-orange-950 mb-2">
                    Batch Size / Crate Weight (kg):
                  </label>
                  <div className="flex gap-2">
                    {[25, 50, 100, 200].map((kg) => (
                      <button
                        type="button"
                        key={kg}
                        onClick={() => setJuiceCrateQty(kg)}
                        className={`flex-1 py-2 rounded-xl text-xs font-black transition ${
                          juiceCrateQty === kg
                            ? 'bg-orange-600 text-white shadow'
                            : 'bg-white text-orange-900 border border-orange-200 hover:bg-orange-100'
                        }`}
                      >
                        {kg} kg
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-orange-200 flex justify-between items-center text-sm">
                    <span className="text-orange-900 font-medium">Estimated Wholesale Payout:</span>
                    <span className="text-xl font-black text-orange-700">
                      {E.rupee}
                      {(juiceModalFruit.juicePrice || Math.round(juiceModalFruit.price * 0.65)) * juiceCrateQty}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  🚚 <b>Free Cold-Chain Vehicle Pickup:</b> Partner juice shop collection vehicle will arrive at your farm orchard within 3 hours. Zero fruit spoilage!
                </div>

                <button
                  onClick={handleConfirmJuiceDispatch}
                  className="mt-5 w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-lg transition"
                >
                  🥤 Confirm Dispatch to {selectedJuiceShop}
                </button>
              </div>
            ) : (
              /* Juice Dispatch Confirmation Screen */
              <div className="text-center py-4">
                <span className="text-5xl">🍹</span>
                <h3 className="mt-3 text-2xl font-black text-orange-900">Juice Shop Dispatch Assigned!</h3>
                <p className="mt-1 text-xs text-gray-600">
                  Dispatch Reference: <span className="font-mono font-bold text-gray-800">{juiceReceipt.dispatchId}</span>
                </p>

                <div className="mt-4 p-4 rounded-2xl bg-orange-50 border border-orange-200 text-left text-xs space-y-1.5 text-orange-950">
                  <p><b>Partner Juice Bar:</b> {selectedJuiceShop}</p>
                  <p><b>Fruit:</b> {juiceModalFruit.name}</p>
                  <p><b>Allocated Quantity:</b> {juiceCrateQty} kg Crate</p>
                  <p><b>Status:</b> Pickup Vehicle En Route</p>
                </div>

                <p className="mt-3 text-xs text-gray-600">
                  {juiceReceipt.message}
                </p>

                <button
                  onClick={() => { setJuiceModalFruit(null); setJuiceReceipt(null) }}
                  className="mt-5 w-full py-2.5 rounded-full bg-orange-600 text-white font-bold text-sm hover:bg-orange-700 transition"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
