import { ReactNode, useContext } from "react";
import { TableContext } from "./ReusableTable";

export const SelectionActions = ({
  actionsRenderer,
}: {
  actionsRenderer?: (selectedRows: string[]) => ReactNode;
}) => {
  const table = useContext(TableContext);
  const selectedRowIds = Object.entries(table.getState().rowSelection).filter(
    (e) => e[1]
  );

  if (selectedRowIds.length === 0) {
    return undefined;
  }
  return (
    <div className="bg-blue-50 rounded-sm p-2 flex gap-2">
      <div className="content-center">
        {selectedRowIds.length} rows selected
      </div>
      <div>{actionsRenderer?.(selectedRowIds.map((row) => row[0]))}</div>
    </div>
  );
};
