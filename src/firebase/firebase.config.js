import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
  // eslint-disable-next-line no-console
  console.error(
    "Missing VITE_FIREBASE_API_KEY. Check /client/.env(.production) and restart dev server."
  );
}
if (!firebaseConfig.authDomain) {
  // eslint-disable-next-line no-console
  console.error(
    "Missing VITE_FIREBASE_AUTH_DOMAIN. Check /client/.env(.production) and restart dev server."
  );
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
