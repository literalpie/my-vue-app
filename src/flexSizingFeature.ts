import { RowData, TableFeature } from "@tanstack/react-table";
// define types for our new feature's custom state
export type FlexSizingState = {
  grow: number;
  shrink: number;
  maxSize: number;
  minSize: number;
};

export interface FlexSizingColumn {
  getFlexSizing: () => FlexSizingState;
}
export interface FlexSizingColumnMeta {
  flexSizing: Partial<FlexSizingState>;
}

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Column<TData extends RowData, TValue> extends FlexSizingColumn {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue>
    extends FlexSizingColumnMeta {}
}

const defaultFlexSizingState: FlexSizingState = {
  grow: 1,
  shrink: 0,
  maxSize: 400,
  minSize: 100,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FlexSizingFeature: TableFeature<unknown> = {
  createColumn: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    column,
    table
  ): void => {
    column.getFlexSizing = () => {
      const columnSizing = table.getState().columnSizing[column.id];
      if (columnSizing) {
        return {
          grow: 0,
          shrink: 0,
          maxSize: columnSizing,
          minSize: columnSizing,
        };
      }
      return {
        ...defaultFlexSizingState,
        ...(column.columnDef.meta?.flexSizing ?? defaultFlexSizingState),
      };
    };
  },
  // maybe we could do something in createHeader to have things behave differently when resizing,
  // But I think allowing in columns while also allowing resizing would be difficult.
  // Would we have to calculate the flex widths ourselves so we know the widths of elements?
};
