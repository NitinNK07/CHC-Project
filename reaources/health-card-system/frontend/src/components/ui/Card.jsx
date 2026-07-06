export default function Card({ children, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`card-base ${onClick ? "card-interactive" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
