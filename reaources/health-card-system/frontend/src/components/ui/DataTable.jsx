import { useState, useMemo } from "react";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function DataTable({
  columns,
  data,
  searchable = true,
  searchPlaceholder = "Search...",
  pageSize = 10,
  emptyMessage = "No records found",
  actions,
  className = "",
}) {
  const [query, setQuery] = useState("");
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = data || [];
    if (query) {
      const q = query.toLowerCase();
      rows = rows.filter((row) =>
        columns.some((col) => String(row[col.key] ?? "").toLowerCase().includes(q))
      );
    }
    if (sortCol) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortCol] ?? "";
        const bv = b[sortCol] ?? "";
        const cmp = String(av).localeCompare(String(bv));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [data, query, sortCol, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key) => {
    if (sortCol === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(key); setSortDir("asc"); }
    setPage(1);
  };

  const handleSearch = (e) => { setQuery(e.target.value); setPage(1); };

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <ChevronDown size={12} className="opacity-30" />;
    return sortDir === "asc" ? <ChevronUp size={12} className="text-vital-500" /> : <ChevronDown size={12} className="text-vital-500" />;
  };

  return (
    <div className={`card-base p-0 overflow-hidden ${className}`}>
      {searchable && (
        <div className="p-4 border-b" style={{ borderColor: "var(--border-color)" }}>
          <div className="relative max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              value={query}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              className="input-base pl-9 text-sm"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={col.sortable !== false ? () => handleSort(col.key) : undefined}
                  className={col.sortable !== false ? "cursor-pointer select-none" : ""}
                  style={{ textAlign: col.align || "left" }}
                >
                  <div className="flex items-center gap-1" style={{ justifyContent: col.align === "right" ? "flex-end" : "flex-start" }}>
                    {col.label}
                    {col.sortable !== false && <SortIcon col={col.key} />}
                  </div>
                </th>
              ))}
              {actions && <th style={{ textAlign: "right" }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-10 text-[var(--text-secondary)] text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr key={row.id ?? i}>
                  {columns.map((col) => (
                    <td key={col.key} style={{ textAlign: col.align || "left" }}>
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? "—")}
                    </td>
                  ))}
                  {actions && (
                    <td style={{ textAlign: "right" }}>
                      <div className="flex items-center justify-end gap-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t text-sm" style={{ borderColor: "var(--border-color)" }}>
          <span className="text-[var(--text-secondary)]">
            Showing {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(1)} disabled={page === 1} className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]"><ChevronsLeft size={15} /></button>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]"><ChevronLeft size={15} /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return p <= totalPages ? (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${page === p ? "bg-vital-500 text-white" : "hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}
                >
                  {p}
                </button>
              ) : null;
            })}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]"><ChevronRight size={15} /></button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]"><ChevronsRight size={15} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
