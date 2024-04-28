import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getSortedRowModel,
  SortingState,
  OnChangeFn,
  Row,
  TableState,
  Table,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { createContext, useContext } from "react";

import { useState } from "react";

/** Only the rendering of a basic table - all state must be managed outside and passed in. */
export const TableDisplay = <T,>({
  table,
  totalCount,
  fetchMore,
}: {
  table: Table<T>;
  totalCount?: number;
  // Should this just give access to all virtualizer stuff? probably not
  fetchMore?: (info: {
    range: { startIndex: number; endIndex: number };
    tableState: TableState;
  }) => void;
}) => {
  const { rows } = table.getRowModel();
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: totalCount ?? table.getRowCount(),
    estimateSize: () => 45,
    getScrollElement: () => parentRef.current,
    overscan: 4,
    onChange: (change) => {
      if (
        change.range?.endIndex &&
        change.range?.endIndex + 5 > table.getRowCount()
      ) {
        fetchMore?.({ range: change.range, tableState: table.getState() });
      }
    },
  });

  return (
    <div ref={parentRef} style={{ height: "200px", overflow: "auto" }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} style={{ display: "flex" }}>
                {headerGroup.headers.map((header) => (
                  <th
                    style={{
                      flexBasis: header.column.getSize(),
                      flexGrow: 1,
                      flexShrink: 0,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                    key={header.id}
                  >
                    <div
                      style={{ cursor: "pointer" }}
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
                    </div>
                    <div
                      style={{ cursor: "col-resize" }}
                      onMouseDown={header.getResizeHandler()}
                    >
                      I
                    </div>
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
                  key={row?.id}
                  style={{
                    display: "flex",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${
                      virtualRow.start - index * virtualRow.size
                    }px)`,
                  }}
                >
                  {row?.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        flexBasis: cell.column.getSize(),
                        flexGrow: 1,
                        flexShrink: 0,
                      }}
                    >
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TableContext = createContext<Table<unknown>>(undefined as any);

export const TableFilterInput = () => {
  const table = useContext(TableContext);
  return (
    <label className="input input-bordered flex items-center gap-2 m-2 max-w-md">
      Filter:
      <input
        type="text"
        value={table.getState().globalFilter ?? ""}
        onChange={(change) => table.setGlobalFilter(change.target.value)}
      />
    </label>
  );
};

export const ReusableTable = <T,>({
  data,
  columns,
  sorting,
  onSortingChange,
  totalCount,
  fetchMore,
}: {
  data: T[];
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
  totalCount?: number;
  // Should this just give access to all virtualizer stuff? probably not
  fetchMore?: (info: {
    range: { startIndex: number; endIndex: number };
    tableState: TableState;
  }) => void;
}) => {
  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode: "onChange",
    data,
    columns,
  });
  const [state, setState] = useState({
    ...table.initialState,
    sorting: sorting ?? table.initialState.sorting,
    // other passed-in state
  });
  /** The current state of the table, including state that comes from props */
  const mergedState: TableState = {
    ...table.initialState,
    ...table.getState(),
    ...state,
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
    <TableContext.Provider value={table as Table<unknown>}>
      <div>
        <TableFilterInput />
        <TableDisplay
          table={table}
          totalCount={totalCount}
          fetchMore={fetchMore}
        />
      </div>
    </TableContext.Provider>
  );
};
