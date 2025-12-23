
---

## ✅ `client/README.md`

# Import Export Hub — Client (Frontend)

React client deployed on **Firebase Hosting**, connected to the Vercel API.

---

## Features

- View all products (public)
- Add export products (requires login)
- Import products (requires login)
- View My Exports / My Imports (requires login)
- Firebase Authentication
- Axios API client with auto token attach.

---

## Tech Stack

- React (Vite)
- Firebase Auth
- Axios
- Deployed on Firebase Hosting

---

## Project Setup

### 1) Install dependencies
bash
cd client
npm install

2) Configure Environment Variables

Create a .env file in client/:

VITE_API_BASE_URL=https://your-vercel-server.vercel.app
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...


✅ Make sure VITE_API_BASE_URL starts with https://

Run Locally
npm run dev


The app runs on:

http://localhost:5173

Build for Production
npm run build


This creates a dist/ folder.

Firebase Hosting Deployment
1) Login to Firebase
firebase login

2) Initialize hosting (first time only)
firebase init


Choose:

Hosting

Use existing project

Public directory: dist

Single-page app: Yes

3) Deploy
npm run build
firebase deploy --only hosting

Production Checklist

✅ Confirm your deployed site calls the right API:

Open DevTools → Network tab → refresh the page

Request must go to:

https://your-vercel-server.vercel.app/products


✅ Auth routes require token:

Add product

Import product

My exports/imports

Common Issues
Products not showing

Check VITE_API_BASE_URL is correct

Confirm /products works in browser

401 Unauthorized on create/import

Ensure user is logged in

Ensure server has Firebase Admin env variables set

CORS error

Set CLIENT_ORIGIN in Vercel to your Firebase hosting URL

Redeploy server

Scripts

npm run dev → Start dev server

npm run build → Build for production

firebase deploy --only hosting → Deploy to Firebase Hosting


---

If you want, I can also add a **root README.md** (for the whole project) so the repo looks professional.

