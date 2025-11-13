import axios from "axios";

/* -----------------------------------------
   API BASE
----------------------------------------- */
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/* -----------------------------------------
   AXIOS INSTANCE
----------------------------------------- */
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

/* -----------------------------------------
   TOKEN INJECTION
----------------------------------------- */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("stocktrackr_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* -----------------------------------------
   AUTO-LOGOUT ON 401
----------------------------------------- */
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("⚠️ Session expired. Logging out.");
      localStorage.removeItem("stocktrackr_token");

      // slide-in toast (non-React)
      const t = document.createElement("div");
      t.textContent = "Session expired. Please log in again.";
      t.className =
        "fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-slideInRight";
      document.body.appendChild(t);

      setTimeout(() => t.remove(), 2400);

      setTimeout(() => (window.location.href = "/login"), 600);
    }

    return Promise.reject(error);
  }
);

/* -----------------------------------------
   SAFE REQUEST WRAPPER
----------------------------------------- */
async function safeRequest(fn, fallback = null) {
  try {
    const res = await fn();
    return res.data;
  } catch (err) {
    const serverMessage =
      err.response?.data?.message ||
      err.message ||
      "Unexpected server error";

    console.error(`❌ API Error: ${serverMessage}`);
    return fallback;
  }
}

/* -----------------------------------------
   AUTH
----------------------------------------- */
export async function registerUser(data) {
  return safeRequest(async () => {
    const res = await api.post("/auth/register", data);
    if (res.data.token) {
      localStorage.setItem("stocktrackr_token", res.data.token);
    }
    return res;
  });
}

export async function loginUser(data) {
  return safeRequest(async () => {
    const res = await api.post("/auth/login", data);
    if (res.data.token) {
      localStorage.setItem("stocktrackr_token", res.data.token);
    }
    return res;
  });
}

export async function getProfile() {
  return safeRequest(() => api.get("/auth/profile"));
}

/* -----------------------------------------
   PORTFOLIO CRUD
----------------------------------------- */
export async function getPortfolio() {
  return safeRequest(() => api.get("/portfolio"), []);
}

export async function addStock(item) {
  return safeRequest(() => api.post("/portfolio", item));
}

export async function updateStock(id, updates) {
  return safeRequest(() => api.put(`/portfolio/${id}`, updates));
}

export async function deleteStock(id) {
  return safeRequest(() => api.delete(`/portfolio/${id}`));
}

/* -----------------------------------------
   HEALTH CHECK
----------------------------------------- */
export async function checkHealth() {
  return safeRequest(() => api.get("/health"));
}
