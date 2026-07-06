import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({ title, subtitle, children, wide = false }) {
  return (
    <div className="flex min-h-screen bg-paper">
      <div className="hidden w-[38%] flex-col justify-between bg-card-gradient p-10 text-white lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
            <ShieldCheck size={18} />
          </div>
          <span className="font-display text-lg font-semibold">HealthCard</span>
        </Link>
        <div>
          <p className="font-display text-3xl font-bold leading-tight">
            Only your trust<br />unlocks your record.
          </p>
          <p className="mt-4 max-w-sm text-sm text-white/70">
            Every patient record is gated by a two-part health card credential
            and every access attempt is logged — visible to you, always.
          </p>
        </div>
        <p className="text-xs text-white/40">© {new Date().getFullYear()} Centralized Health Card System</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className={`w-full ${wide ? "max-w-xl" : "max-w-sm"}`}>
          <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-ink/60">{subtitle}</p>}
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}
