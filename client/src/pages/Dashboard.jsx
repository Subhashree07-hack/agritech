import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import api from '../api'
import ProductImage from '../components/ProductImage'
import LocationButton from '../components/LocationButton'

const tags = ['hair', 'skin', 'immunity', 'digestion']
const empty = { name: '', price: '', quantity: '', unit: 'kg', place: '', discount: 0, category: 'vegetable' }

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [selected, setSelected] = useState([])
  const [image, setImage] = useState(null)
  const [msg, setMsg] = useState('')

  const load = async () => {
    const { data } = await api.get('/products/mine')
    setItems(data)
  }

  useEffect(() => { if (user?.role === 'farmer') load() }, [])

  if (!user || user.role !== 'farmer') return <Navigate to="/login" />

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const toggle = (t) => setSelected(selected.includes(t) ? selected.filter((x) => x !== t) : [...selected, t])

  const submit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append('healthBenefits', selected.join(','))
    if (image) fd.append('image', image)
    try {
      await api.post('/products', fd)
      setMsg('Product added!')
      e.target.reset()
      setForm(empty)
      setSelected([])
      setImage(null)
      load()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to add')
    }
  }

  const remove = async (id) => {
    await api.delete(`/products/${id}`)
    load()
  }

  const restock = async (id) => {
    const q = prompt('New quantity?')
    if (q === null || q === '') return
    await api.put(`/products/${id}`, { quantity: q })
    load()
  }

  const input = 'w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      <form onSubmit={submit} className="fade-up bg-white p-6 rounded-2xl shadow space-y-3">
        <h2 className="text-2xl font-bold text-green-700">Add Product</h2>
        <LocationButton />
        {msg && <p className="bg-green-100 text-green-800 p-2 rounded text-sm">{msg}</p>}
        <input className={input} name="name" placeholder="Product name (English, e.g. Tomato)" onChange={change} required />
        <select className={input} name="category" onChange={change}>
          <option value="vegetable">Vegetable</option>
          <option value="greens">Greens</option>
          <option value="fruit">Fruit</option>
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input className={input} name="price" type="number" placeholder="Price (Rs)" onChange={change} required />
          <input className={input} name="quantity" type="number" placeholder="Quantity" onChange={change} required />
          <select className={input} name="unit" onChange={change}>
            <option>kg</option><option>bunch</option><option>piece</option><option>dozen</option>
          </select>
          <input className={input} name="discount" type="number" placeholder="Discount %" onChange={change} />
        </div>
        <input className={input} name="place" placeholder="Village / District (e.g. Salem)" onChange={change} />
        <div>
          <p className="text-sm font-medium mb-1">Health benefits</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => toggle(t)}
                className={`px-3 py-1 rounded-full border text-sm transition ${
                  selected.includes(t) ? 'bg-green-600 text-white border-green-600' : 'border-green-600 text-green-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <input className={input} name="healthNote" placeholder="Health note (e.g. Rich in Vitamin C & collagen)" onChange={change} />
        {form.category === 'fruit' && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-orange-950 cursor-pointer">
              <input
                type="checkbox"
                name="isJuiceSuitable"
                checked={form.isJuiceSuitable || false}
                onChange={(e) => setForm({ ...form, isJuiceSuitable: e.target.checked })}
              />
              <span>🥤 Suitable for Direct Juice Shop Sourcing</span>
            </label>
            {form.isJuiceSuitable && (
              <input
                className={input}
                name="juicePrice"
                type="number"
                placeholder="Juice wholesale price per kg (Rs)"
                onChange={change}
              />
            )}
          </div>
        )}
        <p className="text-xs text-gray-500">Photo is optional. If you skip it, a picture is found automatically.</p>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <button className="w-full py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition">Add Product</button>
      </form>

      <div>
        <h2 className="text-2xl font-bold text-green-700 mb-4">My Products</h2>
        <div className="space-y-3">
          {items.length === 0 && <p className="text-gray-500">Nothing listed yet.</p>}
          {items.map((p) => (
            <div key={p._id} className="card-lift bg-white p-4 rounded-xl flex items-center gap-4">
              <ProductImage product={p} className="w-16 h-16 rounded-lg" />
              <div className="flex-1">
                <p className="font-semibold">{p.name} <span className="text-sm text-gray-500">Rs {p.price}/{p.unit}</span></p>
                <p className="text-sm">
                  {p.quantity > 0
                    ? <span className="text-green-700">{p.quantity} {p.unit} in stock</span>
                    : <span className="text-red-600 font-semibold">SOLD OUT (hidden from buyers)</span>}
                </p>
              </div>
              <button onClick={() => restock(p._id)} className="text-sm px-3 py-1 rounded-full border border-green-600 text-green-700 hover:bg-green-50">Restock</button>
              <button onClick={() => remove(p._id)} className="text-sm px-3 py-1 rounded-full bg-red-500 text-white hover:bg-red-600">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

