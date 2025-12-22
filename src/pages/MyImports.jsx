import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { api } from "../lib/api.js";

export default function MyImports() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["my-imports"],
    queryFn: async () => (await api.get("/imports/my")).data
  });

  const remove = async (importId) => {
    try {
      await api.delete(`/imports/${importId}`);
      toast.success("Removed from My Imports");
      await qc.invalidateQueries({ queryKey: ["my-imports"] });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Remove failed");
    }
  };

  return (
    <div className="container-x py-8">
      <Helmet><title>My Imports | Import Export Hub</title></Helmet>
      <h1 className="text-2xl font-bold">My Imports</h1>

      {isLoading ? (
        <div className="mt-6">Loading...</div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-3 items-stretch">
          {(data || []).map((row) => (
            <div key={row._id} className="card overflow-hidden flex flex-col h-full">
              <img
                src={row.product.imageUrl}
                alt={row.product.name}
                className="h-44 w-full object-cover"
              />
              <div className="p-4 flex-1 flex flex-col">
                <div className="font-bold text-lg line-clamp-1">{row.product.name}</div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Price: ${row.product.price} • Rating: {row.product.rating}
                  <br />
                  Origin: {row.product.originCountry}
                  <br />
                  Imported Quantity: <span className="font-semibold">{row.quantity}</span>
                </div>

                <div className="mt-auto pt-4 flex gap-2">
                  <button onClick={() => remove(row._id)} className="btn-outline flex-1">
                    Remove
                  </button>
                  <Link to={`/products/${row.product._id}`} className="btn-primary flex-1">
                    See Details
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {(data || []).length === 0 && <div className="mt-6">No imports yet.</div>}
        </div>
      )}
    </div>
  );
}
