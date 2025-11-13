import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

/* ---------------------------------------
   Page Transition (cleaner + smoother)
---------------------------------------- */
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1], // smoother cubic curve
    }}
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

/* ---------------------------------------
   Auto-scroll to top on route change
---------------------------------------- */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  /* ---------------------------------------
     Auto-redirect logged-in users away
     from /login and /register 
  ---------------------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("stocktrackr_token");

    const publicRoutes = ["/login", "/register"];
    if (token && publicRoutes.includes(location.pathname)) {
      navigate("/dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <>
      <ScrollToTop />

      {/* Smooth animated route transitions */}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {/* ---------- AUTH PAGES ---------- */}
          <Route
            path="/login"
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            }
          />

          <Route
            path="/register"
            element={
              <PageTransition>
                <Register />
              </PageTransition>
            }
          />

          {/* ---------- PROTECTED ROUTES ---------- */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Redirect root → dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            <Route
              path="dashboard"
              element={
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              }
            />

            <Route
              path="portfolio"
              element={
                <PageTransition>
                  <Portfolio />
                </PageTransition>
              }
            />

            <Route
              path="settings"
              element={
                <PageTransition>
                  <Settings />
                </PageTransition>
              }
            />
          </Route>

          {/* ---------- FALLBACK ---------- */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
