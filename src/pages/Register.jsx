import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../providers/AuthProvider.jsx";

function validatePassword(pw) {
  if (pw.length < 6) return "Password must be at least 6 characters.";
  if (!/[A-Z]/.test(pw)) return "Password must include an uppercase letter.";
  if (!/[a-z]/.test(pw)) return "Password must include a lowercase letter.";
  return null;
}

export default function Register() {
  const { register: signup, loginWithGoogle } = useAuth();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async ({ name, email, photoURL, password }) => {
    const err = validatePassword(password);
    if (err) return toast.error(err);

    setLoading(true);
    try {
      await signup({ name, email, photoURL, password });
      toast.success("Registered successfully");
      navigate("/");
    } catch (e) {
      toast.error(e?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Registered with Google");
      navigate("/");
    } catch {
      toast.error("Google auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-x py-10 max-w-md">
      <Helmet><title>Register | Import Export Hub</title></Helmet>
      <h1 className="text-2xl font-bold">Register</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 card p-6 grid gap-4">
        <div>
          <label className="text-sm">Name</label>
          <input className="mt-2 input" {...register("name", { required: true })} />
        </div>

        <div>
          <label className="text-sm">Email</label>
          <input className="mt-2 input" {...register("email", { required: true })} />
        </div>

        <div>
          <label className="text-sm">Photo URL</label>
          <input className="mt-2 input" {...register("photoURL", { required: true })} />
        </div>

        <div>
          <label className="text-sm">Password</label>
          <input type="password" className="mt-2 input" {...register("password", { required: true })} />
        </div>

        <button disabled={loading} className="btn-primary">
          {loading ? "Working..." : "Register"}
        </button>

        <button type="button" onClick={google} disabled={loading} className="btn-outline">
          Continue with Google
        </button>

        <div className="text-sm text-slate-600 dark:text-slate-300">
          Already have an account? <Link className="underline" to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
