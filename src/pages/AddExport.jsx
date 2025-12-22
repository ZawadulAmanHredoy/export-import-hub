import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { api } from "../lib/api.js";

export default function AddExport() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (values) => {
    try {
      await api.post("/products", {
        name: values.name,
        imageUrl: values.imageUrl,
        price: Number(values.price),
        originCountry: values.originCountry,
        rating: Number(values.rating),
        availableQty: Number(values.availableQty)
      });
      toast.success("Export added");
      reset();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Add failed");
    }
  };

  return (
    <div className="container-x py-8 max-w-3xl">
      <Helmet><title>Add Export | Import Export Hub</title></Helmet>
      <h1 className="text-2xl font-bold">Add Export / Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 card p-6 grid gap-4">
        <Field label="Product Name" error={errors.name?.message}>
          <input className="input" {...register("name", { required: "Product name is required" })} />
        </Field>

        <Field label="Product Image URL" error={errors.imageUrl?.message}>
          <input className="input" {...register("imageUrl", { required: "Image URL is required" })} />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Price" error={errors.price?.message}>
            <input type="number" step="0.01" className="input" {...register("price", { required: "Price is required" })} />
          </Field>

          <Field label="Origin Country" error={errors.originCountry?.message}>
            <input className="input" {...register("originCountry", { required: "Origin country is required" })} />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Rating" error={errors.rating?.message}>
            <input type="number" step="0.1" className="input" {...register("rating", { required: "Rating is required" })} />
          </Field>

          <Field label="Available Quantity" error={errors.availableQty?.message}>
            <input type="number" className="input" {...register("availableQty", { required: "Available quantity is required" })} />
          </Field>
        </div>

        <button className="btn-primary mt-2">Add Export/Product</button>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
