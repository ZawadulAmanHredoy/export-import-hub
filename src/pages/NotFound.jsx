import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <div className="container-x py-14">
      <Helmet><title>404 | Import Export Hub</title></Helmet>
      <h1 className="text-3xl font-extrabold">Page not found</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">The route you tried doesn’t exist.</p>
      <Link className="mt-6 inline-block underline" to="/">Go Home</Link>
    </div>
  );
}
