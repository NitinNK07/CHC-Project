import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck, Stethoscope, FlaskConical, UserRound, QrCode,
  FileText, CalendarCheck, BellRing, ArrowRight, Lock, Heart,
  Activity, Globe, Moon, Sun, ChevronDown, Star, Zap, CheckCircle2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useLang } from "../context/LanguageContext";

const LANG_OPTIONS = [
  { code: "en", label: "EN", flag: "🇺🇸", full: "English" },
  { code: "hi", label: "हिं", flag: "🇮🇳", full: "हिन्दी" },
  { code: "mr", label: "मर", flag: "🫁", full: "मराठी" },
];

const STATS = [
  { value: "50K+", label: "Patients Registered" },
  { value: "2,400+", label: "Verified Doctors" },
  { value: "150+", label: "Hospitals" },
  { value: "1M+", label: "Records Secured" },
];

const FEATURES = [
  { icon: Lock, title: "Two-factor card access", desc: "A health card number alone can't unlock anything — the secret card ID is required too.", color: "from-vital-500 to-vital-600" },
  { icon: QrCode, title: "QR-ready health card", desc: "Every card ships with a scannable QR code for fast check-in at any clinic.", color: "from-medical-blue to-blue-700" },
  { icon: FileText, title: "Unified records", desc: "Prescriptions, lab reports and visit history live in one place.", color: "from-gold to-gold-dark" },
  { icon: CalendarCheck, title: "Appointment management", desc: "Patients book directly with verified doctors; doctors manage from their dashboard.", color: "from-medical-green to-green-700" },
  { icon: Activity, title: "AI health insights", desc: "AI-powered symptom checker and health risk assessment tools.", color: "from-medical-purple to-purple-700" },
  { icon: BellRing, title: "Real-time notifications", desc: "Instant alerts for prescriptions, lab results and appointments.", color: "from-coral to-coral-dark" },
];

const ROLES = [
  {
    title: "Patient",
    icon: UserRound,
    desc: "Access your complete digital health record, download your health card, view prescriptions, lab reports, and track your health timeline.",
    to: "/register/patient",
    gradient: "from-vital-500 to-vital-600",
    light: "bg-vital-light",
    items: ["Digital Health Card with QR", "Medical History Timeline", "Lab Reports & Prescriptions", "Appointment Booking"],
  },
  {
    title: "Doctor",
    icon: Stethoscope,
    desc: "Look up patient histories using their health card, issue digital prescriptions, manage appointments, and track diagnoses securely.",
    to: "/register/doctor",
    gradient: "from-gold to-gold-dark",
    light: "bg-gold-light",
    items: ["Instant Patient History", "Digital Prescriptions", "Appointment Management", "Disease Tracking"],
  },
  {
    title: "Pathologist",
    icon: FlaskConical,
    desc: "Receive lab test requests, upload reports digitally, track report status, and deliver results directly to the patient's record.",
    to: "/register/pathologist",
    gradient: "from-coral to-coral-dark",
    light: "bg-coral-light",
    items: ["Upload PDF/Image Reports", "Lab Queue Management", "Digital Verification", "Report Status Tracking"],
  },
];

