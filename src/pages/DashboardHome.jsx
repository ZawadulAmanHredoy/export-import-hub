// client/src/pages/DashboardHome.jsx
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import api from "../lib/api.js";
import { useAuth } from "../providers/AuthProvider.jsx";

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function DashboardHome() {
  const { user } = useAuth();

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["dashboard-products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const products = Array.isArray(data) ? data : [];

  const stats = useMemo(() => {
    const totalProducts = products.length;

    const totalStock = products.reduce(
      (sum, p) => sum + toNum(p?.availableQty),
      0
    );

    const ratings = products.map((p) => toNum(p?.rating)).filter((r) => r > 0);
    const avgRating = ratings.length
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

    const originMap = new Map();
    for (const p of products) {
      const origin = String(p?.originCountry || "").trim();
      if (!origin) continue;
      originMap.set(origin, (originMap.get(origin) || 0) + 1);
    }

    const topOrigins = Array.from(originMap.entries())
      .map(([origin, count]) => ({ origin, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const lowStock = [...products]
      .filter((p) => toNum(p?.availableQty) > 0)
      .sort((a, b) => toNum(a?.availableQty) - toNum(b?.availableQty))
      .slice(0, 5);

    return { totalProducts, totalStock, avgRating, topOrigins, lowStock };
  }, [products]);

  return (
    <div className="container-x py-8 space-y-8">
      <Helmet>
        <title>Dashboard | Import Export Hub</title>
      </Helmet>

      <section className="card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              Dashboard
              {isFetching ? (
                <span className="ml-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  (syncing)
                </span>
              ) : null}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Overview of products and inventory.
            </p>

            {user ? (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Signed in as: <span className="font-semibold">{user.email}</span>
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Not signed in.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link className="btn-outline" to="/products">
              All Products
            </Link>
            <Link className="btn-outline" to="/my-imports">
              My Imports
            </Link>
            <Link className="btn-outline" to="/my-exports">
              My Exports
            </Link>
            <Link className="btn-primary" to="/add-export">
              Add Export
            </Link>
          </div>
        </div>
      </section>

      {error ? (
        <section className="card p-6">
          <p className="text-sm text-red-600 dark:text-red-400">
            Failed to load dashboard data.
          </p>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total products
          </div>
          <div className="mt-2 text-2xl font-extrabold">
            {isLoading ? "…" : stats.totalProducts}
          </div>
        </div>

        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total stock
          </div>
          <div className="mt-2 text-2xl font-extrabold">
            {isLoading ? "…" : stats.totalStock}
          </div>
        </div>

        <div className="card p-5">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Average rating
          </div>
          <div className="mt-2 text-2xl font-extrabold">
            {isLoading ? "…" : stats.avgRating.toFixed(1)}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-bold">Top origins</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Countries contributing the most products.
          </p>

          <div className="mt-4 space-y-2">
            {isLoading ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Loading...
              </p>
            ) : stats.topOrigins.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                No origin data yet.
              </p>
            ) : (
              stats.topOrigins.map((o) => (
                <div
                  key={o.origin}
                  className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2"
                >
                  <div className="font-medium">{o.origin}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {o.count}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold">Low stock</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Items that may run out soon.
          </p>

          <div className="mt-4 space-y-2">
            {isLoading ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Loading...
              </p>
            ) : stats.lowStock.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                No low stock items right now.
              </p>
            ) : (
              stats.lowStock.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2"
                >
                  <div className="min-w-0">
                    <div className="font-medium line-clamp-1">{p.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {p.originCountry || "Unknown origin"}
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    {p.availableQty}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
