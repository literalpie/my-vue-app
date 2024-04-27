import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getSortedRowModel,
  SortingState,
  OnChangeFn,
} from "@tanstack/react-table";
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

  return (
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
                        prevSort?.[0]?.id === header.id && !prevSort?.[0]?.desc,
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
        {table.getRowModel().rows.map((row) => {
          return (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
