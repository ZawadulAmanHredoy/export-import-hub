import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { api } from "../lib/api";

export default function AllProducts() {
  const [search, setSearch] = useState("");

  const { data } = useQuery({
    queryKey: ["products", search],
    queryFn: async () => {
      const res = await api.get(`/products?search=${search}`);
      return Array.isArray(res.data) ? res.data : [];
    }
  });

  const products = Array.isArray(data) ? data : [];

  return (
    <div className="container-x py-8">
      <Helmet>
        <title>All Products | Import Export Hub</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>
        <input
          className="input max-w-sm"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {products.length === 0 && (
          <p>No products available.</p>
        )}

        {products.map((p) => (
          <div key={p._id} className="card flex flex-col overflow-hidden">
            <img
              src={p.imageUrl}
              alt={p.name}
              className="h-44 w-full object-cover"
            />
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-lg">{p.name}</h3>
              <p className="text-sm mt-2">
                Price: ${p.price}<br />
                Origin: {p.originCountry}<br />
                Rating: {p.rating}<br />
                Qty: {p.availableQty}
              </p>
              <Link
                to={`/products/${p._id}`}
                className="btn-primary mt-auto"
              >
                See Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
