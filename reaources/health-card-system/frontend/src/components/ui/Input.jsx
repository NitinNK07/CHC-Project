export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink/80">{label}</span>}
      <input
        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-ink placeholder:text-mist outline-none transition-colors focus:border-vital focus:ring-2 focus:ring-vital/15 ${
          error ? "border-coral" : "border-mist-light"
        } ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-coral">{error}</span>}
    </label>
  );
}
