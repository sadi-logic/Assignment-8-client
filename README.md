# StudioSpace

StudioSpace is a marketplace for renting creative studios. People who need a photo studio, podcast room, music suite or art workshop can browse listings and book by the hour. Studio owners can list their own spaces and manage them from a dashboard.

This repository is the **client** (Next.js). It talks to a separate Express + MongoDB API: [Assignment-8-server](https://github.com/sadi-logic/Assignment-8-server).

## Live Website

**Client:** [https://studiospace-frontend-mu.vercel.app](https://studiospace-frontend-mu.vercel.app)

## Examiner Test Credentials

Log in at `/login` with:

| Field | Value |
| --- | --- |
| Email | `onik96ahmed@gmail.com` |
| Password | `Onik96ahmed@gmail.com` |

## Features

- **Explore studios:** search by studio name or location, filter by category, and sort by rating or price (low to high / high to low).
- **Studio details:** amenities, host info, guest reviews and a star-rating breakdown for each listing.
- **Hourly booking:** choose a date, start time and duration, respect the studio's minimum booking hours, and see the total price update as you change it. New requests start as `Pending`, and the server rejects a slot that overlaps an already confirmed booking.
- **My Bookings:** view your reservations with their status and cancel one from the dashboard.
- **Studio management:** add a new listing, edit it, or delete it from the dashboard.
- **Authentication:** email/password sign up and login, plus Google sign-in, with form validation on the client.
- **Protected routes:** everything under `/dashboard` redirects to `/login` if you are not signed in, and the API checks a JWT on write and account-specific requests.
- **Light and dark mode:** toggle in the navbar, saved in the browser.
- **Responsive layout:** mobile navigation menu and a responsive dashboard sidebar.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19 with React Compiler, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui (Base UI), lucide-react, Sonner (toasts), Embla Carousel, react-day-picker, date-fns |
| Authentication | Better Auth (email/password + Google) with the JWT plugin; the server verifies tokens with `jose` |
| Backend | Node.js, Express 5, cookie-parser, cors, dotenv |
| Database | MongoDB (app data via the MongoDB driver; Better Auth users and sessions via its MongoDB adapter) |
| Deployment | Vercel |

## How auth works

Better Auth runs inside this Next.js app (`/api/auth/*`). After login, the client gets a JWT from Better Auth and sends it to the server's `POST /auth/session` endpoint, which stores it in an HTTP-only cookie. The server checks that token against this app's `/api/auth/jwks` endpoint on every protected request.

## Local Setup

### Prerequisites

- Node.js 20.9 or newer
- A MongoDB database (local or Atlas)
- Google OAuth credentials, only if you want Google sign-in to work

### 1. Server

Repository: [sadi-logic/Assignment-8-server](https://github.com/sadi-logic/Assignment-8-server)

```bash
git clone https://github.com/sadi-logic/Assignment-8-server.git
cd Assignment-8-server
npm install
```

Create a `.env` file in the server folder:

```env
# MongoDB connection string (the server uses a database named "studiospace")
MONGO_URI=your_mongodb_connection_string

# URL of the client. Used for CORS and for verifying JWTs.
FRONTEND_URL=http://localhost:3000
```

Start the server (there is no `start` script, so run the entry file directly):

```bash
node index.js
```

It runs on port `5000`.

### 2. Client

```bash
git clone https://github.com/sadi-logic/Assignment-8-client.git
cd Assignment-8-client
npm install
```

Create a `.env.local` file in the project root:

```env
# URL where the Express API is running
NEXT_PUBLIC_SERVER_URL=http://localhost:5000

# URL where this Next.js app is running (used by Better Auth).
# Must match FRONTEND_URL in the server's .env
BETTER_AUTH_URL=http://localhost:3000

# MongoDB connection string used by Better Auth
MONGODB_URI=your_mongodb_connection_string

# Google OAuth credentials (needed for Google sign-in)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Optional: endpoint for the footer newsletter form.
# If it is not set, the form shows a "coming soon" message.
NEXT_PUBLIC_NEWSLETTER_API_URL=
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Keep the client running while you use the app, because the server fetches its signing keys from it.

### Other client commands

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # ESLint
```

## Project Structure

```text
src/
├── app/
│   ├── api/auth/[...all]/   # Better Auth route handler
│   ├── dashboard/           # Add studio, my listings, my bookings, update studio
│   ├── studios/             # Explore page and studio details + booking form
│   ├── login/ register/     # Auth pages
│   └── page.tsx             # Home page
├── components/              # Navbar, footer, auth components, shadcn/ui
├── lib/                     # Better Auth config, auth client, studio API helpers
└── proxy.ts                 # Redirects unauthenticated users away from /dashboard
