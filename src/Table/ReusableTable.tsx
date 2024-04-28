import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  getSortedRowModel,
  SortingState,
  OnChangeFn,
  TableState,
  Table,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ReactNode, createContext } from "react";

import { useState } from "react";
import { FlexSizingFeature } from "../flexSizingFeature";
import { TableFilterInput } from "./TableFilterInput";
import { ColumnConfiguration } from "./ColumnConfiguration";
import { TableDisplay } from "./TableDisplay";
import { SelectionActions } from "./SelectionActions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TableContext = createContext<Table<unknown>>(undefined as any);

export const ReusableTable = <T,>({
  data,
  columns,
  sorting,
  onSortingChange,
  totalCount,
  fetchMore,
  selectionActionsRenderer,
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
  // defaultColumn would be good.
  selectionActionsRenderer?: (selectedRowIds: string[]) => ReactNode;
}) => {
  const table = useReactTable({
    _features: [FlexSizingFeature],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode: "onChange",
    data,
    columns,
  });
  const [state, setState] = useState({
    ...table.initialState,
    // is there a better way to get IDs without requiring user to set ID?
    columnOrder: columns.map((c) => c.id).filter(Boolean) as string[],
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
        <div className="flex justify-end">
          <SelectionActions actionsRenderer={selectionActionsRenderer} />
          <ColumnConfiguration />
          <TableFilterInput />
        </div>
        <TableDisplay
          table={table}
          totalCount={totalCount}
          fetchMore={fetchMore}
        />
      </div>
    </TableContext.Provider>
  );
};
