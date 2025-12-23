import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { api } from "../lib/api";

const slides = [
  {
    title: "Import smarter. Export faster.",
    desc: "Manage exports, browse global products, and import with one click."
  },
  {
    title: "Real-time inventory",
    desc: "Stock updates instantly after every import."
  },
  {
    title: "Secure & reliable",
    desc: "Firebase auth with protected routes."
  }
];

export default function Home() {
  const [idx, setIdx] = useState(0);

  const { data } = useQuery({
    queryKey: ["latest-products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return Array.isArray(res.data) ? res.data : [];
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const products = useMemo(() => {
    return Array.isArray(data) ? data.slice(0, 6) : [];
  }, [data]);

  return (
    <div className="container-x py-8">
      <Helmet>
        <title>Home | Import Export Hub</title>
      </Helmet>

      {/* Banner */}
      <section className="card p-6 md:p-10">
        <h1 className="text-3xl md:text-5xl font-bold">{slides[idx].title}</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          {slides[idx].desc}
        </p>
      </section>

      {/* Latest Products */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Latest Products</h2>

        <div className="grid gap-5 md:grid-cols-3">
          {products.length === 0 && (
            <p>No products found.</p>
          )}

          {products.map((p) => (
            <div key={p._id} className="card overflow-hidden flex flex-col">
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
      </section>
    </div>
  );
}
