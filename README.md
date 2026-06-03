# Lead Management CRM

A modern, high-performance, full-stack Lead Management CRM dashboard built to track pipeline conversions, active corporate accounts, and sales metrics in real-time.

The application utilizes a decoupled architecture with a serverless backend optimized for **Vercel Functions** and a dynamic frontend styled with **Tailwind CSS**.

---

## 🚀 Live Deployments

- **Frontend Dashboard:** [https://crm-frontend-dashboard.vercel.app](https://crm-frontend-dashboard.vercel.app)
- **Backend API Gateway:** [https://crm-backend-api-woad.vercel.app](https://crm-backend-api-woad.vercel.app)

---

## 🛠️ Tech Stack & Architecture

### Frontend

- **Framework:** Next.js (App Router, Client-side state tracking)
- **Styling:** Tailwind CSS (Fluid utility layers with full Dark Mode matrix integration)
- **HTTP Client:** Axios (Configured with dynamic cache-busting telemetry parameters)

### Backend

- **Runtime:** Node.js with Express.js (Architected for Vercel Serverless execution)
- **Database:** MongoDB Atlas (Cloud-native document data mapping via Mongoose)

---

## ✨ Key Features & Engineering Highlights

- **Synchronized Lifecycle Rendering:** Mitigates Next.js hydration race conditions by matching component mount state boundaries before firing tracking data streams.
- **Intelligent Request Debouncing:** Integrated `400ms` window timeouts on search and pipeline filters to limit unnecessary API requests and optimize backend computing resources.
- **Real-time UI Synchronization:** Form submissions, pipeline edits, and record deletions use top-level callbacks to update the layout instantly without manual page refreshes.

---

## 📁 Repository Structural Layout

```text
├── frontend/                  # Next.js Application Root
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js        # Main CRM Dashboard View Layer
│   │   │   └── layout.js      # Theme providers & structural wrapping
│   │   └── components/
│   │       ├── LeadTable.js   # Dynamic grid with pagination & explicit action elements
│   │       ├── LeadFormModal.js # Integrated creation/modification modal canvas
│   │       └── StatsWidgets.js  # Top-level metric aggregation widgets
│   └── package.json
│
└── backend/                   # Express.js Serverless Gateway
    ├── config/
    │   └── db.js              # MongoDB Atlas connection mapping
    ├── controllers/
    │   └── leadController.js  # Sanitized endpoint logic layers (CRUD execution)
    ├── models/
    │   └── Lead.js            # Mongoose Schema defining CRM data structures
    └── api/
        └── index.js           # Serverless routing & Express bootstrap gateway
```
