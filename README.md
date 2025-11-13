# StockTracker

A full-stack portfolio tracking system for BSE (Bombay Stock Exchange) stocks.  
Provides authentication, portfolio CRUD, real-time price fetching, caching, and analytics.

---

## Features

### Core Functionality
- User registration and login using JWT authentication
- Protected backend routes accessible only with valid tokens
- Add stocks to personal BSE portfolio
- Edit existing stocks with validation
- Delete stocks from portfolio
- Real-time stock price retrieval using Alpha Vantage API
- Automatic price merging with saved portfolio data

### Frontend System
- React-based UI with modular components
- Dynamic routing using React Router
- Data fetching, caching, and stale-time handling through React Query
- Custom hook for live stock prices with client-side caching
- Loading indicators, error handling, and notifications
- Optimized rendering using Framer Motion animations
- Fully responsive layout with Tailwind CSS design system

### Backend System
- Node.js and Express backend architecture
- MongoDB database with Mongoose models
- Secure password hashing using bcrypt
- Centralized error handling middleware
- Modular controllers and routes for clean architecture
- API rate protection using smart frontend caching
- Clean portfolio CRUD operations tied to authenticated users

### Quality and Developer Experience
- Clearly structured folder hierarchy
- Environment-variable driven configuration
- Minimal API calls through caching and stable-symbol logic
- Consistent coding style across frontend and backend
- Easy to deploy, extend, and integrate


---

## Tech Stack

### Frontend
- React  
- React Router  
- React Query  
- Tailwind CSS  
- Axios  
- Framer Motion  

### Backend
- Node.js  
- Express  
- MongoDB (Mongoose)  
- JWT  
- Alpha Vantage API  

---

## Project Structure
```
stocktrackr/
│
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ └── server.js
│
└── frontend/
├── public/
└── src/
├── api/
├── components/
├── hooks/
├── pages/
├── utils/
├── App.jsx
├── main.jsx
└── index.css
```
---

## Prerequisites
- Node.js 18+
- MongoDB Atlas or Local MongoDB
- Alpha Vantage API key
---
## Installation
```bash
git clone
```
### Backend

```bash
cd backend
npm install
npm run dev

cd stocktracker
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
ALPHA_VANTAGE_API_KEY=your_key
FRONTEND_ORIGIN=http://localhost:5173
```

## Frontend .env
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
---
# API Endpoints

## Authentication

| Method | Endpoint                  | Description            |
|--------|----------------------------|------------------------|
| POST   | `"/api/auth/register"`    | Register a user        |
| POST   | `"/api/auth/login"`       | Login and get token    |
| GET    | `"/api/auth/profile"`     | Get authenticated user |

---

## Portfolio

| Method | Endpoint                     | Description      |
|--------|-------------------------------|------------------|
| GET    | `"/api/portfolio"`           | Fetch portfolio  |
| POST   | `"/api/portfolio"`           | Add stock        |
| PUT    | `"/api/portfolio/:id"`       | Update stock     |
| DELETE | `"/api/portfolio/:id"`       | Delete stock     |

---

## Price Quote

| Method | Endpoint                               | Description       |
|--------|-------------------------------------------|-------------------|
| GET    | `"/api/quote?symbol=XYZ.BSE"`           | Fetch stock price |

---
## Limitations

- Alpha Vantage free tier allows only 25 requests per day.
- App fetches prices once per session and caches results for 60 seconds.
- Only BSE (.BSE) symbols are supported in this version.
  
---
## Future Enhancements

- Add charts for historical price movements
- Add export/import of portfolio data
- Add UI theme customizations
- Add BSE + NSE dual support
- Add notifications for price alerts
---
## Screenshots

### Portfolio
<img width="1911" alt="Portfolio Screenshot" src="https://github.com/user-attachments/assets/13a579a2-9c28-4ac7-9972-f1ee5cfa68c1" />

### Dashboard
<img width="1901" alt="Dashboard Screenshot" src="https://github.com/user-attachments/assets/e6a5f29d-f1fb-4076-8bf6-9094fd978127" />

### Register
<img width="1911" alt="Register Page Screenshot" src="https://github.com/user-attachments/assets/3616d723-71b5-426a-89d9-9a241f42a35f" />

### Login
<img width="1913" alt="Login Page Screenshot" src="https://github.com/user-attachments/assets/95b2e61c-b5c9-4911-a1e3-f70daabc2c59" />
