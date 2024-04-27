import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import "./App.css";

type Project = {
  title: string;
  stars: number;
  author: string;
};

const data: Project[] = [
  {
    author: "literalpie",
    title: "storybook-addon-rtl",
    stars: 5,
  },
  {
    author: "literalpie",
    title: "storybook-addon-knobs",
    stars: 2859,
  },
  {
    author: "literalpie",
    title: "squatAR",
    stars: 1,
  },
  {
    author: "literalpie",
    title: "memorypie",
    stars: 8,
  },
];
const columnHelper = createColumnHelper<Project>();
export const ManualTable = () => {
  const table = useReactTable({
    data,
    columns: [
      columnHelper.accessor("title", {}),
      columnHelper.accessor("author", {}),
      columnHelper.accessor("stars", {}),
    ],
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <table className="table">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => {
          return (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
