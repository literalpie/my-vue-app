import {
  flexRender,
  Row,
  TableState,
  Table,
  Cell,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import React from "react";
import { CellActions } from "./CellActions";

/** Only the rendering of a table - all state must be managed outside and passed in. */
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
                      flexGrow: header.column.getFlexSizing().grow,
                      flexShrink: header.column.getFlexSizing().shrink,
                      maxWidth: header.column.getFlexSizing().maxSize,
                      minWidth: header.column.getFlexSizing().minSize,
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
                    {header.column.getCanResize() && (
                      <div
                        style={{ cursor: "col-resize" }}
                        onMouseDown={header.getResizeHandler()}
                      >
                        I
                      </div>
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
                        display: "flex",
                        flexBasis: cell.column.getSize(),
                        flexGrow: cell.column.getFlexSizing().grow,
                        flexShrink: cell.column.getFlexSizing().shrink,
                        maxWidth: cell.column.getFlexSizing().maxSize,
                        minWidth: cell.column.getFlexSizing().minSize,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                      {(cell.column.cellActions?.length ?? 0) > 0 && (
                        <CellActions cell={cell as Cell<unknown, unknown>} />
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
