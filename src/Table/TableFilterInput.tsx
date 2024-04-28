import React, { useContext } from "react";
import { TableContext } from "./ReusableTable";

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
