export default function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-mist-light bg-white/50 py-16 text-center">
      {Icon && <Icon className="mb-2 h-10 w-10 text-mist" strokeWidth={1.5} />}
      <p className="font-display text-base font-semibold text-ink">{title}</p>
      {subtitle && <p className="max-w-sm text-sm text-mist">{subtitle}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
