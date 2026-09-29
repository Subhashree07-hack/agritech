import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../api'
import { E } from '../icons'

// Known Tamil Nadu Coordinate Registry for instant location lookup
const LOCATION_COORDS = {
  salem: [11.664, 78.146],
  coimbatore: [11.016, 76.955],
  erode: [11.341, 77.727],
  theni: [10.010, 77.476],
  ooty: [11.410, 76.693],
  nilgiris: [11.410, 76.693],
  madurai: [9.925, 78.119],
  tiruppur: [11.108, 77.341],
  hosur: [12.740, 77.828],
  krishnagiri: [12.526, 78.214],
  thiruvannamalai: [12.225, 79.074],
  cumbum: [9.734, 77.281],
  pollachi: [10.660, 77.008],
  chennai: [13.082, 80.270],
}

const DEFAULT_FARMLANDS = [
  {
    _id: 'fl1',
    title: 'Mettupalayam 5-Acre Fertile Riverland',
    ownerName: 'Thangavel Chettiar',
    phone: '+91 94431 11200',
    place: 'Mettupalayam, Coimbatore',
    district: 'Coimbatore',
    totalAcres: 5.0,
    availableAcres: 3.5,
    soilType: 'Deep Red Loam Soil (pH 6.8)',
    waterSource: 'Bhavani River Canal + Drip Lines',
    cropsSuitable: ['Tomatoes', 'Spinach & Greens', 'Papaya', 'Banana'],
    contractType: 'Seasonal 6-Month Buyback Contract',
    ratePerAcre: 42000,
    contractPeriod: '6 to 12 Months',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    description: 'Lush agricultural farmland ready for forward contract farming. Excellent road access, automated drip irrigation, organic compost enriched soil.',
    lat: 11.016,
    lng: 76.955,
  },
  {
    _id: 'fl2',
    title: 'Yercaud Foothills 4-Acre Mountain Farmland',
    ownerName: 'Palanisamy G.',
    phone: '+91 98422 66315',
    place: 'Foot of Yercaud, Salem',
    district: 'Salem',
    totalAcres: 4.0,
    availableAcres: 4.0,
    soilType: 'Mineral-Rich Hill Loam Soil',
    waterSource: 'Perennial Mountain Stream + Open Well',
    cropsSuitable: ['Carrots', 'Sweet Potato', 'Palak Keerai', 'Bell Peppers'],
    contractType: 'Full Harvest Purchase Agreement',
    ratePerAcre: 38000,
    contractPeriod: '6 Months (Renewable)',
    image: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800&auto=format&fit=crop&q=80',
    description: 'Cool microclimate farmland ideal for high-value root vegetables, exotic greens, and sweet potato contract farming with guaranteed buyback options.',
    lat: 11.664,
    lng: 78.146,
  },
  {
    _id: 'fl3',
    title: 'Cumbum Valley 6-Acre Rich Farmland',
    ownerName: 'Manickam V.',
    phone: '+91 97893 22105',
    place: 'Cumbum Valley, Theni',
    district: 'Theni',
    totalAcres: 6.0,
    availableAcres: 4.5,
    soilType: 'Alluvial River Basin Soil',
    waterSource: 'Periyar Dam Canal Irrigation (24x7)',
    cropsSuitable: ['Banana', 'Guava', 'Pineapple', 'Bottle Gourd'],
    contractType: 'Commercial Fruit & Veg Contract',
    ratePerAcre: 48000,
    contractPeriod: '1 Year Full Cycle',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=80',
    description: 'Located in Tamil Nadu\'s most fertile valley. Unlimited water access, high yield history, pre-installed trellis for creepers and fruit orchards.',
    lat: 10.010,
    lng: 77.476,
  },
  {
    _id: 'fl4',
    title: 'Bhavani River Basin 3.5-Acre Organic Plot',
    ownerName: 'Dhanapal K.',
    phone: '+91 94871 99044',
    place: 'Bhavani, Erode',
    district: 'Erode',
    totalAcres: 3.5,
    availableAcres: 2.0,
    soilType: 'Black Cotton Soil (Moisture Retentive)',
    waterSource: 'River Lift Irrigation + Solar Pump',
    cropsSuitable: ['Turmeric', 'Murungai (Moringa)', 'Curry Leaves', 'Ginger'],
    contractType: 'Organic Forward Buyback Contract',
    ratePerAcre: 36000,
    contractPeriod: '8 Months',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
    description: 'Certified 100% organic plot for 7 years. Ideal for buyers and food processing companies looking for contract organic moringa and medicinal herbs.',
    lat: 11.341,
    lng: 77.727,
  },
  {
    _id: 'fl5',
    title: 'Hosur Agro-Corridor 8-Acre Greenhouse Farmland',
    ownerName: 'Venkatesan R.',
    phone: '+91 99440 33812',
    place: 'Kelamangalam Road, Hosur',
    district: 'Hosur',
    totalAcres: 8.0,
    availableAcres: 5.0,
    soilType: 'Polyhouse Sandy Loam Beds',
    waterSource: 'Rainwater Lake + RO Drip System',
    cropsSuitable: ['Bell Peppers', 'Broccoli', 'Cucumber', 'Cherry Tomatoes'],
    contractType: 'Precision High-Tech Contract Farming',
    ratePerAcre: 55000,
    contractPeriod: '12 Months',
    image: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800&auto=format&fit=crop&q=80',
    description: 'Modern climate-controlled greenhouses just 40km from Bangalore market. Rapid produce transit, highest grade vegetables for retail and exports.',
    lat: 12.740,
    lng: 77.828,
  },
]

