# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server (defaults to port 5173, which the backend's CORS allows)
- `npm run build` — production build with Vite
- `npm run lint` — ESLint over the project (config in [eslint.config.js](eslint.config.js))
- `npm run preview` — preview the production build

No test runner is configured.

## Architecture

React 19 + Vite 7 (SWC fast refresh) SPA that consumes the Express API in `../tinder-dev`. Uses Redux Toolkit for state, React Router v7 for routing, axios for HTTP, and Tailwind v4 + DaisyUI for styling.

### API base URL — proxy required

[src/utils/constants.js](src/utils/constants.js) sets `BASE_URL = "/api"`. There is **no Vite proxy configured** in [vite.config.js](vite.config.js), so requests to `/api/...` will 404 in `npm run dev` unless you either:
- add a `server.proxy` entry to `vite.config.js` that forwards `/api` → `http://localhost:7777`, or
- swap the BASE_URL back to `http://localhost:7777` (the commented-out line shows this was the original).

Every component calls the API with `{ withCredentials: true }` so the JWT cookie set by the backend's `/login` and `/signup` rides along.

### Routing & layout

[src/App.jsx](src/App.jsx) wraps the tree in `<Provider store={appStore}>` and a `<BrowserRouter>`. All routes nest under [Body](src/components/Body.jsx), which renders `<Navbar/> <Outlet/> <Footer/>`. Body fires `GET /profile/view` on mount; on a 401 it redirects to `/login`. This is the app's auth gate — there's no per-route guard.

Routes: `/` → Feed, `/login`, `/profile`, `/connections`, `/requests`.

### Redux store

[src/utils/appStore.js](src/utils/appStore.js) combines four slices, each in `src/utils/`:

- `userSlice` — current logged-in user (`addUser`/`removeUser`)
- `feedSlice` — array of feed users; `removeUserFromFeed(userId)` filters by `_id` after a swipe
- `connectionSlice` — accepted connections list
- `requestSlice` — pending received requests; `removeRequest(_id)` filters after accept/reject

Components short-circuit fetches when their slice is already populated (e.g. `if (feed) return` in [Feed.jsx](src/components/Feed.jsx), `if (userData) return` in [Body.jsx](src/components/Body.jsx)). After login/signup, dispatch `addUser` to keep this cache warm — otherwise Body will re-fetch.

### Backend API contract quirks

Two endpoint paths are misspelled on the server and the frontend mirrors them — do not "fix" one side in isolation:

- `GET /user/requests/recived` (not `received`) — used by [Requests.jsx](src/components/Requests.jsx)
- `POST /request/send/intrested/:id` (not `interested`) — the `intrested` status string is also one of the enum values the backend accepts

Swipe actions in [UserCard.jsx](src/components/UserCard.jsx) post to `/request/send/{ignored|intrested}/:userId`. Review actions in [Requests.jsx](src/components/Requests.jsx) post to `/request/review/{accepted|rejected}/:requestId`.

### Styling

Tailwind v4 is wired through `@tailwindcss/vite` (no PostCSS config needed). DaisyUI class names (`btn`, `card`, `hero`, `list`, `bg-base-100`, etc.) are used throughout — keep that vocabulary when adding UI.

### ESLint

[eslint.config.js](eslint.config.js) uses the flat-config format with `js.recommended`, `react-hooks`, and `react-refresh/vite`. The `no-unused-vars` rule ignores identifiers starting with an uppercase letter or underscore (`varsIgnorePattern: '^[A-Z_]'`), so unused component imports won't error.
