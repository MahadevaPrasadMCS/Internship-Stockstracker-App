import React, { useState, useEffect } from 'react'

export default function Settings() {
  const [key, setKey] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const savedKey = localStorage.getItem('ALPHA_VANTAGE_API_KEY')
    if (savedKey) setKey(savedKey)
  }, [])

  const handleSave = () => {
    if (!key.trim()) {
      showToast('❌ API key cannot be empty', 'error')
      return
    }
    localStorage.setItem('ALPHA_VANTAGE_API_KEY', key.trim())
    showToast('✅ API key saved locally')
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2000)
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Settings</h2>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow border border-gray-100">
        <label className="block text-sm mb-2 font-medium text-gray-600">
          Alpha Vantage API Key (Development Only)
        </label>

        <input
          value={key}
          onChange={e => setKey(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="Enter your Alpha Vantage API key"
        />

        <button
          onClick={handleSave}
          className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Save Key
        </button>

        <p className="mt-3 text-xs text-gray-500 leading-relaxed">
          ⚠️ This key is stored locally in your browser for testing.
          Never commit it to your repository. In production, keep it on your
          backend or a secure environment variable.
        </p>
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow text-sm font-medium text-white animate-fadeIn ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
}
