import { useEffect, useState, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import api from '../api'
import LocationButton from '../components/LocationButton'

const tags = ['hair', 'skin', 'immunity', 'digestion']

const emptyForm = {
  name: '',
  category: 'vegetable',
  price: '',
  quantity: '',
  unit: 'kg',
  discount: '',
  place: '',
  healthNote: '',
  isJuiceSuitable: false,
  juicePrice: '',
}

// Load my products from localStorage
const loadLocalProducts = (username) => {
  try {
    return JSON.parse(localStorage.getItem(`myproducts_${username}`) || '[]')
  } catch { return [] }
}

// Save my products to localStorage
const saveLocalProducts = (username, products) => {
  localStorage.setItem(`myproducts_${username}`, JSON.stringify(products))
}

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [selectedBenefits, setSelectedBenefits] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  if (!user || user.role !== 'farmer') return <Navigate to="/" />

  const loadProducts = async () => {
    // Try backend first, fall back to localStorage
    try {
      const { data } = await api.get('/products/mine')
      if (data && data.length > 0) {
        setItems(data)
        return
      }
    } catch {}
    // Load from localStorage
    setItems(loadLocalProducts(user.name))
  }

  useEffect(() => { loadProducts() }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const toggleBenefit = (tag) => {
    setSelectedBenefits((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setMsg({ text: 'Please enter a product name.', type: 'error' })
    if (!form.price || isNaN(form.price)) return setMsg({ text: 'Please enter a valid price.', type: 'error' })
    if (!form.quantity || isNaN(form.quantity)) return setMsg({ text: 'Please enter quantity.', type: 'error' })

    setLoading(true)
    setMsg({ text: '', type: '' })

    const newProduct = {
      _id: 'local_' + Date.now(),
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      quantity: Number(form.quantity),
      unit: form.unit,
      discount: Number(form.discount) || 0,
      place: form.place.trim(),
      healthNote: form.healthNote.trim(),
      healthBenefits: selectedBenefits,
      isJuiceSuitable: form.isJuiceSuitable,
      juicePrice: form.juicePrice ? Number(form.juicePrice) : null,
      image: imagePreview || null,
      farmer: { name: user.name },
      rating: 4.8,
      harvestTime: 'Fresh harvest',
      addedAt: new Date().toLocaleString(),
    }

    // Try backend upload
    let savedViaBackend = false
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      fd.append('healthBenefits', selectedBenefits.join(','))
      if (imageFile) fd.append('image', imageFile)
      await api.post('/products', fd)
      savedViaBackend = true
    } catch {}

    if (!savedViaBackend) {
      // Save to localStorage
      const existing = loadLocalProducts(user.name)
      const updated = [newProduct, ...existing]
      saveLocalProducts(user.name, updated)
      setItems(updated)
    } else {
      loadProducts()
    }

    setMsg({ text: '✅ Product added successfully! Visible in My Products below.', type: 'success' })
    setForm(emptyForm)
    setSelectedBenefits([])
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      loadProducts()
    } catch {
      const updated = loadLocalProducts(user.name).filter((p) => p._id !== id)
      saveLocalProducts(user.name, updated)
      setItems(updated)
    }
    setMsg({ text: 'Product removed.', type: 'info' })
  }

  const handleRestock = (id) => {
    const q = prompt('Enter new stock quantity:')
    if (q === null || q === '' || isNaN(q)) return
    const updated = loadLocalProducts(user.name).map((p) =>
      p._id === id ? { ...p, quantity: Number(q) } : p
    )
    saveLocalProducts(user.name, updated)
    setItems(updated)
    setMsg({ text: '✅ Stock updated!', type: 'success' })
  }

  const categoryIcon = { vegetable: '🥕', greens: '🌿', fruit: '🍎' }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-green-900 flex items-center gap-2">
          👨‍🌾 Farmer Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, <b>{user.name}</b>! Add your farm produce below to list it for buyers.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">

        {/* ── ADD PRODUCT FORM ── */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4"
        >
          <h2 className="text-xl font-black text-green-800 flex items-center gap-2">
            ➕ Add New Product
          </h2>

          <LocationButton />

          {/* Message */}
          {msg.text && (
            <div className={`p-3 rounded-xl text-sm font-semibold text-center ${
              msg.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' :
              msg.type === 'error' ? 'bg-red-100 text-red-700 border border-red-300' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {msg.text}
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-xs font-extrabold text-gray-700 mb-1">Product Name *</label>
            <input
              required
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. Salem Country Tomatoes"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-extrabold text-gray-700 mb-1">Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="vegetable">🥕 Vegetable</option>
              <option value="greens">🌿 Greens (Keerai)</option>
              <option value="fruit">🍎 Fruit</option>
            </select>
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1">Price (₹) *</label>
              <input
                required
                name="price"
                type="number"
                min="1"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. 35"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1">Quantity *</label>
              <input
                required
                name="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. 100"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1">Unit</label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="kg">kg</option>
                <option value="bunch">bunch</option>
                <option value="piece">piece</option>
                <option value="dozen">dozen</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1">Discount %</label>
              <input
                name="discount"
                type="number"
                min="0"
                max="90"
                value={form.discount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. 10"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-extrabold text-gray-700 mb-1">Farm Location / Village</label>
            <input
              name="place"
              type="text"
              value={form.place}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. Salem, Tamil Nadu"
            />
          </div>

          {/* Health Benefits */}
          <div>
            <label className="block text-xs font-extrabold text-gray-700 mb-2">Health Benefits</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleBenefit(t)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-bold transition ${
                    selectedBenefits.includes(t)
                      ? 'bg-green-700 text-white border-green-700 shadow-sm'
                      : 'border-green-400 text-green-700 hover:bg-green-50'
                  }`}
                >
                  {t === 'hair' ? '💇 Hair' : t === 'skin' ? '✨ Skin' : t === 'immunity' ? '🛡️ Immunity' : '⚡ Digestion'}
                </button>
              ))}
            </div>
          </div>

          {/* Health Note */}
          <div>
            <label className="block text-xs font-extrabold text-gray-700 mb-1">Health Note</label>
            <input
              name="healthNote"
              type="text"
              value={form.healthNote}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. Rich in Vitamin C and antioxidants"
            />
          </div>

          {/* Juice Shop for Fruits */}
          {form.category === 'fruit' && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-orange-900 cursor-pointer">
                <input
                  type="checkbox"
                  name="isJuiceSuitable"
                  checked={form.isJuiceSuitable}
                  onChange={handleChange}
                  className="w-4 h-4 accent-orange-600"
                />
                🥤 Suitable for Direct Juice Shop Sourcing
              </label>
              {form.isJuiceSuitable && (
                <input
                  name="juicePrice"
                  type="number"
                  value={form.juicePrice}
                  onChange={handleChange}
                  className="w-full border border-orange-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Juice wholesale price per kg (₹)"
                />
              )}
            </div>
          )}

          {/* ── IMAGE UPLOAD SECTION ── */}
          <div>
            <label className="block text-xs font-extrabold text-gray-700 mb-2">
              Product Photo <span className="text-gray-400 font-normal">(Required — buyers want to see the product)</span>
            </label>

            {/* Image Preview */}
            {imagePreview ? (
              <div className="relative w-full h-44 rounded-2xl overflow-hidden border-2 border-green-400 shadow-sm mb-2">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow transition"
                >
                  ✕ Remove
                </button>
                <div className="absolute bottom-2 left-2 bg-green-700/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  ✅ Photo Ready
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 border-2 border-dashed border-green-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
              >
                <span className="text-4xl mb-2">📸</span>
                <p className="text-sm font-bold text-green-700">Click to Upload Product Photo</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — from your phone or computer</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            {!imagePreview && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 w-full py-2 rounded-xl border-2 border-green-400 text-green-700 font-bold text-xs hover:bg-green-50 transition flex items-center justify-center gap-2"
              >
                📷 Choose Photo from Device
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <><span className="animate-spin">⏳</span> Adding Product...</>
            ) : (
              <>➕ Add Product to My Listings</>
            )}
          </button>
        </form>

        {/* ── MY PRODUCTS LIST ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-green-800">📦 My Products</h2>
            <span className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full">
              {items.length} listed
            </span>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-10 text-center">
              <span className="text-5xl">🌱</span>
              <p className="mt-3 text-gray-700 font-semibold">No products listed yet.</p>
              <p className="text-xs text-gray-400 mt-1">Fill the form on the left and add your first product!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex gap-0 hover:shadow-md transition"
                >
                  {/* Product Image */}
                  <div className="w-28 shrink-0 bg-gray-100 relative">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover min-h-[100px]"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[100px] flex items-center justify-center text-4xl bg-green-50">
                        {categoryIcon[p.category] || '🌾'}
                      </div>
                    )}
                    <span className="absolute top-1 left-1 bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded capitalize">
                      {p.category}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-3.5">
                    <h3 className="font-extrabold text-sm text-gray-900 leading-snug">{p.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">📍 {p.place || 'Farm'}</p>

                    <div className="mt-2 flex items-center gap-3 flex-wrap">
                      <span className="text-base font-black text-green-800">
                        ₹{Math.round(p.price * (1 - (p.discount || 0) / 100))}/{p.unit}
                      </span>
                      {p.discount > 0 && (
                        <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                          {p.discount}% OFF
                        </span>
                      )}
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        p.quantity > 0
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {p.quantity > 0 ? `${p.quantity} ${p.unit} in stock` : 'SOLD OUT'}
                      </span>
                    </div>

                    {p.healthBenefits?.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {p.healthBenefits.map((h) => (
                          <span key={h} className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded font-semibold capitalize">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-2.5 flex gap-2">
                      <button
                        onClick={() => handleRestock(p._id)}
                        className="text-xs px-3 py-1 rounded-full border border-green-500 text-green-700 hover:bg-green-50 font-bold transition"
                      >
                        🔄 Restock
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-xs px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
