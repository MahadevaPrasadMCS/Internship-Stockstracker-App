import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('stocktrackr_token')

    if (!token) {
      setIsAuthenticated(false)
      setIsChecking(false)
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const isExpired = payload.exp * 1000 < Date.now()

      if (isExpired) {
        localStorage.removeItem('stocktrackr_token')
        setIsAuthenticated(false)
      } else {
        setIsAuthenticated(true)
      }
    } catch (err) {
      console.warn('Invalid token:', err)
      localStorage.removeItem('stocktrackr_token')
      setIsAuthenticated(false)
    } finally {
      setIsChecking(false)
    }
  }, [])

  /* ---------- Loading Screen (Modernized) ---------- */
  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-fadeIn">
        <div className="flex flex-col items-center gap-3">
          {/* Glowing loader ring */}
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 rounded-full blur-md bg-indigo-500/30 animate-pulse"></div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm tracking-wide animate-fadeIn">
            Verifying your session…
          </p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}
