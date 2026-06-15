# 🚗 BAVH Motors AI

An AI-powered Car Discovery, Comparison, and Recommendation Platform built using React, Node.js, Express, and MongoDB.

## 📌 Overview

BAVH Motors AI helps users discover, compare, and receive personalized recommendations for cars based on their budget, fuel preferences, family size, driving habits, and other requirements.

The platform provides a modern user experience similar to leading automotive portals while integrating intelligent recommendation capabilities.

---

## ✨ Features

### 🚘 Car Catalog

* Browse thousands of car listings
* Detailed car specifications
* Price, mileage, and feature information
* New and used car support

### 🔍 Advanced Search & Filters

* Brand Filter
* Budget Filter
* Fuel Type Filter
* Transmission Filter
* Body Type Filter
* New/Used Filter
* Search by Brand or Model

### ⚖️ Compare Cars

* Side-by-side comparison
* Price comparison
* Mileage comparison
* Engine comparison
* Feature comparison
* Safety comparison

### 🤖 AI Recommendation Engine

Users receive personalized recommendations based on:

* Budget
* Fuel preference
* Family size
* City/Highway usage
* Transmission preference
* New vs Used preference

The system returns:

* Match percentage
* Recommended vehicles
* Recommendation explanations

### ❤️ Wishlist

* Save favorite cars
* Remove saved cars
* Personalized wishlist management

### 🔐 Authentication

* Google Login (Firebase Authentication)
* Secure user sessions
* Personalized recommendations

### 📊 Admin Dashboard

* Manage car inventory
* Monitor platform activity
* Update vehicle information
* Manage recommendations

---

## 🛠 Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Bootstrap
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose ODM

### Authentication

* Firebase Authentication

### APIs

* API Ninjas
* Unsplash API

---

## 📂 Project Structure

```text
BAVH-Motors-AI
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── scripts/
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (.env)

```env
PORT=5001

MONGO_URI=your_mongodb_connection_string

API_NINJAS_KEY=your_api_ninjas_key

UNSPLASH_ACCESS_KEY=your_unsplash_access_key

CLIENT_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/your-username/bavh-motors-ai.git
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## ▶️ Running the Project

### Start Backend

```bash
cd backend
npm run dev
```

Backend runs on:

```text
http://localhost:5001
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 📡 API Endpoints

### Get All Cars

```http
GET /api/cars
```

### Get Car By ID

```http
GET /api/cars/:id
```

### Search Cars

```http
GET /api/cars?search=creta
```

### Filter By Brand

```http
GET /api/cars?brand=Hyundai
```

### Filter By Fuel Type

```http
GET /api/cars?fuel_type=Petrol
```

### Filter By Budget

```http
GET /api/cars?maxPrice=15
```

---

## 🗄 Database

The platform stores:

* Vehicle Information
* Specifications
* Pricing Data
* Fuel Information
* Transmission Data
* User Accounts
* Wishlist Data
* Recommendation History

MongoDB Atlas is used as the primary database.

---

## 🔒 Security Features

* Environment Variable Validation
* MongoDB Input Validation
* Secure API Configuration
* CORS Protection
* Duplicate Record Prevention
* Error Handling & Logging

---

## 📈 Future Enhancements

* Car Loan EMI Calculator
* Insurance Cost Estimator
* Nearby Dealership Finder
* AI Chat Assistant
* Real-time Market Pricing
* Vehicle Review System
* Recommendation History Analytics

---

## 👨‍💻 Author

**Barath Arjun**

Computer Science Engineer (2027)

Passionate about Software Development, AI Applications, and Building Real-World Products.

---

## 📜 License

This project is intended for educational and portfolio purposes.
