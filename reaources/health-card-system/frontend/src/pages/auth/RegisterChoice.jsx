import { Link } from "react-router-dom";
import { UserRound, Stethoscope, FlaskConical, ArrowRight, ShieldCheck } from "lucide-react";

const options = [
  { title: "Patient", icon: UserRound, desc: "Get your digital health card instantly.", to: "/register/patient" },
  { title: "Doctor", icon: Stethoscope, desc: "Register with your medical license for admin verification.", to: "/register/doctor" },
  { title: "Pathologist", icon: FlaskConical, desc: "Register your lab license for admin verification.", to: "/register/pathologist" },
];

export default function RegisterChoice() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-12">
      <Link to="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-white">
          <ShieldCheck size={18} />
        </div>
        <span className="font-display text-lg font-semibold text-ink">HealthCard</span>
      </Link>
      <h1 className="font-display text-2xl font-bold text-ink">How will you use the system?</h1>
      <p className="mt-1.5 text-sm text-ink/60">Choose the account type that fits you.</p>

      <div className="mt-9 grid w-full max-w-3xl gap-5 sm:grid-cols-3">
        {options.map((o) => (
          <Link
            key={o.title}
            to={o.to}
            className="group rounded-2xl border border-mist-light bg-white p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-vital-light text-vital-dark">
              <o.icon size={22} />
            </div>
            <h3 className="mt-4 font-display font-semibold text-ink">{o.title}</h3>
            <p className="mt-1 text-xs text-ink/60">{o.desc}</p>
            <span className="mt-3 flex items-center justify-center gap-1 text-sm font-semibold text-vital">
              Continue <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-ink/60">
        Already have an account? <Link to="/login" className="font-semibold text-vital">Log in</Link>
      </p>
    </div>
  );
}