export default function LandingPage() {
  const { isDark, toggleTheme } = useTheme();
  const { lang, switchLang, t } = useLang();
  const [showLang, setShowLang] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-card-strong border-b border-[var(--border-color)] px-4 py-3">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-vital-500 to-vital-600 shadow-glow">
              <Heart size={18} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-[var(--text-primary)] text-base">HealthCard</span>
              <span className="hidden sm:inline text-[var(--text-secondary)] text-xs ml-1">System</span>
            </div>
          </Link>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLang((v) => !v)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors border border-[var(--border-color)]"
              >
                <Globe size={13} />
                {LANG_OPTIONS.find((l) => l.code === lang)?.label}
                <ChevronDown size={10} />
              </button>
              {showLang && (
                <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-lg z-50 overflow-hidden animate-scale-in">
                  {LANG_OPTIONS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { switchLang(l.code); setShowLang(false); }}
                      className={`flex items-center gap-2 w-full px-3 py-2.5 text-sm transition-colors hover:bg-[var(--bg-primary)] ${lang === l.code ? "text-vital-500 font-semibold" : "text-[var(--text-primary)]"}`}
                    >
                      <span>{l.flag}</span> {l.full}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark mode */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color)] transition-colors"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <Link to="/login" className="hidden sm:block text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-1.5 transition-colors">
              {t("login")}
            </Link>
            <Link
              to="/register"
              className="btn-primary px-4 py-2 text-sm rounded-xl shadow-none"
            >
              {t("register")}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-mesh pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-vital-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-medical-blue/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-vital-500/30 bg-vital-light px-3 py-1.5 text-xs font-semibold text-vital-dark mb-6">
                <Zap size={12} className="text-vital-500" />
                Enterprise Healthcare Platform
              </div>

              <h1 className="font-display text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight mb-4">
                {t("tagline").split(".")[0]}.
                <br />
                <span className="gradient-text">Every hospital.</span>
                <br />
                Always yours.
              </h1>

              <p className="text-[var(--text-secondary)] text-base leading-relaxed mb-8 max-w-md">
                A centralized digital health card system connecting patients, doctors, and pathologists.
                Secure, verified, and always accessible.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Link to="/register/patient" className="btn-primary px-6 py-3 text-sm flex items-center gap-2">
                  I'm a Patient <ArrowRight size={15} />
                </Link>
                <Link to="/register/doctor" className="btn-secondary px-6 py-3 text-sm flex items-center gap-2">
                  I'm a Doctor
                </Link>
                <Link to="/register/pathologist" className="btn-secondary px-6 py-3 text-sm flex items-center gap-2">
                  I'm a Pathologist
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["P","D","M","A"].map((l, i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-[var(--card-bg)] bg-gradient-to-br from-vital-500 to-vital-600 flex items-center justify-center text-xs font-bold text-white">
                      {l}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  <strong className="text-[var(--text-primary)]">50,000+</strong> patients trust HealthCard
                </p>
              </div>
            </div>

            {/* Health Card Preview */}
            <div className="relative animate-float lg:block hidden">
              <div className="health-card max-w-sm mx-auto">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/50">🏥 Centralized Health Card</p>
                    <div className="verified-seal mt-1">
                      <ShieldCheck size={10} />
                      Digitally Verified
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-2">
                    <QrCode size={36} className="text-ink" />
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-white/15 flex items-center justify-center font-bold text-white font-display text-lg">A</div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Patient</p>
                    <p className="font-display font-bold text-white">Aanya Sharma</p>
                  </div>
                </div>

                <p className="text-[10px] text-white/40 uppercase tracking-widest">Health Card Number</p>
                <p className="font-mono-card text-white font-semibold tracking-wider mt-0.5">HC-7F3K-9D21-XQ4P</p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="blood-group-badge">B+</span>
                  <span className="badge bg-white/10 text-white/80">ACTIVE</span>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -bottom-4 -left-8 glass-card rounded-xl px-4 py-2.5 shadow-glass animate-fade-in hidden lg:block">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-vital-500" />
                  <span className="text-xs font-semibold text-[var(--text-primary)]">License Verified</span>
                </div>
              </div>

              <div className="absolute -top-2 -right-6 glass-card rounded-xl px-4 py-2.5 shadow-glass animate-fade-in hidden lg:block">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-gold fill-gold" />
                  <span className="text-xs font-semibold text-[var(--text-primary)]">4.9 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-10 border-y border-[var(--border-color)]" style={{ background: "var(--card-bg)" }}>
        <div className="mx-auto max-w-5xl px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-3xl font-bold gradient-text">{s.value}</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-3">
              Built for three kinds of people
            </h2>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
              One system, three focused experiences — each with exactly the tools that role needs.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {ROLES.map((role) => (
              <Link
                key={role.title}
                to={role.to}
                className="group card-base card-hover block p-0 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${role.gradient}`} />
                <div className="p-6">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform`}>
                    <role.icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-2">{role.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{role.desc}</p>
                  <ul className="space-y-1.5 mb-5">
                    {role.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <CheckCircle2 size={13} className="text-vital-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-vital-500 group-hover:gap-3 transition-all">
                    Get started <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4" style={{ background: "var(--card-bg)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-3">
              Everything a real health system needs
            </h2>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
              Enterprise-grade features designed for the Indian healthcare ecosystem.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="card-base card-hover group">
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon size={20} className="text-white" />
                </div>
                <h4 className="font-display font-semibold text-[var(--text-primary)] mb-2">{f.title}</h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl p-10 text-center" style={{ background: "var(--gradient-primary)" }}>
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold text-white mb-3">
                Ready to take control of your health?
              </h2>
              <p className="text-white/70 mb-8 max-w-md mx-auto">
                Join thousands of patients, doctors, and pathologists on India's most secure health card platform.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/register/patient" className="px-6 py-3 bg-white text-ink font-semibold rounded-xl hover:bg-white/90 transition-colors text-sm flex items-center gap-2">
                  Create Free Account <ArrowRight size={15} />
                </Link>
                <Link to="/login" className="px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-sm">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-8" style={{ background: "var(--card-bg)" }}>
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-vital-500 to-vital-600 flex items-center justify-center">
                <Heart size={14} className="text-white" />
              </div>
              <span className="font-display font-semibold text-sm text-[var(--text-primary)]">HealthCard System</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              © 2024 Centralized Health Card System. Enterprise Healthcare Platform.
            </p>
            <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
              <Link to="/login" className="hover:text-vital-500 transition-colors">Login</Link>
              <span>·</span>
              <Link to="/register" className="hover:text-vital-500 transition-colors">Register</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
