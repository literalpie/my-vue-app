import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getSortedRowModel,
  SortingState,
  OnChangeFn,
  Row,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import React from "react";

import { useState } from "react";

export const ReusableTable = <T,>({
  data,
  columns,
  sorting,
  onSortingChange,
}: {
  data: T[];
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
}) => {
  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    data,
    columns,
  });
  const [state, setState] = useState({
    ...table.initialState,
    sorting: sorting ?? table.initialState.sorting,
    // other passed-in state
  });
  /** The current state of the table, including state that comes from props */
  const mergedState = {
    ...table.getState(),
    sorting: sorting ?? state.sorting ?? table.initialState.sorting,
  };

  table.setOptions((prev) => ({
    ...prev,
    state: mergedState,
    onStateChange: (stateChange) => {
      const newState =
        typeof stateChange === "function"
          ? stateChange(mergedState)
          : stateChange;
      onSortingChange?.(newState.sorting);
      setState(newState);
    },
  }));
  const { rows } = table.getRowModel();

  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    estimateSize: () => 45,
    getScrollElement: () => parentRef.current,
  });
  return (
    <div ref={parentRef} style={{ height: "200px", overflow: "auto" }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={() =>
                      table.setSorting((prevSort) => [
                        {
                          id: header.id,
                          desc:
                            prevSort?.[0]?.id === header.id &&
                            !prevSort?.[0]?.desc,
                        },
                      ])
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {virtualizer.getVirtualItems().map((virtualRow, index) => {
              const row = rows[virtualRow.index] as Row<T>;

              return (
                <tr
                  key={row.id}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${
                      virtualRow.start - index * virtualRow.size
                    }px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
