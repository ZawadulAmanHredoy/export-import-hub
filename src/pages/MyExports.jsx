import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { api } from "../lib/api.js";

export default function MyExports() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["my-exports"],
    queryFn: async () => (await api.get("/products/my")).data
  });

  const list = useMemo(() => data || [], [data]);

  const del = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success("Deleted");
      await qc.invalidateQueries({ queryKey: ["my-exports"] });
      await qc.invalidateQueries({ queryKey: ["products"] });
      await qc.invalidateQueries({ queryKey: ["latest-products"] });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name,
      imageUrl: p.imageUrl,
      price: p.price,
      originCountry: p.originCountry,
      rating: p.rating,
      availableQty: p.availableQty
    });
  };

  const save = async () => {
    try {
      await api.put(`/products/${editing._id}`, {
        ...form,
        price: Number(form.price),
        rating: Number(form.rating),
        availableQty: Number(form.availableQty)
      });
      toast.success("Updated");
      setEditing(null);
      setForm(null);
      await qc.invalidateQueries({ queryKey: ["my-exports"] });
      await qc.invalidateQueries({ queryKey: ["products"] });
      await qc.invalidateQueries({ queryKey: ["latest-products"] });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="container-x py-8">
      <Helmet><title>My Exports | Import Export Hub</title></Helmet>
      <h1 className="text-2xl font-bold">My Exports</h1>

      {isLoading ? (
        <div className="mt-6">Loading...</div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-3 items-stretch">
          {list.map((p) => (
            <div key={p._id} className="card overflow-hidden flex flex-col h-full">
              <img src={p.imageUrl} alt={p.name} className="h-44 w-full object-cover" />
              <div className="p-4 flex-1 flex flex-col">
                <div className="font-bold text-lg line-clamp-1">{p.name}</div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Price: ${p.price} • Origin: {p.originCountry}
                  <br />
                  Rating: {p.rating} • Qty: {p.availableQty}
                </div>

                <div className="mt-auto pt-4 flex gap-2">
                  <button onClick={() => del(p._id)} className="btn-outline flex-1">Delete</button>
                  <button onClick={() => openEdit(p)} className="btn-primary flex-1">Update</button>
                </div>
              </div>
            </div>
          ))}

          {list.length === 0 && <div className="mt-6">No exports yet.</div>}
        </div>
      )}

      {editing && form && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Update Product</h2>
              <button onClick={() => { setEditing(null); setForm(null); }} className="btn-outline">
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <Input label="Product Name" value={form.name} onChange={(v) => setForm((s) => ({ ...s, name: v }))} />
              <Input label="Image URL" value={form.imageUrl} onChange={(v) => setForm((s) => ({ ...s, imageUrl: v }))} />
              <div className="grid md:grid-cols-2 gap-3">
                <Input label="Price" type="number" value={form.price} onChange={(v) => setForm((s) => ({ ...s, price: v }))} />
                <Input label="Origin Country" value={form.originCountry} onChange={(v) => setForm((s) => ({ ...s, originCountry: v }))} />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <Input label="Rating" type="number" value={form.rating} onChange={(v) => setForm((s) => ({ ...s, rating: v }))} />
                <Input label="Available Qty" type="number" value={form.availableQty} onChange={(v) => setForm((s) => ({ ...s, availableQty: v }))} />
              </div>

              <button onClick={save} className="btn-primary mt-2 w-full">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 input"
      />
    </div>
  );
}
