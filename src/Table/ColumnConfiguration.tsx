import { flexRender } from "@tanstack/react-table";
import { useContext } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { cn } from "../lib/utils";
import { TableContext } from "./ReusableTable";

function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = array.slice();
  newArray.splice(
    to < 0 ? newArray.length + to : to,
    0,
    newArray.splice(from, 1)[0]
  );

  return newArray;
}

export const ColumnConfiguration = () => {
  const table = useContext(TableContext);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="btn">Manage Columns</button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <ul>
          {table.getState().columnOrder.map((columnId) => {
            const column = table.getColumn(columnId)!;
            return (
              <li>
                <div className={cn("flex justify-between")}>
                  <div>
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      onChange={() => column.toggleVisibility()}
                    />{" "}
                    {flexRender(
                      column.columnDef.header,
                      // There's probably a better way to get the header context for this
                      table
                        .getLeafHeaders()
                        .find((h) => h.column.id === column.id)!
                        .getContext()
                    )}
                  </div>
                  <div>
                    <button
                      className="btn btn-sm"
                      onClick={() => {
                        table.setColumnOrder((oldOrder) => {
                          const oldPosition = oldOrder.indexOf(column.id);
                          if (oldPosition >= 1) {
                            return arrayMove(
                              oldOrder,
                              oldPosition,
                              oldPosition - 1
                            );
                          }
                          return oldOrder;
                        });
                      }}
                    >
                      up
                    </button>{" "}
                    <button
                      className="btn btn-sm"
                      onClick={() => {
                        table.setColumnOrder((oldOrder) => {
                          const oldPosition = oldOrder.indexOf(column.id);
                          if (oldPosition + 1 < oldOrder.length) {
                            return arrayMove(
                              oldOrder,
                              oldPosition,
                              oldPosition + 1
                            );
                          }
                          return oldOrder;
                        });
                      }}
                    >
                      down
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
};
