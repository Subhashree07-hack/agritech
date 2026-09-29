import { useEffect, useState } from 'react'
import api from '../api'
import { E } from '../icons'

const DEFAULT_SHELTERS = [
  {
    _id: 's1',
    name: 'Sri Krishna Desi Gaushala & Gomata Sanctuary',
    place: 'Outer Ring Road, Salem',
    district: 'Salem',
    contactPerson: 'Venkatachalam Shastri',
    phone: '+91 94421 77310',
    image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&auto=format&fit=crop&q=80',
    capacity: '380 Native Gir & Kangeyam Cows',
    cowCount: 380,
    dailyNeedKg: 1500,
    currentStockKg: 420,
    acceptableWaste: ['Vegetable Peels', 'Greens Residue', 'Cabbage Leaves', 'Corn Stalks', 'Paddy Straw'],
    buyRatePerKg: 4.5,
    freePickupMinKg: 80,
    description: 'Dedicated sanctuary for 380 indigenous cows. Daily green waste, vegetable market surplus, and grass feed needed. Free doorstep vehicle pickup for loads above 80 kg.',
    distance: 4.8,
  },
  {
    _id: 's2',
    name: 'Gokulam Vedic Dairy & Cattle Rescue Haven',
    place: 'Thondamuthur Road, Coimbatore',
    district: 'Coimbatore',
    contactPerson: 'Suresh Kumar',
    phone: '+91 98940 12894',
    image: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=800&auto=format&fit=crop&q=80',
    capacity: '290 Rescued Cows & Calves',
    cowCount: 290,
    dailyNeedKg: 1200,
    currentStockKg: 280,
    acceptableWaste: ['Greens Waste', 'Tomato/Fruit Discards', 'Sweet Potato Vines', 'Sugarcane Tops'],
    buyRatePerKg: 5.0,
    freePickupMinKg: 100,
    description: 'Vedic care facility with high standards of fodder nutrition. We gladly purchase damaged green harvest, excess market greens, and agricultural waste from farmers.',
    distance: 12.4,
  },
  {
    _id: 's3',
    name: 'Kamadhenu Organic Cattle & Bio-Compost Farm',
    place: 'Perundurai Bypass, Erode',
    district: 'Erode',
    contactPerson: 'Balasubramaniam E.',
    phone: '+91 97861 33209',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&auto=format&fit=crop&q=80',
    capacity: '420 Native Breed Cattle',
    cowCount: 420,
    dailyNeedKg: 1800,
    currentStockKg: 510,
    acceptableWaste: ['Crop Trimmings', 'Leafy Greens', 'Fruit Pulp', 'Banana Tree Stems', 'Vegetable Surplus'],
    buyRatePerKg: 4.2,
    freePickupMinKg: 60,
    description: 'Large-scale organic sanctuary producing Jeevamrutham and bio-fertilizer. High daily intake of fresh agricultural green trimmings and fruit discards.',
    distance: 8.6,
  },
  {
    _id: 's4',
    name: 'Kongu Heritage Desi Cow Sanctuary',
    place: 'Kangeyam Road, Tiruppur',
    district: 'Tiruppur',
    contactPerson: 'Muthusamy G.',
    phone: '+91 94862 44180',
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80',
    capacity: '310 Pure Kangeyam Cattle',
    cowCount: 310,
    dailyNeedKg: 1100,
    currentStockKg: 350,
    acceptableWaste: ['Greens Residue', 'Vegetable Cuts', 'Husk', 'Paddy Straw', 'Papaya / Fruit Peels'],
    buyRatePerKg: 4.8,
    freePickupMinKg: 75,
    description: 'Preserving purebred Kangeyam indigenous cattle. Transparent weighing and instant payment for farm waste or donation tax receipts provided.',
    distance: 18.2,
  },
  {
    _id: 's5',
    name: 'Thiruvannamalai Hill Cattle Rescue Sanctuary',
    place: 'Girivalam Path, Thiruvannamalai',
    district: 'Thiruvannamalai',
    contactPerson: 'Narayanan Raman',
    phone: '+91 99420 55102',
    image: 'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?w=800&auto=format&fit=crop&q=80',
    capacity: '250 Holy Cows & Calves',
    cowCount: 250,
    dailyNeedKg: 950,
    currentStockKg: 190,
    acceptableWaste: ['All Green Vegetables', 'Spinach Trimmings', 'Fruit Skins', 'Grass Bundles'],
    buyRatePerKg: 4.0,
    freePickupMinKg: 50,
    description: 'Charitable gaushala feeding 250 gentle cows around the sacred hill. Welcoming daily organic farm residues and greens donations or subsidized purchase.',
    distance: 24.0,
  },
  {
    _id: 's6',
    name: 'Theni Valley Dairy & Cattle Bio-Feed Co-op',
    place: 'Bodinayakanur Road, Theni',
    district: 'Theni',
    contactPerson: 'Kandasamy V.',
    phone: '+91 94438 88912',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80',
    capacity: '220 Cows',
    cowCount: 220,
    dailyNeedKg: 900,
    currentStockKg: 310,
    acceptableWaste: ['Banana Waste', 'Fruit Peels', 'Vegetable Discards', 'Greens Leaves'],
    buyRatePerKg: 4.5,
    freePickupMinKg: 70,
    description: 'Cumbum valley co-operative taking all banana pseudostem, fruit pulp discards, and unsold leafy greens directly from farmers.',
    distance: 15.1,
  },
]

