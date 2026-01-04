// client/src/pages/ProductDetails.jsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";

import { api } from "../lib/api.js";
import { useAuth } from "../providers/AuthProvider.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const qc = useQueryClient();

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);

  const { data: p, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => (await api.get(`/products/${id}`)).data,
  });

  const images = useMemo(() => {
    const arr = Array.isArray(p?.images) ? p.images.filter(Boolean) : [];
    if (arr.length) return arr;
    return p?.imageUrl ? [p.imageUrl] : [];
  }, [p]);

  const maxQty = useMemo(() => Number(p?.availableQty || 0), [p]);

  const canSubmit = useMemo(() => {
    const n = Number(qty);
    return Number.isFinite(n) && n >= 1 && n <= maxQty;
  }, [qty, maxQty]);

  const onClickImportNow = () => {
    if (!user) {
      toast.error("Please login to import");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    setOpen(true);
  };

  const submitImport = async () => {
    try {
      await api.post("/imports", { productId: id, quantity: Number(qty) });
      toast.success("Imported successfully");
      setOpen(false);
      setQty(1);

      await qc.invalidateQueries({ queryKey: ["product", id] });
      await qc.invalidateQueries({ queryKey: ["latest-products"] });
      await qc.invalidateQueries({ queryKey: ["products"] });
      await qc.invalidateQueries({ queryKey: ["my-imports"] });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Import failed");
    }
  };

  if (isLoading) return <div className="container-x py-10">Loading...</div>;
  if (!p) return <div className="container-x py-10">Product not found.</div>;

  return (
    <div className="container-x py-8">
      <Helmet>
        <title>{p.name} | Import Export Hub</title>
      </Helmet>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="grid gap-3">
          <img
            src={images[0]}
            alt={p.name}
            className="w-full h-80 object-cover rounded-2xl border border-slate-200 dark:border-slate-800"
          />

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((src) => (
                <img
                  key={src}
                  src={src}
                  alt="thumb"
                  className="h-20 w-full object-cover rounded-xl border border-slate-200 dark:border-slate-800"
                />
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h1 className="text-3xl font-extrabold">{p.name}</h1>

          <div className="mt-3 text-slate-600 dark:text-slate-300 grid gap-1">
            <div>Price: {p.price}</div>
            <div>Origin: {p.originCountry}</div>
            <div>Rating: {p.rating}</div>
            <div>Available Quantity: {p.availableQty}</div>
          </div>

          <button onClick={onClickImportNow} className="btn-primary mt-6">
            Import Now
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Import Quantity</h2>
              <button onClick={() => setOpen(false)} className="btn-outline">
                Close
              </button>
            </div>

            <div className="mt-4">
              <label className="text-sm">
                Quantity (max {maxQty})
              </label>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="mt-2 input"
              />

              {!canSubmit && (
                <p className="mt-2 text-sm text-red-500">
                  Quantity must be between 1 and {maxQty}.
                </p>
              )}

              <button
                disabled={!canSubmit}
                onClick={submitImport}
                className="mt-5 w-full px-5 py-3 rounded-xl font-medium
                bg-slate-900 text-white hover:opacity-90
                dark:bg-slate-100 dark:text-slate-900
                disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
