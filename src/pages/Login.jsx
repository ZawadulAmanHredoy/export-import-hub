import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../providers/AuthProvider.jsx";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Logged in");
      navigate(from, { replace: true });
    } catch (e) {
      toast.error(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Logged in with Google");
      navigate(from, { replace: true });
    } catch {
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPasswordUI = () => {
    toast("Forget password is not required for this assignment.", { icon: "ℹ️" });
  };

  return (
    <div className="container-x py-10 max-w-md">
      <Helmet><title>Login | Import Export Hub</title></Helmet>
      <h1 className="text-2xl font-bold">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 card p-6 grid gap-4">
        <div>
          <label className="text-sm">Email</label>
          <input className="mt-2 input" {...register("email", { required: true })} />
        </div>

        <div>
          <label className="text-sm">Password</label>
          <input type="password" className="mt-2 input" {...register("password", { required: true })} />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleForgetPasswordUI}
            className="text-sm underline text-slate-600 dark:text-slate-300"
          >
            Forget Password?
          </button>

          <Link className="text-sm underline" to="/register">
            Register
          </Link>
        </div>

        <button disabled={loading} className="btn-primary">
          {loading ? "Working..." : "Login"}
        </button>

        <button type="button" onClick={google} disabled={loading} className="btn-outline">
          Continue with Google
        </button>
      </form>
    </div>
  );
}
