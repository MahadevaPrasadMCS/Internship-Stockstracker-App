import React, { useState } from "react";
import { LogOut, Menu, Bell, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Topbar({
  onToggle,
  title = "Dashboard",
  notifications = [],
  onClearNotifications,
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const unread = notifications.length;

  const handleLogout = () => {
    localStorage.removeItem("stocktrackr_token");
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm relative">
      
      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 relative">

        {/* Notification Bell */}
        <button
          onClick={() => setOpen(!open)}
          className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Bell className="h-5 w-5" />
          
          {unread > 0 && (
            <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </button>

        {/* Logout */}
        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <LogOut className="h-5 w-5" />
        </button>

        {/* Notification Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute right-0 top-12 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-[200]"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">Notifications</h3>

                {unread > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {unread === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
                  No alerts yet
                </p>
              )}

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                  >
                    <p className="text-xs font-medium">{n.symbol}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
}
