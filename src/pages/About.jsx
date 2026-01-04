// client/src/pages/About.jsx
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="container-x py-10">
      <Helmet>
        <title>About | Import Export Hub</title>
      </Helmet>

      <div className="card p-6 md:p-10">
        <h1 className="text-3xl font-extrabold">About Import Export Hub</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Import Export Hub is an inventory-focused app where users can publish export items, browse listings,
          and create import records that reduce stock in real time.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="card p-5">
            <div className="font-bold">Exports</div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Create and manage your own export product listings from the dashboard.
            </p>
          </div>

          <div className="card p-5">
            <div className="font-bold">Imports</div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Import items with quantity validation and keep inventory consistent.
            </p>
          </div>

          <div className="card p-5">
            <div className="font-bold">Authentication</div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Access your dashboard securely using email/password or Google sign-in.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/products" className="btn-primary">
            Explore Products
          </Link>
          <Link to="/dashboard" className="btn-outline">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