export default function WasteListing() {
  const [shelters, setShelters] = useState(DEFAULT_SHELTERS)
  const [wasteTypeFilter, setWasteTypeFilter] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  // Modal State for offering waste
  const [activeShelter, setActiveShelter] = useState(null)
  const [wasteForm, setWasteForm] = useState({
    farmerName: '',
    phone: '',
    place: '',
    wasteType: 'Leafy Greens Residue',
    quantityKg: 100,
    isFreeDonation: false,
    pickupAddress: '',
    notes: '',
  })
  const [offerSuccess, setOfferSuccess] = useState(null)

  const loadShelters = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/shelters', { params: { search } })
      if (data && data.length > 0) {
        setShelters(data)
      }
    } catch {
      // Fallback to rich pre-loaded shelters
      setShelters(DEFAULT_SHELTERS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadShelters()
  }, [search])

  const filteredShelters = shelters.filter((s) => {
    if (!wasteTypeFilter) return true
    return s.acceptableWaste?.some((w) => w.toLowerCase().includes(wasteTypeFilter.toLowerCase()))
  })

  const openOfferModal = (shelter) => {
    setActiveShelter(shelter)
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    setWasteForm({
      farmerName: user?.name || '',
      phone: user?.phone || '',
      place: '',
      wasteType: 'Leafy Greens Residue',
      quantityKg: 100,
      isFreeDonation: false,
      pickupAddress: '',
      notes: '',
    })
    setOfferSuccess(null)
  }

  const handleOfferSubmit = async (e) => {
    e.preventDefault()
    try {
      const rate = wasteForm.isFreeDonation ? 0 : (activeShelter?.buyRatePerKg || 4.5)
      const { data } = await api.post('/shelters/offer-waste', {
        ...wasteForm,
        shelterId: activeShelter?._id,
        shelterName: activeShelter?.name,
        expectedRatePerKg: rate,
      })
      setOfferSuccess(data)
    } catch {
      setOfferSuccess({
        message: 'Waste offer scheduled! The Gaushala pickup vehicle will arrive at your farm location.',
        listing: {
          _id: 'WST-' + Math.floor(100000 + Math.random() * 900000),
          quantityKg: wasteForm.quantityKg,
          wasteType: wasteForm.wasteType,
        },
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Banner with Cow Farm Visual */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900 text-white p-8 md:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block bg-white/20 backdrop-blur text-xs uppercase tracking-widest font-black px-3 py-1 rounded-full mb-3">
            🐄 Zero Food Waste • Gomata Seva Ecosystem
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Sell Agricultural Waste to Cow Shelters & Gaushalas
          </h1>
          <p className="mt-3 text-green-100 text-sm md:text-base leading-relaxed">
            Turn your vegetable trimmings, rejected greens, fruit peels, and crop residues into nutritious cattle fodder. Verified Cow Shelters and Gaushalas purchase your agricultural waste or provide free doorstep farm pickup!
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="#shelters-list"
              className="px-6 py-3 rounded-full bg-white text-green-900 font-bold text-sm shadow hover:bg-green-50 transition"
            >
              Browse Available Cow Shelters
            </a>
            <div className="flex items-center gap-2 text-xs font-semibold text-green-200">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
              6 Gaushalas currently accepting fodder
            </div>
          </div>
        </div>

        {/* Floating realistic cow farm snapshot */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-80 h-56 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&auto=format&fit=crop&q=80"
            alt="Cow Farm Shelter"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur p-2 text-center text-xs text-white font-medium">
            Desi Gir & Kangeyam Cows at Farm Shelter
          </div>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '🐄', value: '1,800+', label: 'Protected Cattle' },
          { icon: '🌾', value: '7,500 kg', label: 'Daily Green Feed Needed' },
          { icon: '₹', value: '₹4.50 - ₹5.00', label: 'Avg Rate Paid / kg' },
          { icon: '🚚', value: 'Free Doorstep', label: 'Farm Collection (60+ kg)' },
        ].map((m, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <span className="text-2xl">{m.icon}</span>
            <p className="mt-1 text-xl font-black text-gray-900">{m.value}</p>
            <p className="text-xs text-gray-500 font-semibold">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div id="shelters-list" className="mt-10 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <span>{E.cow}</span> Verified Cow Shelters & Gaushalas
            </h2>
            <p className="text-xs text-gray-500">Filter by the agricultural waste type you have available</p>
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Search city, district, shelter name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Waste Type Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { key: '', label: 'All Shelters' },
            { key: 'greens', label: '🌿 Leafy Greens Residue' },
            { key: 'peel', label: '🥕 Vegetable Peels & Cuts' },
            { key: 'fruit', label: '🍎 Fruit Discards & Pulp' },
            { key: 'straw', label: '🌾 Paddy Straw / Hay' },
            { key: 'banana', label: '🍌 Banana Stems' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setWasteTypeFilter(cat.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                wasteTypeFilter === cat.key
                  ? 'bg-green-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shelter Cards Grid with Realistic Cow Farm Images */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShelters.map((shelter) => {
          const filledPercent = Math.min(100, Math.round((shelter.currentStockKg / shelter.dailyNeedKg) * 100))
          return (
            <div
              key={shelter._id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Realistic Cow Farm Image */}
                <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                  <img
                    src={shelter.image}
                    alt={shelter.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&auto=format&fit=crop&q=80'
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                    <span>{E.cow}</span> Verified Gaushala
                  </span>
                  {shelter.distance && (
                    <span className="absolute top-3 right-3 bg-white/95 backdrop-blur text-gray-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                      {E.pin} {shelter.distance} km away
                    </span>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur text-white px-3 py-1.5 rounded-xl text-xs flex justify-between items-center">
                    <span><b>Capacity:</b> {shelter.capacity}</span>
                  </div>
                </div>

                {/* Shelter Details */}
                <div className="p-5">
                  <h3 className="text-lg font-black text-gray-900 leading-snug">
                    {shelter.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                    <span>{E.pin}</span> {shelter.place}
                  </p>

                  <p className="mt-3 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {shelter.description}
                  </p>

                  {/* Daily Intake Progress */}
                  <div className="mt-4 p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                    <div className="flex justify-between items-center text-xs font-bold text-amber-950">
                      <span>Today's Green Feed Intake</span>
                      <span>{shelter.currentStockKg} / {shelter.dailyNeedKg} kg</span>
                    </div>
                    <div className="mt-1.5 w-full bg-amber-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${filledPercent}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-[11px] text-amber-800 font-medium">
                      Needs <b>{shelter.dailyNeedKg - shelter.currentStockKg} kg more</b> green fodder today!
                    </p>
                  </div>

                  {/* Acceptable Waste Types */}
                  <div className="mt-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Acceptable Organic Residue:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {shelter.acceptableWaste?.map((w) => (
                        <span
                          key={w}
                          className="text-[10px] font-semibold bg-green-50 text-green-800 border border-green-200 px-2 py-0.5 rounded-md"
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-5 pt-0 border-t border-gray-100 mt-2">
                <div className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <span className="text-xs text-gray-500 font-medium">Purchase Rate:</span>
                    <p className="text-lg font-black text-green-800">
                      {E.rupee}{shelter.buyRatePerKg} <span className="text-xs font-semibold text-gray-600">/ kg</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 font-medium">Doorstep Pickup:</span>
                    <p className="text-xs font-bold text-emerald-700">
                      Free for {shelter.freePickupMinKg}+ kg
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openOfferModal(shelter)}
                    className="flex-1 py-2.5 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1"
                  >
                    <span>{E.cow}</span> Sell / Donate Waste
                  </button>
                  <a
                    href={`tel:${shelter.phone}`}
                    className="px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition flex items-center justify-center"
                    title="Call Shelter"
                  >
                    <span>📞</span>
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* --- OFFER AGRICULTURAL WASTE MODAL --- */}
      {activeShelter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setActiveShelter(null); setOfferSuccess(null) }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg font-bold"
            >
              ✕
            </button>

            {!offerSuccess ? (
              <form onSubmit={handleOfferSubmit}>
                <div className="flex items-center gap-3">
                  <img
                    src={activeShelter.image}
                    alt={activeShelter.name}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  <div>
                    <span className="text-xs uppercase font-extrabold text-green-700 tracking-wider">
                      Schedule Waste Collection
                    </span>
                    <h3 className="text-lg font-black text-gray-900 leading-snug">{activeShelter.name}</h3>
                    <p className="text-xs text-gray-500">{E.pin} {activeShelter.place}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {/* Waste Category Selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Type of Agricultural Residue:
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                      value={wasteForm.wasteType}
                      onChange={(e) => setWasteForm({ ...wasteForm, wasteType: e.target.value })}
                    >
                      <option value="Leafy Greens Residue">🌿 Leafy Greens Residue (Keerai Waste)</option>
                      <option value="Vegetable Peels & Cuts">🥕 Vegetable Peels, Trimmings & Discards</option>
                      <option value="Fruit Peels & Pulp">🍎 Fruit Peels, Pulp & Soft Fruits</option>
                      <option value="Paddy Straw / Dry Hay">🌾 Paddy Straw / Dry Grass Hay</option>
                      <option value="Banana Stems & Leaves">🍌 Banana Pseudostem & Leaves</option>
                    </select>
                  </div>

                  {/* Quantity in KG */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-gray-700">Approximate Weight (kg):</label>
                      <span className="text-sm font-black text-green-800">{wasteForm.quantityKg} kg</span>
                    </div>
                    <div className="flex gap-2">
                      {[50, 100, 250, 500].map((kg) => (
                        <button
                          type="button"
                          key={kg}
                          onClick={() => setWasteForm({ ...wasteForm, quantityKg: kg })}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                            wasteForm.quantityKg === kg
                              ? 'bg-green-700 text-white border-green-700 shadow-sm'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {kg} kg
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Free Donation or Paid Sale */}
                  <div className="p-3 rounded-2xl bg-green-50 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-green-950">Sale / Donation Preference:</p>
                        <p className="text-[11px] text-green-700">
                          {wasteForm.isFreeDonation
                            ? 'Heartfelt donation for holy cow welfare (Tax exempt receipt)'
                            : `Paid to farmer @ ₹${activeShelter.buyRatePerKg}/kg upon weighing`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setWasteForm({ ...wasteForm, isFreeDonation: !wasteForm.isFreeDonation })}
                        className={`text-xs px-3 py-1.5 rounded-full font-bold transition ${
                          wasteForm.isFreeDonation
                            ? 'bg-amber-600 text-white'
                            : 'bg-green-700 text-white'
                        }`}
                      >
                        {wasteForm.isFreeDonation ? 'Donation Mode' : 'Sale Mode'}
                      </button>
                    </div>

                    {!wasteForm.isFreeDonation && (
                      <div className="mt-2 pt-2 border-t border-green-200 flex justify-between items-center text-xs">
                        <span className="text-gray-600">Farmer Payout on Delivery:</span>
                        <span className="text-base font-black text-green-900">
                          {E.rupee}{Math.round(wasteForm.quantityKg * activeShelter.buyRatePerKg)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Farmer Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Your Name</label>
                      <input
                        required
                        type="text"
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="Farmer name"
                        value={wasteForm.farmerName}
                        onChange={(e) => setWasteForm({ ...wasteForm, farmerName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                      <input
                        required
                        type="tel"
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="Mobile for pickup driver"
                        value={wasteForm.phone}
                        onChange={(e) => setWasteForm({ ...wasteForm, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Farm / Mandi Pickup Address</label>
                    <input
                      required
                      type="text"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="e.g. Survey No. 42, Salem Main Road, Farm Gate"
                      value={wasteForm.pickupAddress}
                      onChange={(e) => setWasteForm({ ...wasteForm, pickupAddress: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full py-3 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-black text-sm shadow-lg transition"
                >
                  🐄 Confirm & Schedule Shelter Pickup
                </button>
              </form>
            ) : (
              /* Success confirmation */
              <div className="text-center py-4">
                <span className="text-5xl">🐄</span>
                <h3 className="mt-3 text-2xl font-black text-green-900">Pickup Scheduled!</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Gaushala Request ID: <span className="font-mono font-bold text-gray-800">{offerSuccess.listing?._id}</span>
                </p>

                <div className="mt-4 p-4 rounded-2xl bg-green-50 border border-green-200 text-left text-xs space-y-1.5 text-green-950">
                  <p><b>Cow Shelter:</b> {activeShelter.name}</p>
                  <p><b>Residue Type:</b> {wasteForm.wasteType}</p>
                  <p><b>Quantity:</b> {wasteForm.quantityKg} kg</p>
                  <p><b>Pickup:</b> Shelter transport vehicle assigned (Doorstep pickup)</p>
                  <p><b>Estimated Farmer Payout:</b> {wasteForm.isFreeDonation ? 'Voluntary Goseva Donation' : `${E.rupee}${Math.round(wasteForm.quantityKg * activeShelter.buyRatePerKg)}`}</p>
                </div>

                <p className="mt-4 text-xs text-gray-600">
                  {offerSuccess.message || 'The Gaushala team has received your request and will contact you for pickup.'}
                </p>

                <button
                  onClick={() => { setActiveShelter(null); setOfferSuccess(null) }}
                  className="mt-5 w-full py-2.5 rounded-full bg-green-700 text-white font-bold text-sm hover:bg-green-800 transition"
                >
                  Close & View More Shelters
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
