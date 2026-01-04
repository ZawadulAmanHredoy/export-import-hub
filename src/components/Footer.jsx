// client/src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-14 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="container-x py-12 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link to="/" className="font-extrabold text-lg tracking-tight">
            Import Export Hub
          </Link>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Manage exports, browse products, and record imports with clean inventory tracking.
          </p>

          <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 grid gap-1">
            <div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Email:</span>{" "}
              walton@example.com
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Location:</span>{" "}
              Dhaka, Bangladesh
            </div>
          </div>
        </div>

        {/* Links */}
        <div>
          <div className="font-bold">Pages</div>
          <ul className="mt-3 grid gap-2 text-sm">
            <li>
              <Link className="hover:underline text-slate-700 dark:text-slate-200" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="hover:underline text-slate-700 dark:text-slate-200" to="/products">
                Products
              </Link>
            </li>
            <li>
              <Link className="hover:underline text-slate-700 dark:text-slate-200" to="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="hover:underline text-slate-700 dark:text-slate-200" to="/contact">
                Contact
              </Link>
            </li>
            <li>
              <Link className="hover:underline text-slate-700 dark:text-slate-200" to="/dashboard">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <div className="font-bold">Resources</div>
          <ul className="mt-3 grid gap-2 text-sm">
            <li>
              <a
                className="hover:underline text-slate-700 dark:text-slate-200"
                href="https://react.dev/"
                target="_blank"
                rel="noreferrer"
              >
                React
              </a>
            </li>
            <li>
              <a
                className="hover:underline text-slate-700 dark:text-slate-200"
                href="https://vite.dev/"
                target="_blank"
                rel="noreferrer"
              >
                Vite
              </a>
            </li>
            <li>
              <a
                className="hover:underline text-slate-700 dark:text-slate-200"
                href="https://tailwindcss.com/"
                target="_blank"
                rel="noreferrer"
              >
                Tailwind CSS
              </a>
            </li>
            <li>
              <a
                className="hover:underline text-slate-700 dark:text-slate-200"
                href="https://firebase.google.com/"
                target="_blank"
                rel="noreferrer"
              >
                Firebase
              </a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <div className="font-bold">Social</div>
          <ul className="mt-3 grid gap-2 text-sm">
            <li>
              <a
                className="hover:underline text-slate-700 dark:text-slate-200"
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                className="hover:underline text-slate-700 dark:text-slate-200"
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                className="hover:underline text-slate-700 dark:text-slate-200"
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            </li>
          </ul>

          <div className="mt-5">
            <Link to="/contact" className="btn-outline w-full">
              Contact
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="container-x py-5 flex flex-col md:flex-row gap-3 items-center justify-between text-sm text-slate-600 dark:text-slate-300">
          <div>© {year} Import Export Hub. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link className="hover:underline" to="/about">
              About
            </Link>
            <Link className="hover:underline" to="/contact">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
