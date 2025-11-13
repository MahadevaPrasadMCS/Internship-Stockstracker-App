import React from "react";
import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar({ onToggle, title = "Dashboard" }) {
  const navigate = useNavigate();

  const showToast = (msg) => {
    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.className =
      "fixed bottom-6 right-6 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-lg text-sm font-medium animate-slideInRight z-[2000]";
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2200);
  };

  const handleLogout = () => {
    localStorage.removeItem("stocktrackr_token");
    localStorage.removeItem("shouldFetchPrices");
    showToast("👋 Logged out successfully");

    setTimeout(() => navigate("/login", { replace: true }), 600);
  };

  return (
    <header
      className="
        sticky top-0 z-40
        flex items-center justify-between
        px-4 py-3
        bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10
        backdrop-blur-xl
        border-b border-gray-200 dark:border-gray-700
        shadow-sm
      "
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle */}
        <button
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="
            p-2 rounded-lg 
            hover:bg-gray-100 dark:hover:bg-gray-800 
            transition active:scale-95
          "
        >
          <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Dynamic Page Title */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
          {title}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="flex items-center gap-3 pr-1">
          <div
            className="
              h-9 w-9 rounded-full 
              bg-gradient-to-br from-indigo-500 to-purple-600
              flex items-center justify-center
              text-white font-semibold shadow
            "
          >
            P
          </div>

          {/* Name (Hidden on mobile for clean layout) */}
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
              Prasad
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Investor
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          aria-label="Logout"
          onClick={handleLogout}
          className="
            p-2 rounded-lg 
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition active:scale-95
          "
        >
          <LogOut className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </header>
  );
}
