# 🌐 SportSlot Web — Next.js Frontend

A full web frontend for the SportSlot app, built with Next.js 14 (App Router) + TypeScript.
Connects to your Spring Boot backend via REST API.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                  ← Landing page
│   ├── layout.tsx                ← Root layout (fonts, providers)
│   ├── globals.css               ← Design system variables
│   ├── auth/
│   │   ├── login/page.tsx        ← Login page
│   │   └── register/page.tsx     ← Register page
│   ├── venues/
│   │   ├── page.tsx              ← Venue listing + search
│   │   └── [id]/page.tsx         ← Venue detail + booking + reviews
│   └── bookings/
│       └── page.tsx              ← My bookings page
├── components/
│   └── layout/Navbar.tsx         ← Top navigation bar
├── lib/
│   ├── api.ts                    ← All API calls to Spring Boot
│   └── AuthContext.tsx           ← Global login state (React Context)
└── types/index.ts                ← TypeScript types matching backend
```

---

## ⚙️ Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.example .env.local
# Edit .env.local with your Spring Boot URL
```

### 3. Make sure Spring Boot backend is running
```bash
# In your sportslot-backend folder:
mvn spring-boot:run
# Backend runs at http://localhost:8080
```

### 4. Run the web app
```bash
npm run dev
# Opens at http://localhost:3000
```

---

## 🔗 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero + sport picker |
| `/venues` | Browse & search all venues |
| `/venues?sport=Football` | Filter venues by sport |
| `/venues/:id` | Venue detail — book slots & write reviews |
| `/bookings` | My bookings (requires login) |
| `/auth/login` | Login page |
| `/auth/register` | Register page |

---

## 🔐 How Auth Works

1. User logs in → Spring Boot returns a JWT token
2. Token is stored in a browser cookie (1 day expiry)
3. Every API request automatically sends `Authorization: Bearer <token>`
4. If token expires → auto redirect to login page
5. `useAuth()` hook gives access to `{ user, isLoggedIn, login, logout }` anywhere

---

## 🚀 Next Steps

1. **React Native App** — same API, mobile UI
2. **Deploy backend** to Railway
3. **Deploy frontend** to Vercel (just `vercel deploy`)
4. **Add venue creation** for admins
