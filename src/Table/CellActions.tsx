import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Cell } from "@tanstack/react-table";

export const CellActions = ({ cell }: { cell: Cell<unknown, unknown> }) => {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <button className="btn btn-sm">...</button>
        </PopoverTrigger>
        <PopoverContent>
          {cell.column.cellActions?.map((action, index) => {
            return (
              <button
                key={index}
                className="btn"
                onClick={() => action.action(cell)}
              >
                {action.label}
              </button>
            );
          })}
        </PopoverContent>
      </Popover>
    </div>
  );
};
