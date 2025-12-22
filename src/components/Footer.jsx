function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M18.9 2H22l-6.8 7.8L23 22h-6.7l-5.2-6.7L5.2 22H2l7.4-8.5L1 2h6.8l4.7 6.1L18.9 2Zm-1.2 18h1.7L6.2 3.9H4.4L17.7 20Z"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-10">
      <div className="container-x py-8 grid gap-4 md:grid-cols-3">
        <div>
          <div className="font-bold">Import Export Hub</div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            Manage exports, browse global products, and import any product with one click.
          </p>
        </div>

        <div>
          <div className="font-bold">Contact</div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            Email: support@importexporthub.com
            <br />
            Phone: +880-000-000-000
          </p>
        </div>

        <div>
          <div className="font-bold">Social</div>
          <div className="text-sm text-slate-600 dark:text-slate-300 mt-2 flex gap-3 items-center">
            <a className="underline inline-flex items-center gap-2" href="#" aria-label="X">
              <XIcon /> X
            </a>
            <a className="underline" href="#" aria-label="Facebook">Facebook</a>
            <a className="underline" href="#" aria-label="LinkedIn">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="container-x py-4 text-xs text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} Import Export Hub. All rights reserved.
      </div>
    </footer>
  );
}
