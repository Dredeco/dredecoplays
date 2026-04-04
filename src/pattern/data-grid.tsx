"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Table as TanTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

export type DataGridProps<T> = {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  estimateRowHeight?: number;
};

export function DataGrid<T>({
  data,
  columns,
  estimateRowHeight = 40,
}: DataGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: 8,
  });

  return (
    <div
      ref={parentRef}
      className="max-h-[min(70vh,560px)] overflow-auto rounded-lg border border-border"
    >
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-[1] bg-surface">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  className="border-b border-border px-3 py-2 text-left font-semibold text-foreground"
                >
                  {h.isPlaceholder
                    ? null
                    : flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((vRow) => {
            const row = rows[vRow.index];
            return (
              <tr
                key={row.id}
                data-index={vRow.index}
                ref={(el) => {
                  if (el) virtualizer.measureElement(el);
                }}
                className="border-b border-border/60 hover:bg-surface/50"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${vRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2 align-middle text-foreground">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export type { TanTable };
