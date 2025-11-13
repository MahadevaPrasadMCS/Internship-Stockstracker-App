import React, { useState, useEffect } from "react";
import {
  Bell,
  DollarSign,
  Sun,
  Moon,
  Monitor,
  LogOut,
  User,
} from "lucide-react";

export default function Settings() {
  const [currency, setCurrency] = useState("USD");
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState(3);
  const [theme, setTheme] = useState("auto");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("PREF_CURRENCY");
    const savedAlerts = localStorage.getItem("PRICE_ALERTS_ENABLED");
    const savedThreshold = localStorage.getItem("ALERT_THRESHOLD");
    const savedTheme = localStorage.getItem("APP_THEME");

    if (savedCurrency) setCurrency(savedCurrency);
    if (savedAlerts) setAlertsEnabled(savedAlerts === "true");
    if (savedThreshold) setAlertThreshold(Number(savedThreshold));
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  const saveSettings = () => {
    localStorage.setItem("PREF_CURRENCY", currency);
    localStorage.setItem("PRICE_ALERTS_ENABLED", alertsEnabled);
    localStorage.setItem("ALERT_THRESHOLD", alertThreshold);
    localStorage.setItem("APP_THEME", theme);

    showToast("Settings saved successfully!");
  };

  const logout = () => {
    localStorage.removeItem("stocktrackr_token");
    window.location.href = "/login";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Settings ⚙️
      </h2>

      {/* Currency Section */}
      <div className="bg-white/90 dark:bg-gray-900/70 backdrop-blur-xl p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-100">
          <DollarSign size={20} className="text-indigo-600" />
          Currency Preference
        </h3>

        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="USD">USD – US Dollar</option>
          <option value="INR">INR – Indian Rupee</option>
        </select>
      </div>

      {/* Price Alerts */}
      <div className="bg-white/90 dark:bg-gray-900/70 backdrop-blur-xl p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-100">
          <Bell size={20} className="text-indigo-600" />
          Price Alerts
        </h3>

        <label className="flex items-center gap-3 cursor-pointer mb-3">
          <input
            type="checkbox"
            checked={alertsEnabled}
            onChange={() => setAlertsEnabled(!alertsEnabled)}
            className="h-4 w-4 text-indigo-600"
          />
          <span className="text-gray-700 dark:text-gray-300">
            Enable price movement alerts
          </span>
        </label>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            Alert when stock moves more than (%)
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={alertThreshold}
            onChange={(e) => setAlertThreshold(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white/90 dark:bg-gray-900/70 backdrop-blur-xl p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-100">
          {theme === "dark" ? (
            <Moon size={20} className="text-indigo-600" />
          ) : theme === "light" ? (
            <Sun size={20} className="text-indigo-600" />
          ) : (
            <Monitor size={20} className="text-indigo-600" />
          )}
          Theme
        </h3>

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="auto">Auto (System)</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* Save Button */}
      <button
        onClick={saveSettings}
        className="w-full py-3 font-semibold bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
      >
        Save Settings
      </button>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full py-3 text-red-600 font-semibold bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition flex items-center justify-center gap-2"
      >
        <LogOut size={18} />
        Logout
      </button>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-white animate-fadeIn ${
            toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
