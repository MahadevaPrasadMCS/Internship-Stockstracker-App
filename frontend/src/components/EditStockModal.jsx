import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XCircle } from 'lucide-react'

export default function EditStockModal({ isOpen, onClose, stock, onSave }) {
  const [symbol, setSymbol] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  /* Load stock details when modal opens */
  useEffect(() => {
    if (isOpen && stock) {
      setSymbol(stock.symbol || '')
      setBuyPrice(stock.buyPrice?.toString() || '')
      setQuantity(stock.quantity?.toString() || '')

      inputRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, stock, onClose])

  /* Save Logic */
  function handleSave(e) {
    e.preventDefault()
    setError('')

    if (!symbol.trim() || !buyPrice || !quantity) {
      setError('All fields are required.')
      return
    }
    if (Number(buyPrice) <= 0 || Number(quantity) <= 0) {
      setError('Buy price and quantity must be greater than zero.')
      return
    }

    const cleanSymbol = symbol.trim().toUpperCase()
    const validTicker = /^[A-Z0-9.-]{1,10}$/.test(cleanSymbol)

    if (!validTicker) {
      setError('Enter a valid US ticker (AAPL, TSLA, MSFT, BRK.B).')
      return
    }

    const updatedStock = {
      ...stock,
      symbol: cleanSymbol,
      buyPrice: Number(buyPrice),
      quantity: Number(quantity),
      _id: stock._id,
      lastUpdated: new Date().toISOString(),
    }

    onSave(updatedStock)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-bg"
          className="fixed inset-0 z-50 flex items-center justify-center 
            bg-black/50 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            key="modal-content"
            onSubmit={handleSave}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="
              bg-white dark:bg-gray-900/95 
              rounded-2xl shadow-2xl 
              border border-gray-200 dark:border-gray-700
              w-full max-w-md p-7
              backdrop-blur-xl
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Edit US Stock
              </h2>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <XCircle className="h-6 w-6 text-gray-500 dark:text-gray-300" />
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Symbol (US)
                </label>
                <input
                  ref={inputRef}
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                    bg-white dark:bg-gray-800 
                    focus:ring-2 focus:ring-indigo-500 outline-none
                    transition"
                  placeholder="AAPL, TSLA, MSFT, BRK.B"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Buy Price (USD)
                </label>
                <input
                  type="number"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                    bg-white dark:bg-gray-800 
                    focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                    bg-white dark:bg-gray-800 
                    focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 bg-red-100 dark:bg-red-900/40 
                    border border-red-300 dark:border-red-700 
                    rounded-lg px-3 py-2"
                >
                  {error}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-7">
              <button
                type="button"
                onClick={onClose}
                className="
                  px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                  text-gray-700 dark:text-gray-300 
                  hover:bg-gray-100 dark:hover:bg-gray-800 transition
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                className="
                  px-4 py-2 rounded-lg 
                  bg-indigo-600 hover:bg-indigo-700 
                  text-white font-medium shadow-sm
                  transition
                "
              >
                Save Changes
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
