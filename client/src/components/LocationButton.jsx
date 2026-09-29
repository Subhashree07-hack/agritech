import { useState } from 'react'
import api from '../api'

export default function LocationButton() {
  const [msg, setMsg] = useState('')

  const save = () => {
    if (!navigator.geolocation) {
      setMsg('Location is not supported in this browser')
      return
    }
    setMsg('Getting your location...')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await api.put('/farmers/location', { lat: pos.coords.latitude, lng: pos.coords.longitude })
          setMsg('Farm location saved! Buyers can now see you on the map.')
        } catch {
          setMsg('Could not save location')
        }
      },
      () => setMsg('Please allow location permission in the browser')
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={save}
        className="w-full py-2 rounded-full border-2 border-green-600 text-green-700 hover:bg-green-50 transition"
      >
        Use my current location as farm location
      </button>
      {msg && <p className="mt-1 text-xs text-gray-600">{msg}</p>}
    </div>
  )
}