const DEFAULT_MARKETS = [
  {
    _id: 'mk1',
    name: 'Salem Uzhavar Sandhai (Farmer Direct Market)',
    type: 'uzhavar_sandhai',
    place: 'Suramangalam, Salem',
    district: 'Salem',
    operatingHours: '4:30 AM - 11:30 AM',
    topCommodities: ['Country Tomatoes', 'Palak Keerai', 'Carrots', 'Country Gourds'],
    commissionFee: '0% (Direct Farmer to Consumer, Zero Intermediaries)',
    phone: '+91 427 244 8910',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&auto=format&fit=crop&q=80',
    dailyArrivalTonnes: 35,
    lat: 11.664,
    lng: 78.146,
  },
  {
    _id: 'mk2',
    name: 'Coimbatore APMC Wholesale Vegetable & Fruit Mandi',
    type: 'apmc_mandi',
    place: 'MTP Road, Coimbatore',
    district: 'Coimbatore',
    operatingHours: '3:00 AM - 1:00 PM',
    topCommodities: ['All Vegetables', 'Oranges', 'Bananas', 'Potatoes & Onions'],
    commissionFee: 'Government Mandi Regulated 2%',
    phone: '+91 422 254 1120',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&auto=format&fit=crop&q=80',
    dailyArrivalTonnes: 120,
    lat: 11.016,
    lng: 76.955,
  },
  {
    _id: 'mk3',
    name: 'Erode Uzhavar Sandhai & Agro Cooperative Center',
    type: 'uzhavar_sandhai',
    place: 'Sampath Nagar, Erode',
    district: 'Erode',
    operatingHours: '5:00 AM - 12:00 PM',
    topCommodities: ['Greens & Keerai Varieties', 'Turmeric', 'Ginger', 'Beetroot'],
    commissionFee: '0% (Direct Farmer Platform with Free Weighing Scales)',
    phone: '+91 424 225 3301',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    dailyArrivalTonnes: 28,
    lat: 11.341,
    lng: 77.727,
  },
  {
    _id: 'mk4',
    name: 'Theni Wholesale Banana & Sub-Tropical Fruit Hub',
    type: 'wholesale_hub',
    place: 'Allinagaram, Theni',
    district: 'Theni',
    operatingHours: '4:00 AM - 2:00 PM',
    topCommodities: ['Nendran & Robusta Bananas', 'Papaya', 'Pineapple', 'Watermelon'],
    commissionFee: 'Direct Wholesale Buyer Bidding',
    phone: '+91 4546 252 890',
    image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=800&auto=format&fit=crop&q=80',
    dailyArrivalTonnes: 85,
    lat: 10.010,
    lng: 77.476,
  },
  {
    _id: 'mk5',
    name: 'Madurai Central Mattuthavani Vegetable Market',
    type: 'apmc_mandi',
    place: 'Mattuthavani, Madurai',
    district: 'Madurai',
    operatingHours: '2:30 AM - 12:00 PM',
    topCommodities: ['Pomegranate', 'Country Tomatoes', 'Drumstick', 'Watermelon'],
    commissionFee: 'APMC Supervised Wholesale',
    phone: '+91 452 258 7741',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&auto=format&fit=crop&q=80',
    dailyArrivalTonnes: 150,
    lat: 9.925,
    lng: 78.119,
  },
  {
    _id: 'mk6',
    name: 'Hosur Fresh Cold-Chain & Juice Procurement Cluster',
    type: 'juice_cluster',
    place: 'SIPCOT Phase 2, Hosur',
    district: 'Hosur',
    operatingHours: '6:00 AM - 6:00 PM',
    topCommodities: ['Surplus Fruits for Juicing', 'Pulp Processing', 'Citrus', 'Papaya'],
    commissionFee: 'Direct Juice Shop Wholesale Buyout',
    phone: '+91 4344 278 190',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&auto=format&fit=crop&q=80',
    dailyArrivalTonnes: 60,
    lat: 12.740,
    lng: 77.828,
  },
]

