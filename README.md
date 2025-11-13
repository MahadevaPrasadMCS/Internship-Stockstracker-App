# StockTracker — US Stock Portfolio Tracker

A full-stack **premium US stock portfolio manager** with real-time prices, historical analytics, performance tracking, smart alerts, authentication, cron-based daily history storage, and a stunning modern UI.

---

## Features

### Authentication  
- Secure JWT-based login & registration  
- Protected routes with auto-session expiry  
- Token injection through Axios interceptor  

### Portfolio Management  
- Add / Edit / Delete US stocks  
- Clean validation for symbols like `AAPL`, `MSFT`, `BRK.B`, etc.  
- Computes investment, current value & P/L  
- Auto-merges live stock prices with saved portfolio  

### Real-Time Stock Prices  
- MarketStack API integration  
- Intelligent caching (60s TTL)  
- OHLC support (Open, High, Low, Close)  
- Works even when API rate-limit hits (fallback data provided)

### Historical Price Tracking  
- Backend stores daily snapshots using **cron jobs**  
- API: `/api/history/:symbol`  
- Beautiful charts with supported ranges:
  - **1D • 5D • 1M • 3M • 1Y • ALL**
- Buy-price comparison line  
- Includes portfolio-wide performance mode  

### Smart Price Alerts  
- Monitors % movement for each stock  
- Cooldown system to prevent spam  
- Uses a custom React hook: `usePriceAlerts`  
- Bell icon ready for notifications UI  

### Premium Modern UI  
- Glassmorphism UI with blur panels  
- Framer Motion animations  
- Gradient highlights  
- Dark/Light theme support  
- Responsive grid layout  
- Floating toast notifications  

### Analytics Dashboard  
- Allocation pie chart  
- Performance chart  
- Transaction placeholder for future logs  
- Summary widget with net P/L, returns % etc.

### Backend Highlights  
- Clean Express.js architecture  
- MongoDB (Mongoose ODM)  
- MarketStack quote handler with graceful fallback  
- Daily historical data recording via `node-cron`  
- Centralized error handling  
- Token middleware  

---

## Tech Stack

### **Frontend**
- React  
- React Router  
- React Query  
- Tailwind CSS  
- Recharts  
- Axios  
- Framer Motion  
- Lucide Icons  

### **Backend**
- Node.js  
- Express  
- MongoDB (Mongoose)  
- JWT Auth  
- MarketStack API  
- node-cron  
- dotenv  

---

## Project Structure

```
stocktracker/
│
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ ├── cron/
│ ├── utils/
│ └── server.js
│
└── frontend/
├── src/
│ ├── api/
│ ├── components/
│ ├── hooks/
│ ├── pages/
│ ├── contexts/
│ ├── utils/
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
```
---

## Prerequisites
- Node.js 18+
- MongoDB Atlas or Local MongoDB
- Alpha Vantage API key
---
---

## ⚙️ Installation Guide

### Clone the project

```bash
git clone https://github.com/MahadevaPrasadMCS/Internship-Stockstracker-App.git
cd Internship-Stockstracker-App
```
### Backend

```bash
cd backend
npm install
npm run dev
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```
---
# Environment Variables

## Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongo_url
JWT_SECRET=your_secret
MASTARSTACK_KEY=your_key
FRONTEND_ORIGIN=http://localhost:5173
```

## Frontend .env
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
---
# API Endpoints

### Authentication

| Method | Endpoint              | Description          |
|--------|------------------------|----------------------|
| POST   | `/api/auth/register`  | Create user          |
| POST   | `/api/auth/login`     | Login user           |
| GET    | `/api/auth/profile`   | Get logged-in user   |

---

### Portfolio

| Method | Endpoint                | Description      |
|--------|--------------------------|------------------|
| GET    | `/api/portfolio`         | Get all stocks   |
| POST   | `/api/portfolio`         | Add stock        |
| PUT    | `/api/portfolio/:id`     | Update stock     |
| DELETE | `/api/portfolio/:id`     | Delete stock     |

---
### Stock Quote

| Method | Endpoint                        | Description           |
|--------|----------------------------------|-----------------------|
| GET    | `/api/quote?symbol=AAPL`         | Fetch real-time price |

---

### Historical Price API

| Method | Endpoint                 | Description                   |
|--------|---------------------------|-------------------------------|
| GET    | `/api/history/AAPL`      | Fetch saved daily price data |


## Limitations

- Alpha Vantage free tier allows only 25 requests per day.
- App fetches prices once per session and caches results for 60 seconds.
- Only BSE (.BSE) symbols are supported in this version.
  
---
## Screenshots

### Dashboard
<img width="1919" alt="Dashboard Page Image" src="https://github.com/user-attachments/assets/9ea1b3a2-ac57-463d-abd1-1de893cabc6d" />

### Portfolio
<img width="1919"  alt="Portfolio Page Image" src="https://github.com/user-attachments/assets/90d3a3ae-0bbe-4128-8ed2-1cc7efe330ff" />

<img width="1919" alt="Portfolio Page Image" src="https://github.com/user-attachments/assets/580bb7c2-9931-4469-8221-8811083073d0" />

### Settings
<img width="1889" alt="Settings Page Image" src="https://github.com/user-attachments/assets/b13d71e9-c9e2-448e-817a-3f69d6e09e91" />

### Register
<img width="1919" alt="register Page Image" src="https://github.com/user-attachments/assets/01ae33d3-a74d-4980-a08f-7b3f08e7252a" />

### Login
<img width="1915" alt="Login Page Image" src="https://github.com/user-attachments/assets/81faa937-5733-464a-b28f-437f1c64c4db" />
