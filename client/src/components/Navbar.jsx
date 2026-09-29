import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { E } from '../icons'

export default function Navbar() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' | 'register'

  // Auth Form State
  const [authForm, setAuthForm] = useState({ username: '', password: '', role: 'buyer' })
  const [authMsg, setAuthMsg] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const location = useLocation()

  // Show modal on first visit if not logged in (cannot be dismissed without account)
  useEffect(() => {
    if (!user) {
      setShowAuthModal(true)
    }
  }, [user])

  // Listen to user updates across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user') || 'null'))
    }
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('user-updated', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('user-updated', handleStorageChange)
    }
  }, [])

  // Get saved accounts list from localStorage
  const getAccounts = () => JSON.parse(localStorage.getItem('agritech_accounts') || '[]')

  const saveAccount = (account) => {
    const accounts = getAccounts()
    const exists = accounts.find((a) => a.username.toLowerCase() === account.username.toLowerCase())
    if (!exists) {
      accounts.push(account)
      localStorage.setItem('agritech_accounts', JSON.stringify(accounts))
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    setAuthForm({ username: '', password: '', role: 'buyer' })
    setAuthMsg('')
    setShowPassword(false)
    setAuthMode('login')
    setShowAuthModal(true)
  }

  // ── LOGIN: Validate against saved local accounts ──
  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setAuthMsg('')
    const username = authForm.username.trim()
    const password = authForm.password

    if (!username) return setAuthMsg('Please enter your username.')
    if (!password) return setAuthMsg('Please enter your password.')

    const accounts = getAccounts()
    const match = accounts.find(
      (a) =>
        a.username.toLowerCase() === username.toLowerCase() &&
        a.password === password
    )

    if (!match) {
      setAuthMsg('❌ Wrong username or password. Please try again or create an account.')
      return
    }

    const userData = { name: match.username, role: match.role || 'buyer' }
    localStorage.setItem('token', 'agritech_local_token')
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setShowAuthModal(false)
    setAuthForm({ username: '', password: '', role: 'buyer' })
    window.dispatchEvent(new Event('user-updated'))
  }

  // ── CREATE ACCOUNT: Save credentials to localStorage accounts list ──
  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    setAuthMsg('')
    const username = authForm.username.trim()
    const password = authForm.password

    if (!username) return setAuthMsg('Please choose a username.')
    if (username.length < 3) return setAuthMsg('Username must be at least 3 characters.')
    if (password.length < 6) return setAuthMsg('Password must be at least 6 characters.')

    const accounts = getAccounts()
    const alreadyExists = accounts.find(
      (a) => a.username.toLowerCase() === username.toLowerCase()
    )
    if (alreadyExists) {
      return setAuthMsg('⚠️ Username already taken. Please choose a different username or login.')
    }

    // Save new account credentials
    const newAccount = { username, password, role: authForm.role || 'buyer' }
    saveAccount(newAccount)

    // Log in immediately after account creation
    const userData = { name: username, role: authForm.role || 'buyer' }
    localStorage.setItem('token', 'agritech_local_token')
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setShowAuthModal(false)
    setAuthForm({ username: '', password: '', role: 'buyer' })
    window.dispatchEvent(new Event('user-updated'))
  }

  const isActive = (path) => location.pathname === path

  const linkClass = (path) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm font-bold transition ${
      isActive(path)
        ? 'bg-green-700 text-white shadow-sm'
        : 'text-gray-700 hover:text-green-800 hover:bg-green-50'
    }`

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2.5">
          {/* Brand Title: AgriTech */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-black text-green-800 tracking-tight hover:opacity-95 transition">
            <span className="text-3xl">{E.farm}</span>
            <span>AgriTech</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link to="/" className={linkClass('/')}>
              <span>🏠</span> Home
            </Link>
            <Link to="/products" className={linkClass('/products')}>
              <span>🥬</span> Fresh Stock
            </Link>
            <Link to="/fruits-juice" className={linkClass('/fruits-juice')}>
              <span>🥤</span> Fruits & Juice Shops
            </Link>
            <Link to="/waste-listing" className={linkClass('/waste-listing')}>
              <span>🐄</span> Cow Shelters
            </Link>
            <Link to="/map" className={linkClass('/map')}>
              <span>🌾</span> Farmland & Mandis
            </Link>
            {user?.role === 'farmer' && (
              <Link to="/dashboard" className={linkClass('/dashboard')}>
                <span>👨‍🌾</span> Farmer Dashboard
              </Link>
            )}
          </div>

          {/* Right Side: Username Display */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-green-100 text-green-950 border-2 border-green-300 px-3.5 py-1.5 rounded-full text-xs font-black shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-green-700 text-white flex items-center justify-center text-[11px]">
                    👤
                  </span>
                  <span>{user.name}</span>
                  {user.role && (
                    <span className="text-[10px] bg-green-800 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                      {user.role}
                    </span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition shadow-xs"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setAuthMode('login'); setShowAuthModal(true) }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-700 hover:bg-green-800 text-white text-xs sm:text-sm font-black shadow-md transition"
              >
                <span>👤</span> Login / Create Account
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-gray-100 bg-white text-[11px] font-bold px-1 overflow-x-auto">
          <Link to="/" className={`px-2 py-1 rounded-lg shrink-0 ${isActive('/') ? 'text-green-800 bg-green-100' : 'text-gray-600'}`}>
            🏠 Home
          </Link>
          <Link to="/products" className={`px-2 py-1 rounded-lg shrink-0 ${isActive('/products') ? 'text-green-800 bg-green-100' : 'text-gray-600'}`}>
            🥬 Stock
          </Link>
          <Link to="/fruits-juice" className={`px-2 py-1 rounded-lg shrink-0 ${isActive('/fruits-juice') ? 'text-green-800 bg-green-100' : 'text-gray-600'}`}>
            🥤 Juice
          </Link>
          <Link to="/waste-listing" className={`px-2 py-1 rounded-lg shrink-0 ${isActive('/waste-listing') ? 'text-green-800 bg-green-100' : 'text-gray-600'}`}>
            🐄 Cows
          </Link>
          <Link to="/map" className={`px-2 py-1 rounded-lg shrink-0 ${isActive('/map') ? 'text-green-800 bg-green-100' : 'text-gray-600'}`}>
            🌾 Map
          </Link>
        </div>
      </nav>

      {/* ── AUTH MODAL ── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border-2 border-green-200">

            {/* Header */}
            <div className="text-center mb-5">
              <span className="text-4xl">🌾</span>
              <h2 className="text-2xl font-black text-green-950 mt-1">Welcome to AgriTech</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {authMode === 'login'
                  ? 'Sign in with your username and password'
                  : 'Create your account to get started'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-gray-100 p-1 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthMsg(''); setShowPassword(false) }}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
                  authMode === 'login' ? 'bg-green-700 text-white shadow-sm' : 'text-gray-600 hover:text-green-800'
                }`}
              >
                🔑 Sign In (Login)
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthMsg(''); setShowPassword(false) }}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
                  authMode === 'register' ? 'bg-green-700 text-white shadow-sm' : 'text-gray-600 hover:text-green-800'
                }`}
              >
                ✨ Create Account
              </button>
            </div>

            {/* Error / Info Message */}
            {authMsg && (
              <p className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold p-2.5 rounded-xl mb-4 text-center">
                {authMsg}
              </p>
            )}

            {/* ── LOGIN FORM ── */}
            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1">Username</label>
                  <input
                    required
                    type="text"
                    autoComplete="username"
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-xs"
                    placeholder="Enter your username"
                    value={authForm.username}
                    onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-xs"
                      placeholder="Enter your password"
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-lg transition"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-green-700 hover:bg-green-800 text-white font-black text-sm shadow-md transition"
                >
                  🔑 Login & Show Home Page
                </button>

                <p className="text-center text-xs text-gray-500 pt-1">
                  New here?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setAuthMsg(''); setShowPassword(false) }}
                    className="text-green-700 font-bold underline hover:text-green-900"
                  >
                    Create an Account
                  </button>
                </p>
              </form>
            ) : (
              /* ── CREATE ACCOUNT FORM ── */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1">Choose Username</label>
                  <input
                    required
                    type="text"
                    autoComplete="username"
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-xs"
                    placeholder="e.g. Ramesh07 or shree"
                    value={authForm.username}
                    onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1">
                    Choose Password <span className="text-gray-400 font-normal">(min 6 characters)</span>
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      minLength={6}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-xs"
                      placeholder="Create a strong password"
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-lg transition"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {/* Password strength hint */}
                  {authForm.password.length > 0 && (
                    <p className={`mt-1 text-[11px] font-semibold ${
                      authForm.password.length < 6 ? 'text-red-500' :
                      authForm.password.length < 8 ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      {authForm.password.length < 6 ? '⚠️ Too short' :
                       authForm.password.length < 8 ? '🔶 Okay password' : '✅ Strong password'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1">I am a...</label>
                  <select
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-xs"
                    value={authForm.role}
                    onChange={(e) => setAuthForm({ ...authForm, role: e.target.value })}
                  >
                    <option value="buyer">🛒 Produce Buyer / Consumer</option>
                    <option value="farmer">👨‍🌾 Farmer / Producer</option>
                    <option value="collector">🐄 Cow Shelter / Waste Collector</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-green-700 hover:bg-green-800 text-white font-black text-sm shadow-md transition"
                >
                  ✨ Create Account & Go to Home
                </button>

                <p className="text-center text-xs text-gray-500 pt-1">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setAuthMsg(''); setShowPassword(false) }}
                    className="text-green-700 font-bold underline hover:text-green-900"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
