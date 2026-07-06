export default function Timeline({ items = [] }) {
  if (!items.length) return (
    <div className="text-center py-8 text-[var(--text-secondary)] text-sm">No timeline events found.</div>
  );

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gradient-to-b from-vital-500 via-vital-500/30 to-transparent rounded-full" />

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={item.id ?? i} className="relative flex gap-4 pl-0 animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
            {/* Dot */}
            <div className={`timeline-dot flex-shrink-0 z-10 ${item.color || "bg-vital-light"}`}>
              {item.icon && (
                <span className={item.iconColor || "text-vital-500"}>
                  <item.icon size={16} />
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 card-base mb-0 ml-1 pb-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{item.subtitle}</p>
                  )}
                </div>
                <span className="text-[11px] text-[var(--text-muted)] shrink-0 mt-0.5">{item.date}</span>
              </div>
              {item.description && (
                <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">{item.description}</p>
              )}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.tags.map((tag, ti) => (
                    <span key={ti} className="badge badge-vital">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
