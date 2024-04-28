import { ColumnDef } from "@tanstack/react-table";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectionColumn: ColumnDef<any> = {
  id: "selection",
  header: (props) => (
    <input
      type="checkbox"
      checked={props.table.getIsAllRowsSelected()}
      onChange={props.table.getToggleAllRowsSelectedHandler()}
    />
  ),
  cell: (props) => (
    <input
      type="checkbox"
      checked={props.row.getIsSelected()}
      onChange={props.row.getToggleSelectedHandler()}
    />
  ),
  enableResizing: false,
  size: 30,
  meta: {
    flexSizing: {
      grow: 0,
      minSize: 0,
    },
  },
};
