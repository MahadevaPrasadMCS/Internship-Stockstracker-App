import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`relative flex flex-col justify-between bg-white dark:bg-gray-800 border-r dark:border-gray-700 transition-all duration-300 ease-in-out shadow-sm ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header with title & collapse button */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
        {!collapsed && (
          <h1 className="text-xl font-semibold tracking-tight text-gray-800 dark:text-gray-100">
            StockTrackr
          </h1>
        )}

        <button
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {collapsed ? (
            <ChevronRight size={18} className="text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronLeft size={18} className="text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
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

      {/* Footer note */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        {!collapsed ? (
          <p>Phase 1 — Frontend scaffold</p>
        ) : (
          <p className="text-center text-gray-400">v1</p>
        )}
      </div>
    </aside>
  )
}

/** 🔹 Reusable NavLink Component */
function SidebarLink({ to, label, icon, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
          isActive
            ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 border-l-4 border-indigo-500'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-500'
        }`
      }
      title={collapsed ? label : ''}
    >
      <span className="min-w-[20px] text-center">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </NavLink>
  )
}
