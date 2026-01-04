// client/src/components/ProductCard.jsx
import { Link } from "react-router-dom";

export default function ProductCard({ p }) {
  const img = p?.imageUrl || "https://i.ibb.co/7QpKsCX/image-not-found.png";
  const title = p?.name || "Untitled";
  const origin = p?.originCountry || "—";
  const rating = Number(p?.rating || 0);
  const price = p?.price ?? "—";
  const qty = p?.availableQty ?? "—";

  return (
    <div className="card overflow-hidden flex flex-col h-full">
      <img src={img} alt={title} className="h-44 w-full object-cover" />

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-extrabold text-lg leading-snug line-clamp-1">{title}</h3>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
          Export-ready product with transparent pricing and origin info. Track quantity and import safely.
        </p>

        <div className="mt-3 text-sm text-slate-600 dark:text-slate-300 grid gap-1">
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Price:</span> {price}
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Origin:</span> {origin}
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Rating:</span> {rating || "—"}
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Qty:</span> {qty}
          </div>
        </div>

        <Link to={`/products/${p?._id || p?.id}`} className="btn-primary mt-4 w-full">
          View Details
        </Link>
      </div>
    </div>
  );
}
