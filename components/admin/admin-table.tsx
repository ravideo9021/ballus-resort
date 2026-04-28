import Link from "next/link";
import { ReactNode } from "react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string | number;
  getRowHref?: (row: T) => string;
  empty?: string;
}

export function AdminTable<T>({
  columns,
  rows,
  getRowKey,
  getRowHref,
  empty = "No items yet.",
}: AdminTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="bg-white border border-[#0B1B22]/10 p-16 text-center">
        <p className="text-[#0B1B22]/50 text-sm">{empty}</p>
      </div>
    );
  }
  return (
    <div className="bg-white border border-[#0B1B22]/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#0B1B22]/5">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-[#0B1B22]/60 font-semibold ${c.className ?? ""}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const href = getRowHref?.(row);
              const rowCells = columns.map((c) => (
                <td key={c.key} className={`px-6 py-4 text-[#0B1B22]/80 ${c.className ?? ""}`}>
                  {c.render ? c.render(row) : ((row as Record<string, unknown>)[c.key] as ReactNode)}
                </td>
              ));
              if (href) {
                return (
                  <tr
                    key={getRowKey(row)}
                    className="border-t border-[#0B1B22]/5 hover:bg-[#C9A24B]/5 transition-colors cursor-pointer"
                  >
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={`px-6 py-4 text-[#0B1B22]/80 ${c.className ?? ""}`}
                      >
                        <Link
                          href={href}
                          className="block -mx-6 -my-4 px-6 py-4"
                        >
                          {c.render ? c.render(row) : ((row as Record<string, unknown>)[c.key] as ReactNode)}
                        </Link>
                      </td>
                    ))}
                  </tr>
                );
              }
              return (
                <tr key={getRowKey(row)} className="border-t border-[#0B1B22]/5">
                  {rowCells}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
