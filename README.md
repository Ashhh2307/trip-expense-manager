# ✈️ TravelWise — Premium MERN Stack Travel Expense Management System

**TravelWise** is a full-stack SaaS travel expense management web application built with the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. It empowers business travelers and modern teams to track travel expenditures, manage approval lifecycles, upload receipts, analyze spending statistics with interactive charts, and log expenses conversationally using an integrated AI Assistant.

---

## 🌟 Key Features

- **🔐 Robust JWT Authentication**: Secure signup, login, password hashing with `bcryptjs`, and protected API routes with user data isolation.
- **📊 Dynamic Analytics Dashboard**: Real-time summary cards (*Total Expenses, Pending, Approved, Total Trips*), monthly spending trend charts, category distributions, and recent transactions.
- **🧾 Complete Expense Management (CRUD)**:
  - Create, view, update, and delete expenses with full field validation.
  - Categorize by **Flight, Lodging, Meals, Transit, and Other**.
  - Track lifecycle status: **Pending, Approved, Rejected**.
  - Multi-criteria search (title, merchant, category, trip) and filters (status tabs, category dropdown, date range, and sorting).
- **📎 Receipt Image Upload & Viewer**: Multer-powered image upload (JPG, JPEG, PNG, WebP) with a built-in lightbox receipt viewer and download support.
- **🤖 AI-Powered Natural Language Expense Logging**:
  - Conversational assistant that extracts amount, merchant, category, date, and description from natural language (e.g., *"Spent $50 on lunch at Sushi Dai"*).
  - Works with **OpenAI API** if configured, or uses an intelligent **built-in NLP/regex fallback** with zero external API dependencies.
- **💎 Premium SaaS Aesthetic**: Modern UI with subtle borders, rounded cards, dark typography, smooth slide-over detail panels, and responsive mobile navigation.
- **⚡ Zero-Config MongoDB Startup**: Connects seamlessly to MongoDB or automatically falls back to an embedded in-memory database with pre-seeded demo records.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM v6, Tailwind CSS, Lucide Icons, Recharts, Axios |
| **Backend** | Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), bcryptjs, Multer |
| **Database** | MongoDB / MongoDB Atlas (with embedded `mongodb-memory-server` fallback) |
| **AI Assistant** | OpenAI API support + Intelligent Local Heuristic NLP Parser |

---

## 📁 Project Architecture

```
trip expense/
│
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AddExpenseModal.jsx
│   │   │   ├── CategoryBadge.jsx
│   │   │   ├── CategoryChart.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   ├── EditExpenseModal.jsx
│   │   │   ├── ExpenseCard.jsx
│   │   │   ├── ExpenseChart.jsx
│   │   │   ├── ExpenseDetails.jsx
│   │   │   ├── ExpenseTable.jsx
│   │   │   ├── FilterDropdown.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ReceiptModal.jsx
│   │   │   ├── ReceiptUploader.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── ToastNotification.jsx
│   │   ├── context/            # AuthContext & ExpenseContext
│   │   ├── hooks/              # useAuth & useExpenses custom hooks
│   │   ├── layouts/            # AppLayout (Sidebar + Navbar + Modals)
│   │   ├── pages/              # Dashboard, Expenses, AIChat, Login, Register, NotFound
│   │   ├── services/           # Axios API integrations
│   │   ├── utils/              # Currency/date formatters and meta helpers
│   │   ├── App.jsx             # Router configuration
│   │   ├── index.css           # Tailwind design tokens & custom animations
│   │   └── main.jsx            # Application entrypoint
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── config/
│   │   └── db.js               # MongoDB connection & in-memory fallback
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   └── expenseController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect middleware
│   │   ├── errorMiddleware.js  # Centralized error handler
│   │   └── uploadMiddleware.js # Multer file upload configuration
│   ├── models/
│   │   ├── Expense.js          # Mongoose Expense schema
│   │   └── User.js             # Mongoose User schema
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── expenseRoutes.js
│   ├── utils/
│   │   ├── aiParser.js         # NLP expense parser
│   │   └── seedData.js         # Demo accounts and sample expense data
│   ├── uploads/                # Stored receipt images
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── package.json                # Root concurrent scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
Install dependencies for both client and server:

```bash
# In the root directory:
npm run install:all

# Or individually:
cd server && npm install
cd ../client && npm install
```

### 3. Environment Variables
Create `.env` in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/travelwise
JWT_SECRET=travelwise_super_secret_jwt_key_2026
OPENAI_API_KEY=
CLIENT_URL=http://localhost:5173
```

> **Note**: If local MongoDB is not running, the application will automatically start an in-memory MongoDB instance with pre-seeded demo data.

### 4. Run the Application
Start both the Express backend and Vite frontend concurrently:

```bash
npm run dev
```

- **Frontend Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🔑 Demo Account Credentials

For quick evaluation, use the one-click demo login button or the credentials below:

- **Email**: `alex@travelwise.com`
- **Password**: `password123`

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & get JWT token | Public |
| `GET` | `/api/auth/me` | Get current user profile | Private |

### Expenses (`/api/expenses`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/expenses` | List expenses (supports `search`, `category`, `status`, `sortBy`, `startDate`, `endDate`) | Private |
| `GET` | `/api/expenses/:id` | Get single expense by ID | Private |
| `POST` | `/api/expenses` | Create new expense (supports `receipt` file upload) | Private |
| `PUT` | `/api/expenses/:id` | Update expense details or replace receipt | Private |
| `DELETE` | `/api/expenses/:id` | Delete expense and cleanup attached receipt | Private |

### Dashboard Analytics (`/api/dashboard`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Dynamic metrics: totals, pending, approved, trips, categories, monthly trends | Private |

### AI Expense Assistant (`/api/ai`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/parse-expense` | Parse natural language message into structured expense data | Private |

---

## 🧪 AI Expense Assistant Examples

Try typing the following messages in the **AI Chat** interface:

- `Spent 50 bucks on lunch at Sushi Dai`
- `Uber to Heathrow Airport $85.20`
- `Delta Flights NY to LDN $1250`
- `Ace Hotel room stay for 840.50`
- `Dinner at Hawksmoor with clients for $320`

---

## 📄 License
This project is open-source and built for demonstration purposes.
