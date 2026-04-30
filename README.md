<div align="center">

# 💻 devTinder — Frontend

### The React SPA for the devTinder platform

![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5.x-FF69B4?style=for-the-badge)

</div>

---

## 📁 Project Structure

```
tinder-dev-frontend/
├── src/
│   ├── main.jsx                # React root mount
│   ├── App.jsx                 # Router + Redux Provider + route definitions
│   ├── index.css               # Global styles, dark background, custom scrollbar
│   │
│   ├── components/
│   │   ├── Body.jsx            # Layout shell — Navbar + Outlet + Footer + auth gate
│   │   ├── Navbar.jsx          # Fixed glass navbar with avatar dropdown
│   │   ├── Footer.jsx          # Fixed bottom footer
│   │   ├── Login.jsx           # Login + Signup (split-panel design)
│   │   ├── Feed.jsx            # Swipe feed page
│   │   ├── UserCard.jsx        # Tinder-style card with swipe animations
│   │   ├── Profile.jsx         # Profile page wrapper
│   │   ├── ProfileUpdateForm.jsx # Edit form + live card preview + photo upload
│   │   ├── Connections.jsx     # Accepted connections grid
│   │   └── Requests.jsx        # Incoming request list with accept/reject
│   │
│   └── utils/
│       ├── appStore.js         # Redux store (4 slices)
│       ├── userSlice.js        # Logged-in user state
│       ├── feedSlice.js        # Feed array state
│       ├── connectionSlice.js  # Connections list state
│       ├── requestSlice.js     # Incoming requests state
│       ├── formatText.js       # Shared word-limit text formatter
│       └── constants.js        # BASE_URL = "/api"
│
├── index.html                  # HTML shell (dark theme, Inter font)
├── vite.config.js              # Vite config + /api proxy → localhost:7777
├── eslint.config.js
└── package.json
```

---

## 🛠️ Tech Stack

| Package | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| Vite + SWC | 7.x | Build tool, dev server, fast refresh |
| Redux Toolkit | 2.x | Global state management |
| React Router | 7.x | Client-side routing |
| Axios | 1.x | HTTP client (all API calls) |
| Tailwind CSS | 4.x | Utility-first styling |
| DaisyUI | 5.x | Component primitives (dark theme) |
| React Toastify | 11.x | Toast notifications |

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
cd tinder-dev-frontend
npm install
```

### 2. Make sure the backend is running

The frontend proxies all `/api/*` requests to `http://localhost:7777`.  
Start the backend first — see `tinder-dev/README.md`.

### 3. Run the dev server

```bash
npm run dev
```

> App available at **http://localhost:5173**

### Other commands

```bash
npm run build      # Production build → dist/
npm run preview    # Preview the production build locally
npm run lint       # ESLint check
```

---

## 🔁 API Proxy

All API calls use `BASE_URL = "/api"` (defined in `src/utils/constants.js`).  
Vite proxies `/api/*` → `http://localhost:7777` and strips the `/api` prefix:

```js
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:7777',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
},
```

All axios calls include `{ withCredentials: true }` so the JWT cookie is sent automatically.

---

## 🗺️ Routes

| Path | Component | Auth required |
|---|---|---|
| `/` | `Feed` | ✅ (redirects to `/login` if no session) |
| `/login` | `Login` | ❌ |
| `/profile` | `Profile` → `ProfileUpdateForm` | ✅ |
| `/connections` | `Connections` | ✅ |
| `/requests` | `Requests` | ✅ |

All routes are nested under `Body`, which acts as the auth gate — it fetches the current user on mount and redirects to `/login` on a 401.

---

## 🗃️ Redux Store

```
appStore
├── user          → logged-in user object (null if logged out)
├── feed          → array of users in the swipe feed
├── connections   → array of accepted connections
└── requests      → array of incoming pending requests
```

### Key actions

| Slice | Action | Effect |
|---|---|---|
| `userSlice` | `addUser(user)` | Sets logged-in user |
| `userSlice` | `removeUser()` | Clears user (logout) |
| `feedSlice` | `addFeed(users)` | Populates the feed |
| `feedSlice` | `removeUserFromFeed(id)` | Removes a swiped card |
| `connectionSlice` | `addConnection(list)` | Sets connections list |
| `requestSlice` | `addRequests(list)` | Sets incoming requests |
| `requestSlice` | `removeRequest(id)` | Removes reviewed request |

---

## 🃏 Swipe Card Animations

`UserCard` uses inline `style` transforms (not Tailwind classes) to drive the swipe animation, so the values aren't purged by the CSS build:

```
Click ♥  → translateX(160%) rotate(25deg) + opacity 0   +  LIKE stamp
Click ✕  → translateX(-160%) rotate(-25deg) + opacity 0 +  NOPE stamp
```

The card has a unique `key={feed[0]._id}` in `Feed.jsx` so React unmounts and remounts a fresh `UserCard` (with `swipeDir = null`) for each new user — preventing the animation state from carrying over.

---

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#080810` |
| Brand gradient | `from-pink-500 to-orange-400` |
| Glass card | `bg-white/4 border border-white/8 backdrop-blur` |
| Skill badges | `bg-violet-500/15 text-violet-300` |
| Font | Inter (Google Fonts) |
| Theme | DaisyUI `dark` |

---

## 📷 Profile Photo Upload

1. User clicks the photo zone in `ProfileUpdateForm`
2. Browser file picker opens (filtered to `image/*`, max 5 MB)
3. A local blob URL is created instantly for preview (`URL.createObjectURL`)
4. The file is uploaded via `POST /api/profile/upload-photo` as `multipart/form-data`
5. On success, the hosted URL from the server replaces the blob URL in state and Redux
6. On failure, the previous photo is restored and an error toast is shown

---

## 🧹 ESLint

Flat config (`eslint.config.js`) with:
- `eslint:recommended`
- `react-hooks/recommended`
- `react-refresh/vite`
- `no-unused-vars` — ignores identifiers starting with uppercase or `_`
