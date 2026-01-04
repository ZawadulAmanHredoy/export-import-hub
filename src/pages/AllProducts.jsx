// client/src/pages/AllProducts.jsx
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

import { api } from "../lib/api";
import ProductCard from "../components/ProductCard.jsx";
import ProductCardSkeleton from "../components/ProductCardSkeleton.jsx";

function normalizeText(v) {
  return String(v || "").toLowerCase().trim();
}

export default function AllProducts() {
  const [search, setSearch] = useState("");
  const [origin, setOrigin] = useState("all");
  const [minRating, setMinRating] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 12;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["products", search],
    queryFn: async () => {
      const res = await api.get(`/products?search=${encodeURIComponent(search)}`);
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const products = Array.isArray(data) ? data : [];

  const originOptions = useMemo(() => {
    const set = new Set(
      products
        .map((p) => (p?.originCountry ? String(p.originCountry).trim() : ""))
        .filter(Boolean)
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredSorted = useMemo(() => {
    const s = normalizeText(search);

    let list = products;

    // client-side search refinement (server search already exists)
    if (s) {
      list = list.filter((p) => normalizeText(p?.name).includes(s));
    }

    if (origin !== "all") {
      list = list.filter((p) => String(p?.originCountry || "").trim() === origin);
    }

    if (minRating !== "all") {
      const minR = Number(minRating);
      list = list.filter((p) => Number(p?.rating || 0) >= minR);
    }

    const copy = [...list];

    if (sort === "price-asc") copy.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
    if (sort === "price-desc") copy.sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0));
    if (sort === "rating-desc") copy.sort((a, b) => Number(b?.rating || 0) - Number(a?.rating || 0));
    if (sort === "qty-desc") copy.sort((a, b) => Number(b?.availableQty || 0) - Number(a?.availableQty || 0));
    // newest: keep backend order (assumes newest first if your API does that)

    return copy;
  }, [products, search, origin, minRating, sort]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  }, [filteredSorted.length]);

  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredSorted.slice(start, start + PAGE_SIZE);
  }, [filteredSorted, currentPage]);

  const resetPage = () => setPage(1);

  return (
    <div className="container-x py-8">
      <Helmet>
        <title>Products | Import Export Hub</title>
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Explore Products</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Search, filter, and sort export items. Click a card to view details.
          </p>
        </div>

        {(isFetching || isLoading) && (
          <div className="text-sm text-slate-600 dark:text-slate-300">Loading...</div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-6 card p-4 md:p-5 grid gap-4 md:grid-cols-4 items-end">
        <div className="md:col-span-2">
          <label className="text-sm font-semibold">Search</label>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
            className="mt-2 input"
            placeholder="Search by product name"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Origin</label>
          <select
            value={origin}
            onChange={(e) => {
              setOrigin(e.target.value);
              resetPage();
            }}
            className="mt-2 input"
          >
            <option value="all">All</option>
            {originOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold">Min Rating</label>
          <select
            value={minRating}
            onChange={(e) => {
              setMinRating(e.target.value);
              resetPage();
            }}
            className="mt-2 input"
          >
            <option value="all">All</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5</option>
          </select>
        </div>

        <div className="md:col-span-4 grid gap-3 md:grid-cols-3 items-end">
          <div>
            <label className="text-sm font-semibold">Sort</label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                resetPage();
              }}
              className="mt-2 input"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating-desc">Rating: high to low</option>
              <option value="qty-desc">Quantity: high to low</option>
            </select>
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-2 md:justify-end">
            <button
              className="btn-outline"
              onClick={() => {
                setSearch("");
                setOrigin("all");
                setMinRating("all");
                setSort("newest");
                setPage(1);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-stretch">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : pageItems.map((p) => <ProductCard key={p?._id || p?.id} p={p} />)}
      </div>

      {/* Empty state */}
      {!isLoading && filteredSorted.length === 0 && (
        <div className="mt-8 card p-6 text-slate-600 dark:text-slate-300">
          No products found for your current search/filters.
        </div>
      )}

      {/* Pagination */}
      {!isLoading && filteredSorted.length > 0 && (
        <div className="mt-8 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredSorted.length)} of{" "}
            {filteredSorted.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="btn-outline"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>

            <div className="text-sm font-semibold">
              Page {currentPage} / {totalPages}
            </div>

            <button
              className="btn-outline"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
