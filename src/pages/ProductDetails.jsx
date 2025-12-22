import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { api } from "../lib/api.js";

export default function ProductDetails() {
  const { id } = useParams();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);

  const { data: p, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => (await api.get(`/products/${id}`)).data
  });

  const maxQty = useMemo(() => Number(p?.availableQty || 0), [p]);

  const canSubmit = useMemo(() => {
    const n = Number(qty);
    return Number.isFinite(n) && n >= 1 && n <= maxQty;
  }, [qty, maxQty]);

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
      <Helmet><title>{p.name} | Import Export Hub</title></Helmet>

      <div className="grid gap-6 md:grid-cols-2">
        <img
          src={p.imageUrl}
          alt={p.name}
          className="w-full h-80 object-cover rounded-2xl border border-slate-200 dark:border-slate-800"
        />
        <div className="card p-6">
          <h1 className="text-3xl font-extrabold">{p.name}</h1>

          <div className="mt-3 text-slate-600 dark:text-slate-300">
            <div>Price: ${p.price}</div>
            <div>Origin: {p.originCountry}</div>
            <div>Rating: {p.rating}</div>
            <div>Available Quantity: {p.availableQty}</div>
          </div>

          <button onClick={() => setOpen(true)} className="btn-primary mt-6">
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
              <label className="text-sm">Quantity (max {maxQty})</label>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="mt-2 input"
              />
              {!canSubmit && (
                <p className="mt-2 text-sm text-red-500">
                  Quantity must be between 1 and {maxQty}. Submit is disabled if it exceeds available.
                </p>
              )}
            </div>

            <button
              disabled={!canSubmit}
              onClick={submitImport}
              className={`mt-5 w-full px-5 py-3 rounded-xl font-medium ${
                canSubmit
                  ? "bg-slate-900 text-white hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
                  : "bg-slate-300 text-slate-600 dark:bg-slate-800 dark:text-slate-400 cursor-not-allowed"
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
