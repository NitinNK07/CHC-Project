import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const accentConfig = {
  vital: {
    bg: "from-vital-500 to-vital-600",
    light: "bg-vital-light",
    text: "text-vital-dark",
    ring: "ring-vital-500/20",
  },
  gold: {
    bg: "from-gold to-gold-dark",
    light: "bg-gold-light",
    text: "text-gold-dark",
    ring: "ring-gold/20",
  },
  coral: {
    bg: "from-coral to-coral-dark",
    light: "bg-coral-light",
    text: "text-coral-dark",
    ring: "ring-coral/20",
  },
  ink: {
    bg: "from-ink to-ink-light",
    light: "bg-mist-light",
    text: "text-ink",
    ring: "ring-ink/10",
  },
  blue: {
    bg: "from-medical-blue to-blue-700",
    light: "bg-medical-blue-light",
    text: "text-medical-blue",
    ring: "ring-blue-500/20",
  },
  green: {
    bg: "from-medical-green to-green-700",
    light: "bg-medical-green-light",
    text: "text-medical-green",
    ring: "ring-green-500/20",
  },
  purple: {
    bg: "from-medical-purple to-purple-800",
    light: "bg-medical-purple-light",
    text: "text-medical-purple",
    ring: "ring-purple-500/20",
  },
};

export default function StatCard({ icon: Icon, label, value, accent = "vital", trend, trendLabel, subtitle }) {
  const cfg = accentConfig[accent] || accentConfig.vital;

  return (
    <div className={`card-base card-hover ring-1 ${cfg.ring}`}>
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${cfg.bg} shadow-md`}>
          {Icon && <Icon size={20} className="text-white" />}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
            trend > 0 ? "text-medical-green bg-medical-green-light" :
            trend < 0 ? "text-coral bg-coral-light" :
            "text-mist bg-mist-light"
          }`}>
            {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold font-display text-[var(--text-primary)] stat-card-value">
          {value ?? "—"}
        </p>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5 font-medium">{label}</p>
        {(subtitle || trendLabel) && (
          <p className="text-xs text-[var(--text-muted)] mt-1">{subtitle || trendLabel}</p>
        )}
      </div>
    </div>
  );
}
