import React from "react";

export default function CompanyTable({ data, sortKey, sortDir, setSort }) {
  const headers = [
    { key: "name", label: "Company" },
    { key: "industry", label: "Industry" },
    { key: "location", label: "Location" },
    { key: "employees", label: "Employees" },
    { key: "founded", label: "Founded" },
    { key: "website", label: "Website" },
  ];

  const onSort = (key) => {
    if (sortKey === key) setSort(key, sortDir === "asc" ? "desc" : "asc");
    else setSort(key, "asc");
  };
  const sortIcon = (key) =>
    sortKey !== key ? "↕" : sortDir === "asc" ? "↑" : "↓";

  return (
    <div className="card overflow-auto">
      <table className="min-w-[720px] w-full border-collapse">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h.key} className="table-th px-4 py-3 text-left">
                <button
                  className={`inline-flex items-center gap-2 text-xs ${
                    sortKey === h.key ? "text-slate-200" : ""
                  }`}
                  onClick={() => onSort(h.key)}
                  aria-label={`Sort by ${h.label}`}
                >
                  {h.label}{" "}
                  <span className="opacity-70">{sortIcon(h.key)}</span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((c, idx) => (
            <tr key={c.id ?? idx} className="hover:bg-white/5">
              <td className="px-4 py-3 align-top">
                <div className="font-semibold">{c.name}</div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {c.tags?.map((t) => (
                    <span key={t} className="badge">
                      {t}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 align-top">
                <span className="tag">{c.industry}</span>
              </td>
              <td className="px-4 py-3 align-top">{c.location}</td>
              <td className="px-4 py-3 align-top">
                {c.employees?.toLocaleString?.() ?? "-"}
              </td>
              <td className="px-4 py-3 align-top">{c.founded ?? "-"}</td>
              <td className="px-4 py-3 align-top">
                {c.website ? (
                  <a
                    className="text-cyan-300 hover:underline"
                    href={c.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {c.website.replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
