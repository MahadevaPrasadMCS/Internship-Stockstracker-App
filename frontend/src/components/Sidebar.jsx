import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  Settings,
} from 'lucide-react'

export default function Sidebar({ collapsed }) {
  return (
    <aside
      className={`relative flex flex-col justify-between backdrop-blur-xl 
      bg-white/90 dark:bg-gray-900/80 border-r dark:border-gray-800 
      shadow-lg transition-all duration-300 ease-in-out 
      ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-gray-200/70 dark:border-gray-700/50">
        {!collapsed && (
          <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r 
          from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            StockTrackr
          </h1>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br 
          from-indigo-600 to-purple-600 shadow-md mx-auto"></div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 space-y-1 px-2">
        <SidebarLink
          to="/dashboard"
          label="Dashboard"
          icon={<LayoutDashboard size={18} />}
          collapsed={collapsed}
        />

        <SidebarLink
          to="/portfolio"
          label="Portfolio"
          icon={<Briefcase size={18} />}
          collapsed={collapsed}
        />

        <SidebarLink
          to="/settings"
          label="Settings"
          icon={<Settings size={18} />}
          collapsed={collapsed}
        />
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200/70 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
        {!collapsed ? (
          <p className="tracking-wide">v1.0 — Stable Build</p>
        ) : (
          <p className="text-center text-gray-400">v1</p>
        )}
      </div>
    </aside>
  )
}

/* ---------------- Reusable NavLink ---------------- */
function SidebarLink({ to, label, icon, collapsed }) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : ''}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all 
        duration-200 group ${
          isActive
            ? `
            bg-gradient-to-r from-indigo-100 to-indigo-50 dark:from-indigo-900/40 dark:to-indigo-900/10 
            text-indigo-600 dark:text-indigo-300 
            shadow-sm border-l-4 border-indigo-500`
            : `
            text-gray-700 dark:text-gray-300 
            hover:bg-gray-100 dark:hover:bg-gray-800 
            hover:text-indigo-600 dark:hover:text-indigo-400`
        }`
      }
    >
      <span
        className={`min-w-[22px] text-center group-hover:scale-110 transition-transform ${
          collapsed ? 'mx-auto' : ''
        }`}
      >
        {icon}
      </span>

      {!collapsed && <span className="tracking-wide">{label}</span>}
    </NavLink>
  )
}
