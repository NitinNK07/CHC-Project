const palettes = {
  vital: "bg-vital-light text-vital-dark",
  coral: "bg-coral-light text-coral",
  gold: "bg-gold/15 text-gold",
  mist: "bg-mist-light text-ink/70",
  ink: "bg-ink/10 text-ink",
};

export default function Badge({ children, color = "mist", className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${palettes[color]} ${className}`}>
      {children}
    </span>
  );
}
