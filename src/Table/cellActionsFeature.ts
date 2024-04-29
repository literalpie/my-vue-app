import { Cell, RowData, TableFeature } from "@tanstack/react-table";
import { ReactNode } from "react";
// define types for our new feature's custom state
export type CellAction = {
  label: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (data: Cell<unknown, unknown>) => void;
};

export interface CellActionColumn {
  cellActions?: CellAction[];
}
export interface CellActionColumnMeta {
  cellActions?: CellAction[];
}

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Column<TData extends RowData, TValue> extends CellActionColumn {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue>
    extends CellActionColumnMeta {}
}

export const cellActionsFeature: TableFeature<unknown> = {
  createColumn: (column): void => {
    column.cellActions = column.columnDef.meta?.cellActions;
  },
};
