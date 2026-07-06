export function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

export function formatCurrency(value) {
  if (value === null || value === undefined) return "—";
  return "₹" + Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const statusColors = {
  PENDING: "gold",
  CONFIRMED: "vital",
  COMPLETED: "vital",
  CANCELLED: "coral",
  REJECTED: "coral",
  REQUESTED: "gold",
  SAMPLE_COLLECTED: "ink",
  IN_PROGRESS: "ink",
  PAID: "vital",
  ACTIVE: "vital",
  BLOCKED: "coral",
  EXPIRED: "coral",
};
