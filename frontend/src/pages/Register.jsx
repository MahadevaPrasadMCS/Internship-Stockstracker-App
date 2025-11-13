import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/backendAPI";
import { Eye, EyeOff, UserPlus } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2600);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(form);

      showToast("Registration successful! Redirecting…");

      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Registration failed. Try again.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 p-4">
      <div className="relative w-full max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/40 animate-fadeIn"
        >
          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-1">
            Create Your Account
          </h2>
          <p className="text-center text-gray-600 mb-8 text-sm">
            Join and start tracking your investments
          </p>

          {/* Name */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              placeholder="John Doe"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2.5 bg-white/60 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              placeholder="you@example.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2.5 bg-white/60 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-5 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full p-2.5 pr-10 bg-white/60 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[2.65rem] text-gray-500 hover:text-gray-700 transition"
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          {/* Error Box */}
          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2 mb-3">
              {error}
            </p>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-white transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-lg"
            }`}
          >
            <UserPlus size={18} />
            {loading ? "Creating account…" : "Register"}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-700 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>

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
    </div>
  );
}
