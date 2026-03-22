# 🎓 Smart Campus Operations Hub
### IT3030 – Programming Applications and Frameworks | PAF 2026

> A production-inspired web platform for managing university facility bookings and maintenance incidents.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 17, Spring Boot 3.2, Spring Security, OAuth2, JWT |
| **Database** | MongoDB |
| **Frontend** | React 18, Vite, React Router v6, Axios |
| **Auth** | OAuth2 Google Sign-In + JWT |
| **CI/CD** | GitHub Actions |

---

## 📦 Modules

| Module | Description |
|--------|-------------|
| **A** | Facilities & Assets Catalogue |
| **B** | Booking Management (PENDING → APPROVED/REJECTED/CANCELLED) |
| **C** | Maintenance & Incident Ticketing (with image attachments) |
| **D** | Notifications (booking & ticket events) |
| **E** | Authentication & Authorization (Google OAuth2 + RBAC) |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 20+
- MongoDB (local or Atlas)
- Google OAuth2 credentials

### Backend Setup

```bash
cd backend

# Configure environment
# Open src/main/resources/application.properties and set:
# - spring.data.mongodb.uri
# - app.jwt.secret (min 32 chars)
# - spring.security.oauth2.client.registration.google.client-id
# - spring.security.oauth2.client.registration.google.client-secret

# Run the application
mvn spring-boot:run
# API runs at: http://localhost:8080
```

### Frontend Setup

```bash
cd frontend

# Copy and configure environment
cp .env.example .env
# Edit .env with your VITE_GOOGLE_CLIENT_ID

# Install dependencies
npm install

# Start dev server
npm run dev
# App runs at: http://localhost:5173
```

---

## 🗂️ Project Structure

```
├── backend/                          # Spring Boot REST API
│   └── src/main/java/com/smartcampus/
│       ├── controller/               # REST endpoints
│       ├── service/                  # Business logic
│       ├── repository/               # MongoDB data access
│       ├── model/                    # Domain entities
│       ├── dto/                      # Request/response DTOs
│       ├── config/                   # Spring Security, CORS
│       ├── security/                 # JWT, OAuth2 handler
│       └── exception/                # Custom exceptions & handler
│
├── frontend/                         # React + Vite
│   └── src/
│       ├── pages/                    # Route-level page components
│       ├── components/               # Reusable UI components
│       ├── services/                 # Axios API calls
│       ├── context/                  # AuthContext (JWT state)
│       └── index.css                 # Global dark theme CSS
│
└── .github/workflows/ci.yml         # GitHub Actions CI pipeline
```

---

## 🔗 Key API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/resources` | Public | List all resources (with filters) |
| `POST` | `/api/resources` | ADMIN | Create resource |
| `PUT` | `/api/resources/{id}` | ADMIN | Update resource |
| `DELETE` | `/api/resources/{id}` | ADMIN | Delete resource |
| `GET` | `/api/bookings/my` | USER | Get my bookings |
| `POST` | `/api/bookings` | USER | Create booking |
| `PATCH` | `/api/bookings/{id}/approve` | ADMIN | Approve booking |
| `PATCH` | `/api/bookings/{id}/reject` | ADMIN | Reject booking |
| `POST` | `/api/tickets` | USER | Report incident (multipart) |
| `PATCH` | `/api/tickets/{id}/status` | ADMIN/TECHNICIAN | Update ticket status |
| `POST` | `/api/tickets/{id}/comments` | USER | Add comment |
| `GET` | `/api/notifications` | USER | Get notifications |
| `PATCH` | `/api/notifications/read-all` | USER | Mark all read |
| `GET` | `/api/auth/me` | Authenticated | Get current user + JWT |

---

## 👥 Team Contribution

| Member | Module | Endpoints |
|--------|--------|-----------|
| Member 1 | A – Facilities Catalogue | Resource CRUD |
| Member 2 | B – Booking Management | Booking workflow |
| Member 3 | C – Ticket Management | Ticket + attachments + comments |
| Member 4 | D – Notifications + E – Auth | Notifications + OAuth2 + RBAC |

---

## 🧪 Testing

- Unit/Integration tests: `cd backend && mvn test`
- Postman collection: *[To be added in /docs/postman/]*
- GitHub Actions runs tests on every push

---

*IT3030 – PAF 2026 | SLIIT Faculty of Computing*
