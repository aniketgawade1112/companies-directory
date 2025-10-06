import React from "react";

export default function Pagination({ page, totalPages, setPage }) {
  const pages = [];
  const maxToShow = 7;
  const start = Math.max(1, page - 3);
  const end = Math.min(totalPages, start + maxToShow - 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (totalPages <= 1) return null;

  return (
    <div className="mt-3 flex items-center justify-between gap-2">
      <div className="text-sm text-slate-400">
        Page {page} of {totalPages}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button
          className="page-btn"
          disabled={page === 1}
          onClick={() => setPage(1)}
        >
          &laquo;
        </button>
        <button
          className="page-btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          &lsaquo;
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`page-btn ${p === page ? "page-btn-active" : ""}`}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        ))}
        <button
          className="page-btn"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          &rsaquo;
        </button>
        <button
          className="page-btn"
          disabled={page === totalPages}
          onClick={() => setPage(totalPages)}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}
