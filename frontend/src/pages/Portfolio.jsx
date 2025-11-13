// src/pages/Portfolio.jsx
import React, { useState, useRef } from "react";
import {
  LineChart,
  PieChart,
  FileText,
  Info,
} from "lucide-react";

import PriceChart from "../components/PriceChart";
import AllocationChart from "../components/AllocationChart";
import usePriceHistory from "../hooks/usePriceHistory";

export default function Portfolio() {
  const [toast, setToast] = useState(null);
  const [activeView, setActiveView] = useState("performance"); // performance | allocation | activity

  // Performance / P&L over time
  const { history, loading: historyLoading } = usePriceHistory("PORTFOLIO");

  // scroll reference for analytics section
  const analyticsRef = useRef(null);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const titleMap = {
    performance: "Performance Overview",
    allocation: "Holdings Allocation",
    activity: "Transaction History",
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    showToast(`📊 Showing ${titleMap[view]}`);
  };

  /* ----------------------------------------------------------------------
     Open Analytics Button → Auto-switch to Performance + Smooth Scroll
  ---------------------------------------------------------------------- */
  const openAnalytics = () => {
    setActiveView("performance");
    setTimeout(() => {
      analyticsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };

  /* UI ------------------------------------------------------------------ */

  return (
    <div className="animate-fadeIn space-y-8">

      {/* Page Header */}
      <div className="
        bg-white/90 dark:bg-gray-900/70 backdrop-blur-xl shadow-md 
        border border-gray-200 dark:border-gray-800 
        rounded-2xl p-6 flex justify-between items-center
      ">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Portfolio Insights
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Analyze allocation, performance & activity — all in one place.
          </p>
        </div>

        <button
          onClick={openAnalytics}
          className="
            px-5 py-2.5 bg-indigo-600 text-white font-medium 
            rounded-xl hover:bg-indigo-700 transition shadow-md active:scale-95
          "
        >
          Open Analytics
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* PERFORMANCE CARD */}
        <div
          onClick={() => handleViewChange("performance")}
          className={`
            p-6 rounded-2xl shadow cursor-pointer transition border
            ${
              activeView === "performance"
                ? "bg-gradient-to-br from-indigo-500/25 to-indigo-600/25 border-indigo-300 shadow-lg scale-[1.03]"
                : "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 border-indigo-100 dark:border-gray-700 hover:shadow-md hover:scale-[1.02]"
            }
          `}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Performance Overview</h3>
            <LineChart className="text-indigo-600" size={24} />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Track overall gains, losses & long-term P/L trends.
          </p>
          <div className="mt-4 h-24 rounded-xl bg-white/50 dark:bg-gray-800/40 backdrop-blur-md" />
        </div>

        {/* ALLOCATION CARD */}
        <div
          onClick={() => handleViewChange("allocation")}
          className={`
            p-6 rounded-2xl shadow cursor-pointer transition border
            ${
              activeView === "allocation"
                ? "bg-gradient-to-br from-yellow-500/25 to-yellow-600/25 border-yellow-300 shadow-lg scale-[1.03]"
                : "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-800 dark:to-gray-900 border-yellow-100 dark:border-gray-700 hover:shadow-md hover:scale-[1.02]"
            }
          `}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Allocation Breakdown</h3>
            <PieChart className="text-yellow-600" size={24} />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Understand diversification & exposure.
          </p>
          <div className="mt-4 h-24 rounded-xl bg-white/50 dark:bg-gray-800/40 backdrop-blur-md" />
        </div>

        {/* ACTIVITY CARD */}
        <div
          onClick={() => handleViewChange("activity")}
          className={`
            p-6 rounded-2xl shadow cursor-pointer transition border
            ${
              activeView === "activity"
                ? "bg-gradient-to-br from-green-500/25 to-green-600/25 border-green-300 shadow-lg scale-[1.03]"
                : "bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900 border-green-100 dark:border-gray-700 hover:shadow-md hover:scale-[1.02]"
            }
          `}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Transaction History</h3>
            <FileText className="text-green-600" size={24} />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Review your buys, edits & updates.
          </p>
          <div className="mt-4 h-24 rounded-xl bg-white/50 dark:bg-gray-800/40 backdrop-blur-md" />
        </div>
      </div>

      {/* MAIN ANALYTICS SECTION */}
      <div
        ref={analyticsRef}
        className="
          bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl 
          p-6 rounded-2xl shadow-md 
          border border-gray-200 dark:border-gray-700 
          space-y-4
        "
      >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {titleMap[activeView]}
        </h3>

        {/* PERFORMANCE VIEW */}
        {activeView === "performance" && (
          <div className="w-full">
            <PriceChart
              data={history}
              loading={historyLoading}
              symbol="Portfolio"
            />
          </div>
        )}

        {/* ALLOCATION VIEW */}
        {activeView === "allocation" && (
          <div className="w-full">
            <AllocationChart />
          </div>
        )}

        {/* ACTIVITY VIEW */}
        {activeView === "activity" && (
          <div className="p-4 rounded-lg bg-white/60 dark:bg-gray-800/40 border dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              🚧 Transaction logs will appear here soon.
            </p>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-white animate-fadeIn ${
            toast.type === "error" ? "bg-red-600" : "bg-indigo-600"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
