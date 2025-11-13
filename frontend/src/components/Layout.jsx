import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { motion, AnimatePresence } from 'framer-motion'

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Sidebar */}
      <motion.div
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.28, ease: 'easeInOut' }}
        className="
          relative z-30 shadow-xl 
          bg-white/90 dark:bg-gray-900/70 backdrop-blur-xl
          border-r border-gray-200 dark:border-gray-700
        "
      >
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Sticky Topbar */}
        <div className="sticky top-0 z-40 shadow-sm">
          <Topbar onToggle={() => setCollapsed(v => !v)} collapsed={collapsed} />
        </div>

        {/* Page Content */}
        <main
          className="
            flex-1 overflow-y-auto 
            p-4 md:p-6 
            bg-gray-50/60 dark:bg-gray-900/50
            backdrop-blur-lg transition-all duration-300
          "
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={collapsed ? 'collapsed' : 'expanded'}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="max-w-7xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
