import React, { useEffect, useMemo, useState } from "react";
import Filters from "./components/Filters";
import CompanyTable from "./components/CompanyTable";
import Pagination from "./components/Pagination";
import useDebounce from "./hooks/useDebounce";

export default function App() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  // Sort
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const setSort = (key, dir) => {
    setSortKey(key);
    setSortDir(dir);
  };

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/companies.json");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setCompanies(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const locations = useMemo(
    () => Array.from(new Set(companies.map((c) => c.location))).sort(),
    [companies]
  );

  const industries = useMemo(
    () => Array.from(new Set(companies.map((c) => c.industry))).sort(),
    [companies]
  );

  const filtered = useMemo(() => {
    let rows = companies;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      rows = rows.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (location) rows = rows.filter((c) => c.location === location);
    if (industry) rows = rows.filter((c) => c.industry === industry);

    rows = [...rows].sort((a, b) => {
      const A = a[sortKey],
        B = b[sortKey];
      if (A == null && B == null) return 0;
      if (A == null) return 1;
      if (B == null) return -1;
      if (typeof A === "number" && typeof B === "number") {
        return sortDir === "asc" ? A - B : B - A;
      }
      const aStr = String(A).toLowerCase();
      const bStr = String(B).toLowerCase();
      if (aStr < bStr) return sortDir === "asc" ? -1 : 1;
      if (aStr > bStr) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [companies, debouncedSearch, location, industry, sortKey, sortDir]);

  const paged = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, location, industry, perPage]);

  const reset = () => {
    setSearch("");
    setLocation("");
    setIndustry("");
    setPerPage(10);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">🏢 Companies Directory</h1>
        <div className="text-sm text-slate-400">
          {loading ? "Loading…" : `${filtered.length} results`}
          {error && <span className="text-rose-300"> · {error}</span>}
        </div>
      </div>

      <Filters
        search={search}
        setSearch={setSearch}
        location={location}
        setLocation={setLocation}
        industry={industry}
        setIndustry={setIndustry}
        perPage={perPage}
        setPerPage={setPerPage}
        locations={locations}
        industries={industries}
        onReset={reset}
      />

      {loading ? (
        <div className="card p-4" role="status" aria-live="polite">
          Fetching company data…
        </div>
      ) : error ? (
        <div className="card p-4 text-rose-200" role="alert">
          Something went wrong: {error}
        </div>
      ) : (
        <>
          <CompanyTable
            data={paged}
            sortKey={sortKey}
            sortDir={sortDir}
            setSort={setSort}
          />
          <Pagination
            page={page}
            totalPages={Math.max(1, Math.ceil(filtered.length / perPage))}
            setPage={setPage}
          />
        </>
      )}
    </div>
  );
}
