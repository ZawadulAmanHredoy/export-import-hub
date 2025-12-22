import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { api } from "../lib/api.js";

const slides = [
  {
    title: "Import smarter. Export faster.",
    desc: "A modern trade hub to manage your exports, browse products, and import in one click.",
    cta1: { label: "Browse Products", to: "/products" },
    cta2: { label: "Add Export", to: "/add-export" }
  },
  {
    title: "Real-time stock control",
    desc: "Imports reduce available quantity instantly (server enforced). No overselling.",
    cta1: { label: "My Imports", to: "/my-imports" },
    cta2: { label: "My Exports", to: "/my-exports" }
  },
  {
    title: "Secure access, clean UI",
    desc: "Firebase authentication + private routes + dynamic titles + dark mode.",
    cta1: { label: "Login", to: "/login" },
    cta2: { label: "Register", to: "/register" }
  }
];

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["latest-products"],
    queryFn: async () => (await api.get("/products?limit=6&sort=latest")).data
  });

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);

  const s = slides[idx];
  const products = useMemo(() => data || [], [data]);

  return (
    <div className="container-x py-8">
      <Helmet><title>Home | Import Export Hub</title></Helmet>

      <section className="card p-6 md:p-10 overflow-hidden relative">
        <div className="absolute inset-0 opacity-30 pointer-events-none bg-gradient-to-br from-slate-200 to-transparent dark:from-slate-800" />
        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">{s.title}</h1>
              <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-2xl">{s.desc}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={s.cta1.to} className="btn-primary">{s.cta1.label}</Link>
                <Link to={s.cta2.to} className="btn-outline">{s.cta2.label}</Link>
              </div>
            </div>

            <div className="hidden md:flex flex-col gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`w-3 h-3 rounded-full border ${
                    i === idx
                      ? "bg-slate-900 dark:bg-slate-100 border-transparent"
                      : "bg-transparent border-slate-400 dark:border-slate-600"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-2xl font-bold">Latest Products</h2>
          <Link className="underline text-sm" to="/products">See all</Link>
        </div>

        {isLoading ? (
          <div className="mt-6">Loading latest products...</div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {products.map((p) => (
              <div key={p._id} className="card overflow-hidden flex flex-col">
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
        )}
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-xl font-bold">Trade-ready workflows</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Add exports, manage your catalog, and update inventory without spreadsheets.
          </p>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-bold">Reliable imports</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Import quantities are validated client-side and enforced server-side.
          </p>
        </div>
      </section>

      <section className="mt-5 card p-6">
        <h3 className="text-xl font-bold">Why Import Export Hub?</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="font-semibold">Fast</div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Minimal clicks to export/import products.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="font-semibold">Safe</div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Secure private routes and verified tokens.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="font-semibold">Consistent</div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Uniform card layout, spacing, and button style.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
