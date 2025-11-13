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
      console.warn('Invalid or malformed token:', err)
      localStorage.removeItem('stocktrackr_token')
      setIsAuthenticated(false)
    } finally {
      setIsChecking(false)
    }
  }, [])

  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mb-3"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Verifying session...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}
