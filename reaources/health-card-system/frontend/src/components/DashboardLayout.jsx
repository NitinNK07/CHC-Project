import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, HeartPulse, Menu, X, Sun, Moon, Globe, Bell, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLang } from "../context/LanguageContext";
import { useNotifications } from "../context/NotificationContext";

const LANG_OPTIONS = [
  { code: "en", label: "EN", full: "English" },
  { code: "hi", label: "हिं", full: "हिन्दी" },
  { code: "mr", label: "मर", full: "मराठी" },
];

function Avatar({ name, size = "sm" }) {
  const initials = (name || "U")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const sizeClass = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";
  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-vital-500 to-medical-blue flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {initials}
    </div>
  );
}

function NotificationDropdown({ onClose }) {
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications() || {};
  const { t } = useLang();

  return (
    <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-lg z-50 overflow-hidden animate-scale-in">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] px-4 py-3">
        <span className="font-semibold text-sm text-[var(--text-primary)]">{t("notifications")}</span>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs text-vital-500 hover:underline font-medium">
            {t("markAllRead")}
          </button>
        )}
      </div>
      <div className="max-h-72 overflow-y-auto">
        {(!notifications || notifications.length === 0) ? (
          <div className="px-4 py-6 text-center text-sm text-[var(--text-secondary)]">
            🔔 {t("notifNoNotifications")}
          </div>
        ) : (
          notifications.slice(0, 8).map((n) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`notification-item border-l-2 ${n.read ? "border-transparent" : "border-vital-500"}`}
            >
              <p className="text-sm font-medium text-[var(--text-primary)]">{n.message}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ""}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function DashboardLayout({ navItems, children, title }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { lang, switchLang, t } = useLang();
  const { unreadCount, fetchNotifications } = useNotifications() || {};
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const notifRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    fetchNotifications?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (langRef.current && !langRef.current.contains(e.target)) setShowLang(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Group nav items by section
  const grouped = navItems.reduce((acc, item) => {
    const section = item.section || "main";
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--sidebar-bg)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-vital-500 to-vital-700 shadow-glow">
            <HeartPulse size={18} className="text-white" />
          </div>
          <div>
            <p className="font-display text-sm font-bold text-white leading-tight tracking-tight">{t("appName")}</p>
            <p className="text-[10px] text-white/40 leading-tight">{t("centralizedSystem")}</p>
          </div>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-white/8">
          <div className="flex items-center gap-2.5 rounded-xl p-2">
            <Avatar name={user?.fullName} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
              <p className="text-[11px] text-white/40 truncate capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section}>
              {section !== "main" && (
                <p className="sidebar-section-label">{section}</p>
              )}
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `sidebar-nav-item ${isActive ? "active" : ""}`
                  }
                >
                  <item.icon size={17} />
                  <span>{t(item.labelKey) || item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] bg-coral text-white rounded-full px-1.5 py-0.5 font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-white/8 p-3">
          <button
            onClick={handleLogout}
            className="sidebar-nav-item w-full hover:!bg-red-500/15 hover:!text-red-400"
          >
            <LogOut size={17} />
            <span>{t("logout")}</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 border-b"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--border-color)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Left: Mobile menu + title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"
            >
              <Menu size={20} />
            </button>
            {title && (
              <h1 className="font-display font-semibold text-[var(--text-primary)] text-base hidden sm:block">
                {title}
              </h1>
            )}
            <Link to="/" className="lg:hidden font-display font-bold text-[var(--text-primary)]">
              {t("appName")}
            </Link>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
              title={isDark ? t("lightMode") : t("darkMode")}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Language switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setShowLang((v) => !v)}
                className="flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
              >
                <Globe size={15} />
                <span>{LANG_OPTIONS.find((l) => l.code === lang)?.label}</span>
                <ChevronDown size={12} />
              </button>
              {showLang && (
                <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-lg z-50 overflow-hidden animate-scale-in">
                  {LANG_OPTIONS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { switchLang(l.code); setShowLang(false); }}
                      className={`flex items-center gap-2 w-full px-3 py-2.5 text-sm transition-colors hover:bg-[var(--bg-primary)] ${
                        lang === l.code ? "text-vital-500 font-semibold" : "text-[var(--text-primary)]"
                      }`}
                    >
                      <span className="text-base">{l.code === "en" ? "🇺🇸" : l.code === "hi" ? "🇮🇳" : "🫁"}</span>
                      {l.full}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif((v) => !v)}
                className="relative rounded-xl p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-coral text-white text-[10px] font-bold flex items-center justify-center px-1 animate-ping-slow">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {showNotif && <NotificationDropdown onClose={() => setShowNotif(false)} />}
            </div>

            {/* Avatar */}
            <Avatar name={user?.fullName} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 page-enter overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
