export default function GlassCard({ children, className = "", onClick, hover = false, glow = false }) {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-5 ${hover ? "card-hover cursor-pointer" : ""} ${glow ? "shadow-glow" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
