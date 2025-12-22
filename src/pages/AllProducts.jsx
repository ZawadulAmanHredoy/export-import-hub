import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { api } from "../lib/api.js";

export default function AllProducts() {
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["products", q],
    queryFn: async () => (await api.get(`/products?search=${encodeURIComponent(q)}`)).data
  });

  const products = useMemo(() => data || [], [data]);

  return (
    <div className="container-x py-8">
      <Helmet><title>All Products | Import Export Hub</title></Helmet>

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">All Products</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by product name..."
          className="input md:max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="mt-6">Loading...</div>
      ) : (
        <>
          <div className="mt-6 grid gap-5 md:grid-cols-3 items-stretch">
            {products.map((p) => (
              <div key={p._id} className="card overflow-hidden flex flex-col h-full">
                <img src={p.imageUrl} alt={p.name} className="h-44 w-full object-cover" />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="font-bold text-lg line-clamp-1">{p.name}</div>
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Price: ${p.price} • Origin: {p.originCountry}
                    <br />
                    Rating: {p.rating} • Qty: {p.availableQty}
                  </div>
                  <div className="mt-auto pt-4">
                    <Link to={`/products/${p._id}`} className="btn-primary w-full">
                      See Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {products.length === 0 && <div className="mt-6">No products found.</div>}
        </>
      )}
    </div>
  );
}
