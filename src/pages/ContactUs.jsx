// client/src/pages/ContactUs.jsx
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";

export default function ContactUs() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const message = String(form.get("message") || "").trim();

    if (!name) return toast.error("Name is required");
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return toast.error("Valid email is required");
    if (message.length < 10) return toast.error("Message must be at least 10 characters");

    setLoading(true);
    try {
      // UI-only success flow (no backend endpoint specified yet)
      await new Promise((r) => setTimeout(r, 700));
      setSent(true);
      e.currentTarget.reset();
      toast.success("Message sent");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-x py-10">
      <Helmet>
        <title>Contact | Import Export Hub</title>
      </Helmet>

      <div className="grid gap-6 md:grid-cols-2 items-start">
        <div className="card p-6 md:p-10">
          <h1 className="text-3xl font-extrabold">Contact</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Use this form for questions, feedback, or support related to exports, imports, and inventory tracking.
          </p>

          <div className="mt-6 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Email:</span>{" "}
              walton@example.com
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Location:</span>{" "}
              Dhaka, Bangladesh
            </div>
          </div>
        </div>

        <div className="card p-6 md:p-10">
          <h2 className="text-xl font-bold">Send a message</h2>

          {sent && (
            <div className="mt-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900">
              Your message was recorded successfully. You can send another message anytime.
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-5 grid gap-4">
            <div>
              <label className="text-sm font-semibold">Name</label>
              <input name="name" className="mt-2 input" placeholder="Your name" />
            </div>

            <div>
              <label className="text-sm font-semibold">Email</label>
              <input name="email" className="mt-2 input" placeholder="you@email.com" />
            </div>

            <div>
              <label className="text-sm font-semibold">Message</label>
              <textarea
                name="message"
                className="mt-2 input min-h-[120px]"
                placeholder="Write your message (minimum 10 characters)"
              />
            </div>

            <button disabled={loading} className="btn-primary">
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
