import React, { useState } from 'react'
import { BarChart3, TrendingUp, FileText, Info } from 'lucide-react'

export default function Portfolio() {
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const handleFeatureClick = (feature) => {
    showToast(`🚧 ${feature} feature coming soon!`)
  }

  return (
    <div className="animate-fadeIn">
      {/* Header Section */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-5 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">My Portfolio</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track performance, analyze diversification, and view insights.
          </p>
        </div>
        <button
          onClick={() => showToast('📊 Analytics dashboard coming soon!')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
        >
          View Analytics
        </button>
      </div>

      {/* Main Analytics Placeholder Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div
          onClick={() => handleFeatureClick('Performance Overview')}
          className="p-5 bg-white rounded-xl shadow hover:shadow-md transition border border-gray-100 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Performance Overview
            </h3>
            <TrendingUp className="text-indigo-600" size={22} />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Visualize your total gains, losses, and profit trends.
          </p>
          <div className="mt-4 h-24 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-lg"></div>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => handleFeatureClick('Holdings Breakdown')}
          className="p-5 bg-white rounded-xl shadow hover:shadow-md transition border border-gray-100 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Holdings Breakdown
            </h3>
            <BarChart3 className="text-indigo-600" size={22} />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            See diversification by sector, stock type, and allocation weight.
          </p>
          <div className="mt-4 h-24 bg-gradient-to-r from-green-100 to-green-50 rounded-lg"></div>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => handleFeatureClick('Transaction History')}
          className="p-5 bg-white rounded-xl shadow hover:shadow-md transition border border-gray-100 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Transaction History
            </h3>
            <FileText className="text-indigo-600" size={22} />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Review all your stock purchases, edits, and sales.
          </p>
          <div className="mt-4 h-24 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg"></div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="mt-8 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Info className="text-indigo-600" size={18} />
          <h4 className="text-lg font-semibold text-gray-800">
            Future Enhancements
          </h4>
        </div>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Portfolio value vs. benchmark chart</li>
          <li>Auto-sync with brokerage APIs</li>
          <li>Daily and weekly performance notifications</li>
          <li>Export reports as CSV or PDF</li>
        </ul>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-white animate-fadeIn ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-indigo-600'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
}
