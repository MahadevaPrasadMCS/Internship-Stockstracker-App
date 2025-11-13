import React from 'react'
import { Bell, LogOut, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ onToggle }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('stocktrackr_token')
    localStorage.removeItem('shouldFetchPrices')

    const toast = document.createElement('div')
    toast.textContent = '👋 Logged out successfully'
    toast.className =
      'fixed bottom-6 right-6 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-lg text-sm font-medium animate-slideInRight'
    document.body.appendChild(toast)

    setTimeout(() => toast.remove(), 2000)

    setTimeout(() => {
      navigate('/login', { replace: true })
    }, 600)
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Sidebar toggle */}
        <button
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Page title */}
        <h1 className="text-xl font-semibold tracking-tight text-gray-800 dark:text-gray-100">
          Dashboard
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm">
            P
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
              Prasad
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Investor
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          aria-label="Logout"
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <LogOut className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </header>
  )
}
