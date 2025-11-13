import axios from 'axios'

// Base URL — fallback to localhost for dev
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// --- Axios Instance Setup ---
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Automatically include token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('stocktrackr_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 Unauthorized errors gracefully
api.interceptors.response.use(
  res => res,
  error => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Session expired or unauthorized. Redirecting to login.')
      localStorage.removeItem('stocktrackr_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Helper to handle safe API calls
async function safeRequest(fn, fallback = null) {
  try {
    const res = await fn()
    return res.data
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.message ||
      'Unexpected server error. Please try again.'

    console.error(`❌ API Error: ${msg}`)
    return fallback
  }
}

/* ---------------- AUTH ---------------- */

export async function registerUser(data) {
  return safeRequest(async () => {
    const res = await api.post('/auth/register', data)
    if (res.data.token)
      localStorage.setItem('stocktrackr_token', res.data.token)
    return res
  })
}

export async function loginUser(data) {
  return safeRequest(async () => {
    const res = await api.post('/auth/login', data)
    if (res.data.token)
      localStorage.setItem('stocktrackr_token', res.data.token)
    return res
  })
}

export async function getProfile() {
  return safeRequest(() => api.get('/auth/profile'))
}

/* ---------------- PORTFOLIO ---------------- */

export async function getPortfolio() {
  return safeRequest(() => api.get('/portfolio'), [])
}

export async function addStock(item) {
  return safeRequest(() => api.post('/portfolio', item))
}

export async function updateStock(id, updates) {
  return safeRequest(() => api.put(`/portfolio/${id}`, updates))
}

export async function deleteStock(id) {
  return safeRequest(() => api.delete(`/portfolio/${id}`))
}

/* ---------------- HEALTH ---------------- */

export async function checkHealth() {
  return safeRequest(() => api.get('/health'))
}
