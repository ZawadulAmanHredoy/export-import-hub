// client/src/pages/Home.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";

import { api } from "../lib/api";
import ProductCard from "../components/ProductCard.jsx";
import ProductCardSkeleton from "../components/ProductCardSkeleton.jsx";

const slides = [
  {
    title: "Import smarter. Export faster.",
    desc: "Browse export products, track stock, and record imports with quantity validation.",
    cta: { label: "Explore Products", to: "/products" },
  },
  {
    title: "Inventory stays accurate",
    desc: "Every import reduces available quantity, so stock reflects real activity.",
    cta: { label: "Go to My Exports", to: "/my-exports" },
  },
  {
    title: "Secure access",
    desc: "Login with email/password or Google and manage your data from the dashboard-style pages.",
    cta: { label: "Login", to: "/login" },
  },
];

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

export default function Home() {
  const [idx, setIdx] = useState(0);
  const nextSectionRef = useRef(null);

  const {
    data,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["home-products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const products = Array.isArray(data) ? data : [];

  // Slider auto-play
  useEffect(() => {
    const timer = setInterval(
      () => setIdx((i) => (i + 1) % slides.length),
      4500
    );
    return () => clearInterval(timer);
  }, []);

  const latestProducts = useMemo(
    () => products.slice(0, 8),
    [products]
  );

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce(
      (sum, p) => sum + toNum(p?.availableQty),
      0
    );

    const ratings = products
      .map((p) => toNum(p?.rating))
      .filter((r) => r > 0);
    const avgRating = ratings.length
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

    const origins = products
      .map((p) => String(p?.originCountry || "").trim())
      .filter(Boolean);

    return {
      totalProducts,
      totalStock,
      avgRating: Number.isFinite(avgRating) ? avgRating : 0,
      originCount: uniq(origins).length,
    };
  }, [products]);

  const originCards = useMemo(() => {
    const map = new Map();
    for (const p of products) {
      const origin = String(p?.originCountry || "").trim();
      if (!origin) continue;
      map.set(origin, (map.get(origin) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([origin, count]) => ({ origin, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [products]);

  const topRated = useMemo(
    () =>
      [...products]
        .filter((p) => toNum(p?.rating) > 0)
        .sort(
          (a, b) => toNum(b?.rating) - toNum(a?.rating)
        )
        .slice(0, 4),
    [products]
  );

  const lowStock = useMemo(
    () =>
      [...products]
        .filter((p) => toNum(p?.availableQty) > 0)
        .sort(
          (a, b) =>
            toNum(a?.availableQty) - toNum(b?.availableQty)
        )
        .slice(0, 5),
    [products]
  );

  const faqs = [
    {
      q: "What happens when I import a product?",
      a: "An import record is created and the product’s available quantity decreases based on the amount you import.",
    },
    {
      q: "Can I manage my own export listings?",
      a: "Yes. After login, go to My Exports to update or delete your products.",
    },
    {
      q: "Is the product details page public?",
      a: "Yes, you can browse details without login. Login is required only when you want to import or manage dashboard items.",
    },
    {
      q: "How do I keep product images consistent?",
      a: "Use a direct image URL (jpg/png/webp). The cards use fixed height images for uniform layout.",
    },
  ];

  const scrollToNext = () => {
    nextSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const slide = slides[idx];

  const onNewsletterSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return toast.error("Please enter a valid email");
    }
    toast.success("Subscribed successfully");
    e.currentTarget.reset();
  };

  return (
    <div className="container-x py-8 space-y-12">
      <Helmet>
        <title>Home | Import Export Hub</title>
      </Helmet>

      {/* 1) Hero / Carousel */}
      <section className="card overflow-hidden relative min-h-[60vh] md:min-h-[65vh] flex flex-col md:flex-row">
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 w-fit">
            Inventory • Imports • Exports
            {isFetching && (
              <span className="text-slate-500 dark:text-slate-400">
                (syncing)
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight">
            {slide.title}
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl">
            {slide.desc}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={slide.cta.to} className="btn-primary">
              {slide.cta.label}
            </Link>
            <button
              onClick={scrollToNext}
              className="btn-outline"
            >
              See what’s inside
            </button>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center gap-2">
            <button
              className="btn-outline px-3"
              onClick={() =>
                setIdx(
                  (i) => (i - 1 + slides.length) % slides.length
                )
              }
              aria-label="Previous slide"
            >
              Prev
            </button>
            <button
              className="btn-outline px-3"
              onClick={() =>
                setIdx((i) => (i + 1) % slides.length)
              }
              aria-label="Next slide"
            >
              Next
            </button>

            <div className="ml-auto flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-2.5 w-2.5 rounded-full ${
                    i === idx
                      ? "bg-slate-900 dark:bg-slate-100"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="md:w-[40%] bg-slate-900/5 dark:bg-slate-100/5 p-6 md:p-8">
          <div className="h-full card p-6 flex flex-col justify-between">
            <div>
              <div className="text-sm font-semibold">
                Quick Actions
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Use My Exports and My Imports pages to manage
                listings and track activity in one place.
              </p>
            </div>

            <div className="grid gap-2">
              <Link
                to="/products"
                className="btn-outline w-full"
              >
                Browse products
              </Link>
              <Link
                to="/my-exports"
                className="btn-primary w-full"
              >
                Open My Exports
              </Link>
            </div>
          </div>
        </div>

        {/* Hint arrow */}
        <button
          onClick={scrollToNext}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur text-sm"
        >
          Scroll
        </button>
      </section>

      {/* 2) Stats */}
      <section ref={nextSectionRef} className="mt-2">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold">
              Platform Snapshot
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Live overview of products, stock, and ratings
              based on current database records.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div className="card p-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total products
            </div>
            <div className="mt-2 text-2xl font-extrabold">
              {stats.totalProducts}
            </div>
          </div>
          <div className="card p-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total available stock
            </div>
            <div className="mt-2 text-2xl font-extrabold">
              {stats.totalStock}
            </div>
          </div>
          <div className="card p-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Average rating
            </div>
            <div className="mt-2 text-2xl font-extrabold">
              {stats.avgRating.toFixed(1)}
            </div>
          </div>
          <div className="card p-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Origin countries
            </div>
            <div className="mt-2 text-2xl font-extrabold">
              {stats.originCount}
            </div>
          </div>
        </div>
      </section>

      {/* 3) Latest products */}
      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold">
              Latest Products
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Recently added export items you can review and
              import from the details page.
            </p>
          </div>
          <Link to="/products" className="btn-outline">
            View all
          </Link>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : latestProducts.length === 0
            ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                No products found.
              </p>
              )
            : latestProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
        </div>
      </section>

      {/* 4) Top rated */}
      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold">
              Top Rated Exports
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Products with the highest ratings, ideal for
              trusted import decisions.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-4">
          {topRated.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Ratings are not available yet.
            </p>
          ) : (
            topRated.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))
          )}
        </div>
      </section>

      {/* 5) Low stock alert */}
      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold">
              Low Stock Watchlist
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Items with the lowest available quantity so you
              can act before they run out.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {lowStock.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              No low stock items right now.
            </p>
          ) : (
            lowStock.map((p) => (
              <div
                key={p.id}
                className="card p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="font-semibold line-clamp-1">
                    {p.name}
                  </div>
                  <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    Origin: {p.originCountry} • Rating:{" "}
                    {p.rating}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Available
                  </div>
                  <div className="text-lg font-extrabold">
                    {p.availableQty}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 6) Origins overview */}
      <section>
        <h2 className="text-2xl font-extrabold">
          Products by Origin
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          See which countries contribute the most products to
          your catalog.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {originCards.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              No origin data yet.
            </p>
          ) : (
            originCards.map((o) => (
              <div key={o.origin} className="card p-4">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Origin
                </div>
                <div className="mt-1 font-semibold">
                  {o.origin}
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Products
                </div>
                <div className="text-lg font-extrabold">
                  {o.count}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 7) How it works */}
      <section>
        <h2 className="text-2xl font-extrabold">
          How It Works
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          A simple flow from browsing exports to recording
          imports with stock validation.
        </p>

        <ol className="mt-4 grid gap-4 md:grid-cols-4 text-sm">
          <li className="card p-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Step 1
            </div>
            <div className="mt-1 font-semibold">
              Browse products
            </div>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Open the All Products page and filter items by
              origin, rating, or price.
            </p>
          </li>
          <li className="card p-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Step 2
            </div>
            <div className="mt-1 font-semibold">
              View details
            </div>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Check stock, rating, and origin on the product
              details page.
            </p>
          </li>
          <li className="card p-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Step 3
            </div>
            <div className="mt-1 font-semibold">
              Import with limits
            </div>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Choose a quantity that cannot exceed available
              stock, then confirm import.
            </p>
          </li>
          <li className="card p-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Step 4
            </div>
            <div className="mt-1 font-semibold">
              Track activity
            </div>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Review your imports and exports from the
              dedicated pages.
            </p>
          </li>
        </ol>
      </section>

      {/* 8) FAQ */}
      <section>
        <h2 className="text-2xl font-extrabold">FAQ</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Common questions about importing, exporting, and
          access control.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {faqs.map((item) => (
            <div
              key={item.q}
              className="card p-4 text-sm"
            >
              <div className="font-semibold">
                {item.q}
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-300">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 9) Newsletter */}
      <section>
        <div className="card p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold">
              Stay in the loop
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Get occasional updates about new export
              products and feature improvements.
            </p>
          </div>

          <form
            onSubmit={onNewsletterSubmit}
            className="flex w-full md:w-auto flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              name="email"
              className="input"
              placeholder="you@example.com"
              required
            />
            <button
              type="submit"
              className="btn-primary"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