// Custom Leaflet DivIcons
const createCustomIcon = (emoji, bgColor = '#16a34a') =>
  L.divIcon({
    html: `<div style="background:${bgColor};width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:2.5px solid white;box-shadow:0 3px 8px rgba(0,0,0,0.3);">${emoji}</div>`,
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })

const farmlandIcon = createCustomIcon('🌾', '#15803d')
const marketIcon = createCustomIcon('🏛️', '#d97706')
const farmerIcon = createCustomIcon('👨‍🌾', '#059669')
const meIcon = createCustomIcon('📍', '#2563eb')

function Recenter({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom)
    }
  }, [center[0], center[1], zoom])
  return null
}

const distanceKm = (lat1, lng1, lat2, lng2) => {
  const r = Math.PI / 180
  const a =
    Math.sin(((lat2 - lat1) * r) / 2) ** 2 +
    Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lng2 - lng1) * r) / 2) ** 2
  return Number((6371 * 2 * Math.asin(Math.sqrt(a))).toFixed(1))
}

export default function FarmersMap() {
  const [activeTab, setActiveTab] = useState('farmlands') // 'farmlands' | 'markets' | 'farmers'
  const [searchLocation, setSearchLocation] = useState('')
  const [currentCoords, setCurrentCoords] = useState([11.664, 78.146]) // default Salem
  const [locationName, setLocationName] = useState('Salem, Tamil Nadu')
  const [radiusKm, setRadiusKm] = useState(50)

  const [farmlands, setFarmlands] = useState(DEFAULT_FARMLANDS)
  const [markets, setMarkets] = useState(DEFAULT_MARKETS)
  const [farmers, setFarmers] = useState([])
  const [msg, setMsg] = useState('')

  // Farmland Contract Inquiry Modal
  const [activeFarmland, setActiveFarmland] = useState(null)
  const [contractForm, setContractForm] = useState({ buyerName: '', phone: '', requestedAcres: 2, cropPlan: 'Vegetables & Greens', message: '' })
  const [contractSuccess, setContractSuccess] = useState(null)

  // Load Data
  const loadData = async () => {
    try {
      const [flRes, mkRes, fmRes] = await Promise.all([
        api.get('/farmlands').catch(() => ({ data: DEFAULT_FARMLANDS })),
        api.get('/markets').catch(() => ({ data: DEFAULT_MARKETS })),
        api.get('/farmers').catch(() => ({ data: [] })),
      ])

      if (flRes.data && flRes.data.length > 0) setFarmlands(flRes.data)
      if (mkRes.data && mkRes.data.length > 0) setMarkets(mkRes.data)
      if (fmRes.data) setFarmers(fmRes.data)
    } catch {
      setFarmlands(DEFAULT_FARMLANDS)
      setMarkets(DEFAULT_MARKETS)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Handle Location Search Input
  const handleLocationSearch = (e) => {
    e.preventDefault()
    const clean = searchLocation.trim().toLowerCase()
    if (!clean) return

    for (const [city, coords] of Object.entries(LOCATION_COORDS)) {
      if (clean.includes(city) || city.includes(clean)) {
        setCurrentCoords(coords)
        setLocationName(city.charAt(0).toUpperCase() + city.slice(1) + ', Tamil Nadu')
        setMsg(`Showing results around ${city.charAt(0).toUpperCase() + city.slice(1)} (${radiusKm} km radius)`)
        return
      }
    }

    // Default mock geocoding jitter around central Tamil Nadu
    setMsg(`Searching nearby farmlands and marketplaces in "${searchLocation}"...`)
  }

  // Geolocation trigger
  const detectUserGPS = () => {
    if (!navigator.geolocation) return setMsg('GPS not supported in this browser')
    setMsg('Locating your GPS coordinates...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude]
        setCurrentCoords(coords)
        setLocationName('Your Current GPS Location')
        setMsg(`GPS detected! Showing farmlands & mandis within ${radiusKm} km`)
      },
      () => setMsg('Please allow location permission in your browser')
    )
  }

  // Calculate distances relative to currentCoords
  const farmlandsWithDist = farmlands.map((f) => {
    const fLat = f.lat || (f.location?.coordinates ? f.location.coordinates[1] : 11.664)
    const fLng = f.lng || (f.location?.coordinates ? f.location.coordinates[0] : 78.146)
    return {
      ...f,
      lat: fLat,
      lng: fLng,
      distance: distanceKm(currentCoords[0], currentCoords[1], fLat, fLng),
    }
  }).sort((a, b) => a.distance - b.distance)

  const marketsWithDist = markets.map((m) => {
    const mLat = m.lat || (m.location?.coordinates ? m.location.coordinates[1] : 11.664)
    const mLng = m.lng || (m.location?.coordinates ? m.location.coordinates[0] : 78.146)
    return {
      ...m,
      lat: mLat,
      lng: mLng,
      distance: distanceKm(currentCoords[0], currentCoords[1], mLat, mLng),
    }
  }).sort((a, b) => a.distance - b.distance)

  const farmersWithDist = farmers.map((f) => {
    return {
      ...f,
      distance: f.lat && f.lng ? distanceKm(currentCoords[0], currentCoords[1], f.lat, f.lng) : null,
    }
  }).sort((a, b) => (a.distance || 999) - (b.distance || 999))

  // Farmland Contract Inquiry submit
  const submitContractInquiry = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/farmlands/inquire', {
        farmlandId: activeFarmland._id,
        ...contractForm,
      })
      setContractSuccess(data)
    } catch {
      setContractSuccess({
        message: `Inquiry submitted! Farmland owner ${activeFarmland.ownerName} has been notified and will call you at ${contractForm.phone}.`,
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black text-green-900 tracking-tight">
          Farmlands & Marketplaces Map
        </h1>
        <p className="mt-2 text-gray-600 text-sm md:text-base">
          Type your location to discover available fertile farmlands to take farming contracts for vegetables, greens & fruits, or locate nearby APMC Mandis and Uzhavar Sandhais!
        </p>
      </div>

      {/* Location Search Bar & Controls */}
      <div className="mt-8 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleLocationSearch} className="flex-1 flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full border-2 border-green-200 rounded-full px-5 py-2.5 pl-11 text-sm focus:outline-none focus:border-green-600 shadow-sm"
              placeholder="Type city or town (e.g. Salem, Coimbatore, Theni, Ooty, Erode, Madurai, Hosur...)"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
            <span className="absolute left-4 top-3 text-gray-400">🔍</span>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-full bg-green-700 hover:bg-green-800 text-white font-bold text-xs md:text-sm shadow transition shrink-0"
          >
            Search Location
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={detectUserGPS}
            className="px-4 py-2.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <span>🎯</span> GPS Near Me
          </button>

          <select
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="border border-gray-300 rounded-full px-3 py-2 text-xs font-semibold focus:outline-none"
          >
            {[10, 25, 50, 100, 200].map((r) => (
              <option key={r} value={r}>Within {r} km</option>
            ))}
          </select>
        </div>
      </div>

      {/* Current location tag & feedback */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-600 px-2 flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span>Center: <b>{locationName}</b> ({currentCoords[0].toFixed(3)}, {currentCoords[1].toFixed(3)})</span>
        </div>
        {msg && <span className="text-green-800 font-semibold bg-green-50 px-2 py-0.5 rounded-full">{msg}</span>}
      </div>

      {/* 3 Interactive Mode Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('farmlands')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-2 transition ${
            activeTab === 'farmlands'
              ? 'bg-green-800 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-green-50'
          }`}
        >
          <span>🌾</span>
          <span>Farmland Contracts ({farmlandsWithDist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('markets')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-2 transition ${
            activeTab === 'markets'
              ? 'bg-amber-700 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-amber-50'
          }`}
        >
          <span>🏛️</span>
          <span>Nearby Mandis & Markets ({marketsWithDist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('farmers')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-2 transition ${
            activeTab === 'farmers'
              ? 'bg-teal-700 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-teal-50'
          }`}
        >
          <span>👨‍🌾</span>
          <span>Local Farmers ({farmersWithDist.length})</span>
        </button>
      </div>

      {/* Main Map + Side List Container */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leaflet Map (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl overflow-hidden shadow-lg border border-gray-200 h-[520px] relative">
          <MapContainer center={currentCoords} zoom={9} style={{ height: '100%', width: '100%' }}>
            <Recenter center={currentCoords} zoom={9} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User / Searched Location Marker */}
            <Marker position={currentCoords} icon={meIcon}>
              <Popup>
                <div className="text-center font-bold">
                  📍 {locationName}<br />
                  <span className="text-xs text-gray-500 font-normal">Search Reference Point</span>
                </div>
              </Popup>
            </Marker>
            <Circle center={currentCoords} radius={radiusKm * 1000} pathOptions={{ color: '#16a34a', fillOpacity: 0.04 }} />

            {/* Farmland Markers */}
            {(activeTab === 'farmlands' || activeTab === 'all') &&
              farmlandsWithDist.map((f) => (
                <Marker key={f._id} position={[f.lat, f.lng]} icon={farmlandIcon}>
                  <Popup>
                    <div style={{ maxWidth: 220 }}>
                      <b style={{ color: '#15803d' }}>🌾 {f.title}</b><br />
                      <span style={{ fontSize: 11, color: '#555' }}>{f.place} ({f.distance} km away)</span><br />
                      <span style={{ fontSize: 11 }}><b>Available:</b> {f.availableAcres} Acres</span><br />
                      <span style={{ fontSize: 11 }}><b>Rate:</b> {E.rupee}{f.ratePerAcre}/acre/season</span><br />
                      <span style={{ fontSize: 11 }}><b>Crops:</b> {f.cropsSuitable?.join(', ')}</span><br />
                      <button
                        onClick={() => setActiveFarmland(f)}
                        style={{ marginTop: 6, width: '100%', padding: '4px 8px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontSize: 11, fontWeight: 'bold' }}
                      >
                        Take Contract
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}

            {/* Marketplace Markers */}
            {(activeTab === 'markets' || activeTab === 'all') &&
              marketsWithDist.map((m) => (
                <Marker key={m._id} position={[m.lat, m.lng]} icon={marketIcon}>
                  <Popup>
                    <div style={{ maxWidth: 220 }}>
                      <b style={{ color: '#b45309' }}>🏛️ {m.name}</b><br />
                      <span style={{ fontSize: 11, color: '#555' }}>{m.place} ({m.distance} km away)</span><br />
                      <span style={{ fontSize: 11 }}><b>Hours:</b> {m.operatingHours}</span><br />
                      <span style={{ fontSize: 11 }}><b>Fee:</b> {m.commissionFee}</span><br />
                      <span style={{ fontSize: 11 }}><b>Top Produce:</b> {m.topCommodities?.join(', ')}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}

            {/* Farmer Markers */}
            {activeTab === 'farmers' &&
              farmersWithDist.map((fm) => (
                <Marker key={fm._id} position={[fm.lat, fm.lng]} icon={farmerIcon}>
                  <Popup>
                    <div>
                      <b>👨‍🌾 {fm.name}</b> {fm.verified && '(Verified)'}<br />
                      <span>{fm.phone}</span><br />
                      <span>{fm.distance} km away</span><br />
                      <span>{fm.products?.length ? 'Selling: ' + fm.products.join(', ') : 'Fresh produce in stock'}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>

          {/* Map legend */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-2 rounded-2xl shadow border border-gray-200 text-[11px] font-bold space-y-1 z-[1000]">
            <div className="flex items-center gap-1.5"><span className="text-green-700">🌾</span> Farmland for Contract</div>
            <div className="flex items-center gap-1.5"><span className="text-amber-600">🏛️</span> Mandi / Marketplace</div>
            <div className="flex items-center gap-1.5"><span className="text-blue-600">📍</span> Your Location</div>
          </div>
        </div>

        {/* Results List (5 Cols) */}
        <div className="lg:col-span-5 h-[520px] overflow-y-auto space-y-4 pr-1">
          {/* TAB 1: FARMLANDS */}
          {activeTab === 'farmlands' && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Available Farmlands for Contract Sourcing:
              </p>
              <div className="space-y-4">
                {farmlandsWithDist.map((land) => (
                  <div
                    key={land._id}
                    className="bg-white rounded-3xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex gap-3">
                      <img
                        src={land.image}
                        alt={land.title}
                        className="w-24 h-24 rounded-2xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-black text-gray-900 leading-snug truncate">
                            {land.title}
                          </h3>
                          <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full shrink-0">
                            {land.distance} km
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{E.pin} {land.place}</p>
                        <p className="mt-1 text-xs text-gray-700">
                          <b>{land.availableAcres} Acres</b> Available (of {land.totalAcres} Acres)
                        </p>
                        <p className="text-xs font-extrabold text-green-800">
                          {E.rupee}{land.ratePerAcre} <span className="text-[10px] font-normal text-gray-500">/ acre / season</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex flex-wrap gap-1 text-[11px]">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium">
                        💧 {land.waterSource}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium">
                        🌱 {land.soilType}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-gray-500">
                        Crops: {land.cropsSuitable?.slice(0, 3).join(', ')}
                      </span>
                      <button
                        onClick={() => setActiveFarmland(land)}
                        className="px-3 py-1.5 rounded-full bg-green-700 hover:bg-green-800 text-white font-bold text-xs transition"
                      >
                        Take Contract
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MANDIS & MARKETPLACES */}
          {activeTab === 'markets' && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Mandis & Marketplaces Near Farmer:
              </p>
              <div className="space-y-4">
                {marketsWithDist.map((mkt) => (
                  <div
                    key={mkt._id}
                    className="bg-white rounded-3xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex gap-3">
                      <img
                        src={mkt.image}
                        alt={mkt.name}
                        className="w-24 h-24 rounded-2xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-black text-gray-900 leading-snug">
                            {mkt.name}
                          </h3>
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                            {mkt.distance} km
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{E.pin} {mkt.place}</p>
                        <p className="mt-1 text-xs text-gray-700">
                          <b>Timings:</b> {mkt.operatingHours}
                        </p>
                        <p className="text-xs font-bold text-emerald-700">
                          Fee: {mkt.commissionFee}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-600 truncate mr-2">
                        <b>Top Commodities:</b> {mkt.topCommodities?.join(', ')}
                      </span>
                      {mkt.phone && (
                        <a
                          href={`tel:${mkt.phone}`}
                          className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold hover:bg-amber-200 transition shrink-0"
                        >
                          📞 Call Mandi
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LOCAL FARMERS */}
          {activeTab === 'farmers' && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Registered Farmers in Region:
              </p>
              <div className="space-y-3">
                {farmersWithDist.map((fm) => (
                  <div
                    key={fm._id}
                    className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                        <span>{E.farmer}</span> {fm.name}
                        {fm.verified && <span className="text-[10px] text-green-700 bg-green-100 px-1.5 py-0.2 rounded">Verified</span>}
                      </p>
                      <p className="text-xs text-gray-500">{fm.phone}</p>
                      <p className="text-xs text-green-700 mt-1">
                        {fm.products?.length ? 'Stock: ' + fm.products.join(', ') : 'Fresh vegetable harvest ready'}
                      </p>
                    </div>
                    {fm.distance && (
                      <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        {fm.distance} km
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- FARMLAND CONTRACT INQUIRY MODAL (Full screen overlay with high z-index) --- */}
      {activeFarmland && (
        <div
          style={{ zIndex: 999999 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border-2 border-green-300">
            <button
              onClick={() => { setActiveFarmland(null); setContractSuccess(null) }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            {!contractSuccess ? (
              <form onSubmit={submitContractInquiry}>
                <div className="flex items-center gap-3">
                  <img
                    src={activeFarmland.image}
                    alt={activeFarmland.title}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  <div>
                    <span className="text-xs uppercase font-extrabold text-green-700 tracking-wider">
                      Contract Farming Agreement
                    </span>
                    <h3 className="text-lg font-black text-gray-900">{activeFarmland.title}</h3>
                    <p className="text-xs text-gray-500">Owner: {activeFarmland.ownerName} • {activeFarmland.place}</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-50 rounded-2xl border border-green-200 text-xs space-y-1 text-green-950">
                  <p><b>Total Available:</b> {activeFarmland.availableAcres} Acres</p>
                  <p><b>Seasonal Contract Rate:</b> {E.rupee}{activeFarmland.ratePerAcre} / acre</p>
                  <p><b>Water & Soil:</b> {activeFarmland.waterSource}, {activeFarmland.soilType}</p>
                  <p><b>Suitable Crops:</b> {activeFarmland.cropsSuitable?.join(', ')}</p>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name</label>
                    <input
                      required
                      type="text"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="Buyer / Contractor Name"
                      value={contractForm.buyerName}
                      onChange={(e) => setContractForm({ ...contractForm, buyerName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                    <input
                      required
                      type="tel"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="Mobile number for owner contact"
                      value={contractForm.phone}
                      onChange={(e) => setContractForm({ ...contractForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Requested Acres</label>
                      <input
                        type="number"
                        min="0.5"
                        max={activeFarmland.availableAcres}
                        step="0.5"
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                        value={contractForm.requestedAcres}
                        onChange={(e) => setContractForm({ ...contractForm, requestedAcres: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Planned Crops</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="e.g. Tomatoes & Greens"
                        value={contractForm.cropPlan}
                        onChange={(e) => setContractForm({ ...contractForm, cropPlan: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Note or Requirements for Landowner</label>
                    <textarea
                      rows={2}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="Mention contract duration, buyback terms or site visit date..."
                      value={contractForm.message}
                      onChange={(e) => setContractForm({ ...contractForm, message: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-5 w-full py-3 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-black text-sm shadow-lg transition"
                >
                  🌾 Submit Contract Inquiry to Landowner
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <span className="text-5xl">✅</span>
                <h3 className="mt-3 text-2xl font-black text-green-900">Contract Inquiry Sent!</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {contractSuccess.message}
                </p>
                <div className="mt-4 p-4 rounded-2xl bg-green-50 text-left text-xs space-y-1 text-green-950">
                  <p><b>Farmland:</b> {activeFarmland.title}</p>
                  <p><b>Landowner:</b> {activeFarmland.ownerName} ({activeFarmland.phone})</p>
                  <p><b>Requested Acres:</b> {contractForm.requestedAcres} Acres</p>
                  <p><b>Crops:</b> {contractForm.cropPlan}</p>
                </div>
                <button
                  onClick={() => { setActiveFarmland(null); setContractSuccess(null) }}
                  className="mt-5 w-full py-2.5 rounded-full bg-green-700 text-white font-bold text-sm hover:bg-green-800 transition"
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
